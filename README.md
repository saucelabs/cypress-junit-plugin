# @saucelabs/cypress-junit-plugin

`@saucelabs/cypress-junit-plugin`, a plugin designed to enhance your Cypress testing workflow by generating JUnit test reports.

## Features

- **JUnit Report Generation**: Automatically generates JUnit-formatted test reports from Cypress test runs, making it easy to integrate with a variety of CI/CD and test reporting tools.
- **Customizable Report Formatting**: Offers options to customize the output of the JUnit reports to meet different requirements or preferences.

## Prerequisites

Cypress Version: This plugin only supports Cypress version 10 and above. Ensure your project is updated to comply with this requirement.

## Installation

Install the plugin via npm by running the following command in your project directory:

```bash
npm install @saucelabs/cypress-junit-plugin --save-dev
```

## Configuration

After installation, you need to configure the plugin to work with your Cypress setup.

`cypress.config.mjs` example:

```javascript
import { defineConfig } from 'cypress'
import reporter from '@saucelabs/cypress-junit-plugin'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      reporter.default(on, config,
        { filename: "path/to/my_junit.xml" }
      )
      return config
    }
  },
})
```

`cypress.config.cjs` example:
const { defineConfig } = require('cypress');

```javascript
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

Run your Cypress tests as you normally would. The plugin will automatically generate a JUnit report in the specified location(default: `junit.xml`) after the test run completes.

```bash
cypress run
```

## Contributing

We welcome contributions to the `@saucelabs/cypress-junit-plugin`! Please read our contributing guidelines for more information on how to get involved.

## Support

If you encounter any issues or have questions about using the plugin, please file an issue on our GitHub repository.

## License

This plugin is released under the [MIT License](LICENSE).
