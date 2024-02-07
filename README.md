# @saucelabs/cypress-junit-plugin

`@saucelabs/cypress-junit-plugin` is a third-party plugin designed to enhance your Cypress testing workflow by generating comprehensive JUnit test reports.

Please be aware that this plugin is not an official product of Sauce Labs.

## Unique Features

- **Unified Report Generation**: Unlike other Cypress JUnit reporters/plugins, this plugin generates a single, consolidated JUnit file for the entire test run, rather than creating a separate JUnit file for each spec file. This approach simplifies integration with CI/CD pipelines and test reporting tools.
- **Rich Content in Reports**: Provides more detailed content in the JUnit reports, offering deeper insights into your test runs compared to other solutions.

## Prerequisites

**Cypress Version**: This plugin is compatible with Cypress version 13 and above. Make sure your project is updated to meet this version requirement.

## Installation

To install the plugin, run the following command in your project directory:

```bash
npm install @saucelabs/cypress-junit-plugin --save-dev
```

## Configuration

After installation, configure the plugin to work with your Cypress setup.

### `cypress.config.mjs` Example:

```javascript
import { defineConfig } from 'cypress';
import reporter from '@saucelabs/cypress-junit-plugin';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      reporter.default(on, config, { filename: "path/to/my_junit.xml" });
      return config;
    }
  },
});
```

### `cypress.config.cjs` Example:

```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@saucelabs/cypress-junit-plugin').default(on, config, { filename: 'path/to/my_junit.xml' });
      return config;
    },
  },
});
```

## Usage

Simply run your Cypress tests as usual. The plugin will automatically generate a JUnit report at the specified location (default: `junit.xml`) after the test run is complete.

```bash
cypress run
```

## Contributing

Contributions to the `@saucelabs/cypress-junit-plugin` are welcome! Check out our contributing guidelines for more information on how to participate.

## Support

If you run into any issues or have questions about the plugin, feel free to open an issue on our GitHub repository.

## License

This plugin is released under the [MIT License](LICENSE).
