module.exports = {
  root: true,
  extends: '@xavdid',
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: [
    // tsc complains because these aren't part of my project
    'app/templates/src/index.ts',
    'app/templates/__tests__/index.test.ts',
    'app/index.js',
    '__tests__',
  ],
}
