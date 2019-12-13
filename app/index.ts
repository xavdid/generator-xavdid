import Generator = require('yeoman-generator')
import typedInstall from 'typed-install'
import { basename } from 'path'
import chalk from 'chalk'

interface Bitmap {
  [x: string]: boolean
}

const pkgJSON = {
  version: '0.0.0',
  description: '',
  main: 'lib/index.js',
  typings: 'lib/index.d.ts',
  scripts: {
    build: 'tsc',
    lint: 'tslint -p .',
    test: 'jest',
    validate: 'yarn test && yarn lint',
    release: 'npx np'
  },
  keywords: [],
  files: ['lib/*.js', 'lib/index.d.ts'],
  author: {
    name: 'David Brownman',
    email: 'beamneocube@gmail.com',
    url: 'https://davidbrownman.com'
  },
  license: 'ISC',
  jest: {
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  },
  prettier: {
    semi: false,
    singleQuote: true
  }
}

export = class App extends Generator {
  answers: Bitmap = {}
  options!: { name?: string }
  name: string | undefined

  constructor(args: string[], opts: any) {
    super(args, opts)

    this.argument('name', {
      type: String,
      required: false,
      description: 'the folder this project should live in'
    })

    this.name = this.options.name
  }

  _answer(obj: Bitmap) {
    this.answers = Object.assign({}, this.answers, obj)
  }

  _parseArea(choices: string[], area: string[]) {
    const res: Bitmap = {}
    choices.forEach(choice => {
      res[choice.toLowerCase()] = area.includes(choice)
    })
    return res
  }

  async prompting() {
    this.log(
      `Welcome to the opinionated ${chalk.bgBlue.yellowBright.bold(
        'xavdid'
      )}-generator!\n`
    )

    // Q1
    const projectsRoot = 'projects' // where all my code lives
    const currentDir = this.name || basename(process.cwd())
    const needName = currentDir === projectsRoot

    // we're guessing, double check
    if (!this.name) {
      const { name } = (await this.prompt([
        {
          name: 'name',
          type: 'input',
          message: 'What is the project called?',
          default: needName ? undefined : currentDir,
          validate: needName ? s => s.length > 2 : undefined
        }
      ])) as { name: string }
      this.name = name
    } else {
      this.name = currentDir
    }

    if (basename(this.destinationRoot()) !== this.name) {
      this.destinationRoot(this.destinationPath(this.name))
    }

    // Q2
    const choices = ['Backend', 'Frontend', 'Webserver', 'CLI']
    const { area } = (await this.prompt([
      {
        type: 'checkbox',
        name: 'area',
        message: 'What tools will you need?',
        choices
      }
    ])) as { area: string[] }

    this._answer(this._parseArea(choices, area))
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(),
      {
        name: this.name
      },
      {},
      { globOptions: { dot: true } }
    )

    // if there's a package.json in a subfolder, it messes up `npm pack`, so here we are
    this.fs.writeJSON(this.destinationPath('package.json'), {
      name: this.name,
      ...pkgJSON
    })
  }

  async install() {
    if (process.env.NODE_ENV === 'test') {
      this.log('testing, no install')
      return
    }

    const { backend } = this.answers

    const deps: { [x: string]: string[] } = {
      frontend: ['react', 'react-dom'],
      backend: [],
      webserver: ['express', 'helmet'],
      cli: ['commander', 'ora', 'chalk']
    }
    const devDeps = ['jest']

    const untypedDevDeps = [
      'ts-jest',
      'tslint',
      'tslint-config-prettier',
      'tslint-config-standard',
      'typescript',
      ...(backend ? ['@types/node'] : [])
    ]

    let prodDeps: string[] = []
    Object.keys(deps).forEach(k => {
      if (this.answers[k]) {
        prodDeps = prodDeps.concat(deps[k])
      }
    })

    if (prodDeps.length) {
      this.log(`\nInstalling ${chalk.cyanBright.bold('prod')} deps, one sec...`)
      await typedInstall(prodDeps, { yarn: true, exact: true })
    }
    if (devDeps.length) {
      this.log(`\nInstalling ${chalk.cyanBright.bold('dev')} deps, one sec...`)
      await typedInstall(devDeps, { yarn: true, exact: true, dev: true })
    }

    // either way, we're doing this because they don't need types
    this.log(`\nInstalling ${chalk.cyanBright.bold('the rest')}`)
    this.yarnInstall(untypedDevDeps, {
      dev: true,
      exact: true,
      preferOffline: true
    })
  }

  end() {
    this.log(`${chalk.greenBright("You're all set")}!`)
  }
}
