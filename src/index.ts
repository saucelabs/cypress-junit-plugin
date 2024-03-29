import RunResult = CypressCommandLine.RunResult;
import CypressRunResult = CypressCommandLine.CypressRunResult;
import CypressFailedRunResult = CypressCommandLine.CypressFailedRunResult;
import BeforeRunDetails = Cypress.BeforeRunDetails;
import PluginConfigOptions = Cypress.PluginConfigOptions;
import PluginEvents = Cypress.PluginEvents;
import Spec = Cypress.Spec;
import { ConfigOptions } from './type';
import { Reporter, TestCase, TestSuite } from './reporter';

let reporter: Reporter;

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
  reporter.addTestSuite(testsuite);
}

function isFailedRunResult(
  maybe: CypressRunResult | CypressFailedRunResult,
): maybe is CypressFailedRunResult {
  return (maybe as CypressFailedRunResult).status === 'failed';
}

function onAfterRun(results: CypressRunResult | CypressFailedRunResult) {
  if (isFailedRunResult(results)) {
    reporter.setFailures(results.failures);
  } else {
    reporter.setTests(results.totalTests);
    reporter.setFailures(results.totalFailed);
    reporter.setTime(msToSec(results.totalDuration));
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

/**
 * Set up the JUnit plugin for Cypress. A JUnit report will be generated at the
 * end of the Cypress run.
 */
export function setupJUnitPlugin(
  on: PluginEvents,
  config: PluginConfigOptions,
  opts?: ConfigOptions,
) {
  reporter = new Reporter(
    opts || {
      filename: 'junit.xml',
    },
  );

  on('before:run', function (details: BeforeRunDetails) {
    reporter.setSuiteName(
      `Cypress Test - ${config.projectName} ${details.browser?.displayName || ''}`,
    );
  });

  on('after:run', onAfterRun);
  on('after:spec', onAfterSpec);
  return config;
}

/**
 * Create a JUnit report from the results of a Cypress run. You can use this
 * function when running Cypress via its module API.
 * If you are using the Cypress CLI, call `setupJUnitPlugin()` from your config
 * file instead.
 */
export function createJUnitReport(
  results: CypressRunResult | CypressFailedRunResult,
  opts?: ConfigOptions,
) {
  reporter = new Reporter(
    opts || {
      filename: 'junit.xml',
    },
  );

  if (isFailedRunResult(results)) {
    onAfterRun(results);
    return;
  }

  reporter.setSuiteName(`Cypress Test - ${results.browserName}`);
  results.runs.forEach((run) => {
    onAfterSpec(run.spec, run);
  });

  onAfterRun(results);
}
