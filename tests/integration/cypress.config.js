const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      require('../../src/index').default(on, config, { filename: 'junit.xml' });
      return config;
    },
  },
});
