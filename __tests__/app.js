const { join } = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

const name = 'test'

describe('generator-xavdid:app', () => {
  it('creates files', async () => {
    const runDir = await helpers
      .run(join(__dirname, '../app'))
      // since Backend has no packages. typedi fails and it's weird. so use CLI
      .withPrompts({ area: ['CLI'], name })

    assert.file([
      'src/index.ts',
      'tsconfig.json',
      'src/__tests__/index.test.ts',
      '.gitignore',
      'package.json',
      '.vscode/settings.json',
      '.eslintrc.js',
    ])

    const pkg = require(join(runDir, name, 'package.json'))
    expect(pkg.name).toEqual(name)
  })

  // would be cool to have tests around hndling the path
})
