const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('../../src/index').default(on, config, { filename: 'junit.xml' });
      return config;
    },
  },
});
