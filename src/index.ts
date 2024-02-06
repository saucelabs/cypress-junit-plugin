import escape from 'xml-escape';
import * as Cypress from 'cypress';
import BeforeRunDetails = Cypress.BeforeRunDetails;
import PluginConfigOptions = Cypress.PluginConfigOptions;
import PluginEvents = Cypress.PluginEvents;
import Spec = Cypress.Spec;
import { ConfigOption, JUnitTestSuite } from './type';
import Reporter, { TestCase, TestSuite } from './reporter';

let reporter: Reporter;

const onBeforeRun = function (details: BeforeRunDetails) {
  reporter.junitSuite.name = `Cypress Test - ${(details.config as any)?.projectName} ${details.browser?.displayName}`;
};

const onAfterSpec = async function (
  spec: Spec,
  results: CypressCommandLine.RunResult,
) {
  let testsuite = new TestSuite();
  let errCount = 0;
  results.tests.forEach((test) => {
    let testcase = new TestCase(
      test.title.join(' '),
      test.title.length ? test.title[test.title.length - 1] : '',
      msToSec(test.duration),
      spec.relative || '',
    );
    if (test.state === 'failed') {
      testcase.failure = {
        message: escape(test.displayError || ''),
        type: parseErrorType(test.displayError || ''),
        details: test.displayError || undefined,
      };
    }
    if (results.error) {
      testcase.error = {
        message: escape(results.error),
        type: 'error',
        details: results.error,
      };
      errCount += 1;
    }
    testsuite.add(testcase);
  });

  testsuite.name = spec.name;
  testsuite.tests = results.stats.tests;
  testsuite.failures = results.stats.failures;
  testsuite.errors = errCount;
  testsuite.time = getDuration(results.stats.startedAt, results.stats.endedAt);
  testsuite.timestamp = results.stats.startedAt;
  testsuite.file = spec.relative || '';

  if (results.screenshots) {
    testsuite.properties = testsuite.properties || [];
    results.screenshots.forEach((s) => {
      testsuite.properties?.push({
        name: 'attachment',
        value: s.path,
      });
    });
  }
  if (results.video) {
    testsuite.properties = testsuite.properties || [];
    testsuite.properties?.push({
      name: 'attachment',
      value: results.video,
    });
  }
  reporter.junitSuite.testsuites?.push(testsuite);
};

const onAfterRun = function (results: any) {
  reporter.junitSuite.tests = results.totalTests;
  reporter.junitSuite.failures = results.totalFailed;
  reporter.junitSuite.time = msToSec(results.totalDuration);

  reporter.toJUnitFile();
};

const getDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs: number = end.getTime() - start.getTime();

  return msToSec(durationMs);
};

const msToSec = (durationMs: number): number => {
  return durationMs / 1000;
};

const parseErrorType = (err: string): string => {
  const items = err.split(' ');
  if (items.length > 1) {
    return items[0].replaceAll(':', '');
  }
  return '';
};

export default function (
  on: PluginEvents,
  config: PluginConfigOptions,
  opts?: ConfigOption,
) {
  reporter = new Reporter(
    {
      testsuites: [] as JUnitTestSuite[],
    } as JUnitTestSuite,
    opts ||
      ({
        filename: 'junit.xml',
      } as ConfigOption),
  );

  on('before:run', onBeforeRun);
  on('after:run', onAfterRun);
  on('after:spec', onAfterSpec);
  return config;
}
