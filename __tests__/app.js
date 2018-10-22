'use strict'
const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

describe('generator-xavdid:app', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ area: ['Backend'] })
  })

  it('creates files', () => {
    assert.file(['src/index.ts'])
    assert.file(['tsconfig.json'])
  })

  // would be cool to have tests around hndling the path
})
