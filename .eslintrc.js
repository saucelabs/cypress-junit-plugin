module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'cypress'],
  root: true,
  env: {
    node: true,
  },
  globals: {
    // This is necessary because Eslint is unaware of the global namespace provided by Cypress.
    // By declaring it within this project, we inform Eslint about its existence.
    CypressCommandLine: 'readonly',
  },
};
