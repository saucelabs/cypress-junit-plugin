const { defineConfig } = require('cypress');
const { setupJUnitPlugin } = require('../../src/index')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      setupJUnitPlugin(on, config, { filename: 'junit.xml' });
      return config;
    },
  },
});
