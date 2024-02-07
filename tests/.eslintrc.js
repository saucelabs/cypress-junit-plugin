module.exports = {
  root: true,
  plugins: ['jest'],
  rules: {
    'no-var-requires': 0,
  },
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
};
