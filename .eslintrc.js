module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: ['standard-with-typescript', 'plugin:jest/recommended', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // this is handled by prettier
    '@typescript-eslint/space-before-function-paren': 0,
    // this is annoying for variables that are X | undefined
    '@typescript-eslint/strict-boolean-expressions': 0,
  },
  ignorePatterns: [
    'app/templates/src/index.ts',
    'app/templates/__tests__/index.test.ts',
    'app/index.js',
  ],
}
