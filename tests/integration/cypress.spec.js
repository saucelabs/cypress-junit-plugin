require('jest');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

describe('generate JUnit file', function () {
  const junitFile = path.join(__dirname, 'junit.xml');

  beforeAll(async function () {
    if (fs.existsSync(junitFile)) {
      fs.rmSync(junitFile);
    }
    const cypressRunCommand = 'cypress run &> /dev/null';

    try {
      execSync(cypressRunCommand, {
        encoding: 'utf8',
        shell: true,
        cwd: __dirname,
      });
    } catch (error) {}
  }, 30000);

  test('JUnit report is generated', function () {
    execSync('ls');
    expect(fs.existsSync(junitFile)).toBe(true);

    const data = fs.readFileSync(junitFile, 'utf8');
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    let jObj = parser.parse(data);
    expect(jObj['testsuites']).not.toBeNull();

    const testsuites = jObj['testsuites'];
    expect(testsuites['@_name']).toBe('Cypress Test - integration Electron');
    expect(testsuites['@_tests']).toBe('3');
    expect(testsuites['@_failures']).toBe('2');
    expect(testsuites['testsuite'].length).toBe(2);

    const testsuite = testsuites['testsuite'][0];
    expect(testsuite['@_name']).toBe('actions.cy.js');
    expect(testsuite['@_tests']).toBe('2');
    expect(testsuite['@_failures']).toBe('1');
    expect(testsuite['testcase'].length).toBe(2);
    expect(testsuite['properties']['property'].length).toBe(2);

    const testcase = testsuite['testcase'][0];
    expect(testcase['@_name']).toBe(
      'Actions .type() - type into a DOM element',
    );
    expect(testcase['@_file']).toBe('cypress/e2e/examples/actions.cy.js');
    expect(testcase['failure']).not.toBeNull();

    const property = testsuite['properties']['property'][0];
    expect(property['@_name']).toBe('attachment');
    expect(property['@_value']).toMatch(/screenshots/);
  });
});
