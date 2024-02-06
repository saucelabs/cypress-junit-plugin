import * as fs from 'fs';
import * as path from 'path';
import type {
  JUnitTestSuite,
  JUnitTestCase,
  failure,
  error,
  Property,
  ConfigOption,
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
  testsuites: JUnitTestSuite[] | undefined;
  testCases: JUnitTestCase[];
  properties?: Property[] | undefined;

  constructor() {
    this.name = '';
    this.time = 0;
    this.tests = 0;
    this.failures = 0;
    this.errors = 0;
    this.timestamp = '';
    this.file = '';
    this.testCases = [];
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
  failure?: failure | undefined;
  error?: error | undefined;

  constructor(name: string, classname: string, time: number, file: string) {
    this.name = name;
    this.classname = classname;
    this.time = time;
    this.file = file;
  }
}

export default class Reporter {
  public junitSuite: JUnitTestSuite;
  private opts: ConfigOption;

  constructor(junitTestSuite: JUnitTestSuite, opts: ConfigOption) {
    this.junitSuite = junitTestSuite;
    this.opts = opts;
  }

  toJUnitFile() {
    const obj = {
      testsuites: {
        '@name': this.junitSuite.name,
        '@tests': this.junitSuite.tests,
        '@failures': this.junitSuite.failures,
        '@time': this.junitSuite.time,
        '@errors': this.junitSuite.errors,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        testsuite: [] as any[],
      },
    };
    this.junitSuite.testsuites?.forEach((suite) => {
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
      console.error(`Failed to generate JUnit file(${filename}): `, err);
    }
  }
}
