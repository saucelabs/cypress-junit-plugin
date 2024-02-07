module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'cypress'],
  root: true,
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    'no-undef': 1,
  },
  env: {
    node: true,
  },
};
