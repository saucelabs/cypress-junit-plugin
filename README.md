# @saucelabs/cypress-junit-plugin

`@saucelabs/cypress-junit-plugin` is a third-party plugin designed to enhance your Cypress testing workflow by generating comprehensive JUnit test reports.

Please be aware that this plugin is not an official product of Sauce Labs.

## Unique Features

Unlike Cypress' built-in [junit reporter](https://docs.cypress.io/guides/tooling/reporters), this plugin generates a single, consolidated JUnit file for the entire test run, rather than individual files per spec that then need to be merged.

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
import { setupJUnitPlugin } from '@saucelabs/cypress-junit-plugin';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      setupJUnitPlugin(on, config, { filename: "path/to/my_junit.xml" });
      return config;
    }
  },
});
```

### `cypress.config.cjs` Example:

```javascript
const { defineConfig } = require('cypress');
const { setupJUnitPlugin } = require('@saucelabs/cypress-junit-plugin');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      setupJUnitPlugin(on, config, { filename: 'path/to/my_junit.xml' });
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
