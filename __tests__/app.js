const { join } = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')
const { readFileSync } = require('fs')

const name = 'test'

describe('generator-xavdid:app', () => {
  it('creates files', async () => {
    const runDir = await helpers
      .run(join(__dirname, '../app'))
      // since Backend has no packages. typedi fails and it's weird. so use CLI
      .withPrompts({ area: ['CLI'], name })

    const resPath = (fname) => join(runDir, name, fname)

    assert.file([
      'src/index.ts',
      'tsconfig.json',
      'src/__tests__/index.test.ts',
      '.gitignore',
      'package.json',
      // not sure why this was here, afaik nothing creates it
      // '.vscode/settings.json',
      '.eslintrc.js',
    ])

    assert.noFile(['.npmignore', 'gitignore', 'eslint.js'])

    const pkg = require(require.resolve(resPath('package.json')))
    expect(pkg.name).toEqual(name)
    // these don't get installed during test, so I can't make assertions about them being filled in
    // expect(pkg.devDependencies['eslint-config-xavdid']).toBeDefined()
    // expect(
    //   pkg.devDependencies['eslint-config-xavdid-with-react']
    // ).toBeUndefined()

    const eslintRc = require(resPath('.eslintrc.js'))
    expect(eslintRc.extends).toEqual('xavdid')
    expect(eslintRc.root).toEqual(true)
    // by the time we evaluate it, `__dirname` will have been evaluated, so we can't assert much about it
    expect(eslintRc.parserOptions.project).toBeDefined()

    const gitIgnore = readFileSync(resPath('.gitignore'), 'utf-8')
    const lines = gitIgnore.split('\n')
    expect(lines.length).toBeGreaterThan(20)
  })

  // would be cool to have tests around hndling the path
})
