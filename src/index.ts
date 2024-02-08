import RunResult = CypressCommandLine.RunResult;
import CypressRunResult = CypressCommandLine.CypressRunResult;
import CypressFailedRunResult = CypressCommandLine.CypressFailedRunResult;
import BeforeRunDetails = Cypress.BeforeRunDetails;
import PluginConfigOptions = Cypress.PluginConfigOptions;
import PluginEvents = Cypress.PluginEvents;
import Spec = Cypress.Spec;
import { ConfigOption, JUnitTestSuite } from './type';
import Reporter, { TestCase, TestSuite } from './reporter';

let reporter: Reporter;

function onBeforeRun(details: BeforeRunDetails) {
  // The `projectName` is not officially documented in Cypress documentation.
  // As used in this context, it represents the basename of the current working directory.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reporter.junitSuite.name = `Cypress Test - ${(details.config as any)?.projectName} ${details.browser?.displayName}`;
}

function onAfterSpec(spec: Spec, results: RunResult) {
  const testsuite = new TestSuite();
  let errCount = 0;
  results.tests.forEach((test) => {
    const testcase = new TestCase(
      // `test.title` includes both the context name (defined in 'describe' or 'context' blocks within Cypress)
      // and the specific test name.
      // The last part of `test.title` is the test name itself.
      // Anything before the last part is the context name.
      // Consequently, the JUnit testcase name is constructed by combining the context name with the test name.
      test.title.join(' '),
      test.title.length ? test.title[test.title.length - 1] : '',
      msToSec(test.duration),
      spec.relative || '',
    );
    if (test.state === 'failed') {
      testcase.failure = {
        message: test.displayError || '',
        type: parseErrorType(test.displayError || ''),
        details: test.displayError || undefined,
      };
    }
    if (results.error) {
      testcase.error = {
        message: results.error,
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
}

function isFailedRunResult(
  maybe: CypressRunResult | CypressFailedRunResult,
): maybe is CypressFailedRunResult {
  return (maybe as CypressFailedRunResult).status === 'failed';
}

function onAfterRun(results: CypressRunResult | CypressFailedRunResult) {
  if (isFailedRunResult(results)) {
    reporter.junitSuite.failures = results.failures;
  } else {
    reporter.junitSuite.tests = results.totalTests;
    reporter.junitSuite.failures = results.totalFailed;
    reporter.junitSuite.time = msToSec(results.totalDuration);
  }

  reporter.toJUnitFile();
}

function getDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs: number = end.getTime() - start.getTime();

  return msToSec(durationMs);
}

function msToSec(durationMs: number): number {
  return durationMs / 1000;
}

/**
 * Extracts the error type from a given error message string.
 * This function is particularly useful in contexts where Cypress error objects do not explicitly provide an error type field.
 * The function assumes that the error type is specified at the beginning of the error message, followed by a colon.
 *
 * @param {string} err - The error message from which to extract the error type.
 * @returns {string} The extracted error type without the colon and details.
 *                   Returns an empty string if the error type cannot be determined.
 *
 * @example
 * Input: "AssertionError: Timed out retrying after 4000ms".
 * Output: "AssertionError".
 */
function parseErrorType(err: string): string {
  const items = err.split(' ');
  if (items.length > 1) {
    return items[0].replaceAll(':', '');
  }
  return '';
}

export function setupJUnitPlugin(
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
