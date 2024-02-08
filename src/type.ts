/**
 * Defines the structure for configuration options.
 */
export interface ConfigOption {
  // Name/path of the JUnit file.
  filename: string;
}

/**
 * Represents the structure of a JUnit test suite, detailing its composition and outcomes.
 */
export interface JUnitTestSuite {
  // The name of the JUnit test suite.
  name: string;
  // Total number of tests included in the suite.
  tests: number;
  // Count of tests that failed.
  failures: number;
  // Number of tests that encountered errors.
  errors: number;
  // Execution time for the entire test suite, in seconds.
  time: number;
  // Date and time of when the test suite was executed (in ISO 8601 format).
  timestamp: string;
  // Source code file of this test suite.
  file: string;
  // Array of JUnitTestSuite objects, each representing an individual test suite.
  testSuites: JUnitTestSuite[];
  // Array of JUnitTestCase objects, each representing an individual test case.
  testCases: JUnitTestCase[];
  // Array of Property objects for specifying additional metadata related to the test suite.
  properties?: Property[];
}

/**
 * Defines the structure and details of an individual test case within a JUnit test suite.
 */
export interface JUnitTestCase {
  // The name of the test case, typically describing the test being performed.
  name: string;
  // The name of the class or group to which this test case belongs.
  classname: string;
  // The duration of the test case execution, in seconds.
  time: number;
  // Source code file of this test suite.
  file: string;
  // Details of the test failure, if the test did not pass successfully.
  failure?: failure;
  // Details of any error encountered during the test case execution.
  error?: error;
  // Array of additional metadata properties related to the test case.
  properties?: Property[];
}

/**
 * Represents a key-value pair used to provide additional metadata for a JUnit test suite or test case.
 * This can include various configurations, environmental information, or any other data relevant to the test execution context.
 */
export interface Property {
  // The name (key) of the property, identifying the type of metadata being stored.
  name: string;
  // The value of the property, containing the metadata or information corresponding to the name.
  value: string;
}

/**
 * Describes the structure of a failure in a JUnit test case.
 * A failure typically indicates an assertion error or an unexpected result from the test logic.
 */
export interface failure {
  // A summary or description of the failure encountered during test execution.
  message: string;
  // The classification or category of the failure, often indicating the nature of the assertion or error.
  type: string;
  // Provides additional information or the complete error message associated with the failure,
  // including stack traces or more specific details about the assertion failure.
  details?: string;
}

/**
 * Defines the structure for an error in a JUnit test case.
 * Unlike a failure, an error typically signifies an unexpected exception or problem that occurred during the test execution,
 * preventing it from completing successfully.
 */
export interface error {
  // A brief description of the error that occurred during the test.
  message: string;
  // The type or category of the error, often indicating the exception class or error type.
  type: string;
  // Provides comprehensive information about the error, including stack traces or specifics of the exception,
  // which can help in diagnosing the problem.
  details: string;
}
