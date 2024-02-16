import * as fs from 'fs';
import * as path from 'path';
import type {
  JUnitTestSuite,
  JUnitTestCase,
  Failure,
  Error,
  Property,
  ConfigOptions,
} from './type';
import { create } from 'xmlbuilder2';

export class TestSuite implements JUnitTestSuite {
  name: string;
  tests: number;
  failures: number;
  errors: number;
  time: number;
  timestamp: string;
  file: string;
  testSuites: JUnitTestSuite[];
  testCases: JUnitTestCase[];
  properties?: Property[];

  constructor() {
    this.name = '';
    this.time = 0;
    this.tests = 0;
    this.failures = 0;
    this.errors = 0;
    this.timestamp = '';
    this.file = '';
    this.testCases = [];
    this.testSuites = [];
  }

  add(testcase: JUnitTestCase) {
    this.testCases.push(testcase);
  }
}

export class TestCase implements JUnitTestCase {
  name: string;
  classname: string;
  time: number;
  file: string;
  failure?: Failure | undefined;
  error?: Error | undefined;

  constructor(name: string, classname: string, time: number, file: string) {
    this.name = name;
    this.classname = classname;
    this.time = time;
    this.file = file;
  }
}

export class Reporter {
  public rootSuite: JUnitTestSuite;
  private opts: ConfigOptions;

  constructor(opts: ConfigOptions) {
    this.rootSuite = new TestSuite();
    this.opts = opts;
  }

  // Adds a JUnit test suite to the collection of test suites.
  addTestSuite(suite: JUnitTestSuite) {
    this.rootSuite.testSuites.push(suite);
  }

  // Sets the total number of failures for the entire run.
  setFailures(failures: number) {
    this.rootSuite.failures = failures;
  }

  // Sets the total number of tests for the entire run.
  setTests(tests: number) {
    this.rootSuite.tests = tests;
  }

  // Sets the total duration in seconds for the entire run.
  setTime(time: number) {
    this.rootSuite.time = time;
  }

  // Sets the name of the root test suite.
  setSuiteName(name: string) {
    this.rootSuite.name = name;
  }

  toJUnitFile() {
    const obj = {
      testsuites: {
        '@name': this.rootSuite.name,
        '@tests': this.rootSuite.tests,
        '@failures': this.rootSuite.failures,
        '@time': this.rootSuite.time,
        '@errors': this.rootSuite.errors,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        testsuite: [] as any[],
      },
    };
    this.rootSuite.testSuites.forEach((suite) => {
      const testsuite = {
        '@name': suite.name,
        '@tests': suite.tests,
        '@failures': suite.failures,
        '@errors': suite.errors,
        '@time': suite.time,
        '@timestamp': suite.timestamp,
        '@file': suite.file,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        testcase: [] as any[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        properties: suite.properties ? ({} as any) : undefined,
      };
      if (suite.properties) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const properties = { property: [] as any[] };
        suite.properties.forEach((p) => {
          properties.property.push({
            '@name': p.name,
            '@value': p.value,
          });
        });
        testsuite.properties = properties;
      }
      suite.testCases.forEach((t) => {
        testsuite.testcase.push({
          '@name': t.name,
          '@classname': t.classname,
          '@time': t.time,
          '@file': t.file,
          failure: t.failure
            ? {
                '@message': t.failure?.message,
                '@type': t.failure?.type,
                $: t.failure?.details,
              }
            : undefined,
          error: t.error
            ? {
                '@message': t.error?.message,
                '@type': t.error?.type,
                $: t.error?.details,
              }
            : undefined,
        });
      });
      obj.testsuites.testsuite.push(testsuite);
    });

    const doc = create().ele(obj);
    const content = doc.end({ prettyPrint: true });
    const filename = this.opts.filename;
    try {
      // Ensure the directory exists.
      const dirPath = path.dirname(filename);
      fs.mkdirSync(dirPath, { recursive: true });

      // Write the file.
      fs.writeFileSync(filename, content);
    } catch (err) {
      console.error(`Failed to generate JUnit file(${filename}):`, err);
    }
  }
}
