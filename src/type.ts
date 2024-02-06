/**
 * Defines the structure for configuration options.
 *
 * @export
 * @interface ConfigOption
 * @property {string} filename - Name/path of the JUnit file.
 */
export interface ConfigOption {
  filename: string;
}

/**
 * Represents the structure of a JUnit test suite, detailing its composition and outcomes.
 *
 * @export
 * @interface JUnitTestSuite
 *
 * @property {string} name - The name of the JUnit test suite.
 * @property {number} tests - Total number of tests included in the suite.
 * @property {number} failures - Count of tests that failed.
 * @property {number} errors - Number of tests that encountered errors.
 * @property {number} time - Execution time for the entire test suite, in seconds.
 * @property {string} timestamp - Date and time of when the test suite was executed (in ISO 8601 format).
 * @property {string} file - Source code file of this test suite.
 * @property {JUnitTestSuite[]} testsuites - Optional; array of JUnitTestSuite objects, each representing an individual test suite.
 * @property {JUnitTestCase[]} testCases - Array of JUnitTestCase objects, each representing an individual test case.
 * @property {Property[]} [properties] - Optional; array of Property objects for specifying additional metadata related to the test suite.
 */
export interface JUnitTestSuite {
  name: string;
  tests: number;
  failures: number;
  errors: number;
  time: number;
  timestamp: string;
  file: string;
  testsuites?: JUnitTestSuite[];
  testCases: JUnitTestCase[];
  properties?: Property[];
}

/**
 * Defines the structure and details of an individual test case within a JUnit test suite.
 *
 * @export
 * @interface JUnitTestCase
 *
 * @property {string} name - The name of the test case, typically describing the test being performed.
 * @property {string} classname - The name of the class or group to which this test case belongs.
 * @property {number} time - The duration of the test case execution, in seconds.
 * @property {string} file - Source code file of this test suite.
 * @property {failure} [failure] - Optional; details of the test failure, if the test did not pass successfully.
 *                                This includes information like the failure message and type.
 * @property {error} [error] - Optional; details of any error encountered during the test case execution,
 *                             distinct from a test failure, with error message and type.
 * @property {Property[]} [properties] - Optional; an array of additional metadata properties related to the test case.
 */
export interface JUnitTestCase {
  name: string;
  classname: string;
  time: number;
  file: string;
  failure?: failure;
  error?: error;
  properties?: Property[];
}

/**
 * Represents a key-value pair used to provide additional metadata for a JUnit test suite or test case.
 *
 * This can include various configurations, environmental information, or any other data relevant to the test execution context.
 *
 * @export
 * @interface Property
 *
 * @property {string} name - The name (key) of the property, identifying the type of metadata being stored.
 * @property {string} value - The value of the property, containing the metadata or information corresponding to the name.
 */
export interface Property {
  name: string;
  value: string;
}

/**
 * Describes the structure of a failure in a JUnit test case.
 * A failure typically indicates an assertion error or an unexpected result from the test logic.
 *
 * @export
 * @interface failure
 *
 * @property {string} message - A summary or description of the failure encountered during test execution.
 * @property {string} type - The classification or category of the failure, often indicating the nature of the assertion or error.
 * @property {string} [details] - Optional; provides additional information or the complete error message associated with the failure,
 *                                including stack traces or more specific details about the assertion failure.
 */

export interface failure {
  message: string;
  type: string;
  details?: string;
}

/**
 * Defines the structure for an error in a JUnit test case.
 * Unlike a failure, an error typically signifies an unexpected exception or problem that occurred during the test execution,
 * preventing it from completing successfully.
 *
 * @export
 * @interface error
 *
 * @property {string} message - A brief description of the error that occurred during the test.
 * @property {string} type - The type or category of the error, often indicating the exception class or error type.
 * @property {string} details - Provides comprehensive information about the error, including stack traces or specifics of the exception,
 *                              which can help in diagnosing the problem.
 */

export interface error {
  message: string;
  type: string;
  details: string;
}
