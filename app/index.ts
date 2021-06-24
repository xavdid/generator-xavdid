import typedInstall from 'typed-install'
import { basename } from 'path'
import chalk from 'chalk'
import Generator = require('yeoman-generator')

const ESLINT_CONFIG_NAME = 'xavdid'

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
    lint: 'eslint src',
    test: 'jest',
    validate: 'yarn test && yarn lint',
    release: 'npx np',
  },
  keywords: [],
  files: ['lib/*.js', 'lib/*.d.ts'],
  author: {
    name: 'David Brownman',
    email: 'beamneocube@gmail.com',
    url: 'https://xavd.id',
  },
  license: 'ISC',
  jest: {
    verbose: true, // list all tests as they're going
    roots: ['<rootDir>/src'],
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
  },
  prettier: {
    semi: false,
    singleQuote: true,
  },
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
      description: 'the folder this project should live in',
    })

    this.name = this.options.name
  }

  _answer(obj: Bitmap): void {
    this.answers = { ...this.answers, ...obj }
  }

  _parseArea(choices: string[], area: string[]): Bitmap {
    const res: Bitmap = {}
    choices.forEach((choice) => {
      res[choice.toLowerCase()] = area.includes(choice)
    })
    return res
  }

  async prompting(): Promise<void> {
    this.log(
      `Welcome to the opinionated ${chalk.bgBlue.yellowBright.bold(
        'xavdid'
      )}-generator!\n`
    )

    // Q1
    const projectsRoot = 'projects' // where all my code lives
    const currentDir = this.name ?? basename(process.cwd())
    const needName = currentDir === projectsRoot

    // we're guessing, double check
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.name) {
      const { name } = await this.prompt([
        {
          name: 'name',
          type: 'input',
          message: 'What is the project called?',
          default: needName ? undefined : currentDir,
          validate: needName ? (s) => s.length > 2 : undefined,
        },
      ])
      this.name = name
    } else {
      this.name = currentDir
    }

    if (basename(this.destinationRoot()) !== this.name) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.destinationRoot(this.destinationPath(this.name!))
    }

    // Q2
    const choices = ['Backend', 'Frontend', 'Webserver', 'CLI']
    const { area } = await this.prompt([
      {
        type: 'checkbox',
        name: 'area',
        message: 'What tools will you need?',
        choices,
      },
    ])

    this._answer(this._parseArea(choices, area))
  }

  writing(): void {
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(),
      {
        name: this.name,
      },
      {},
      { globOptions: { dot: true } }
    )

    // if there's a package.json in a subfolder, it messes up `npm pack`, so here we are
    this.fs.writeJSON(this.destinationPath('package.json'), {
      name: this.name,
      ...pkgJSON,
    })

    // also, npm turns `.gitignore` files into `.npmignore` without asking, so don't release it
    // https://github.com/npm/npm/issues/1862
    const renames: Array<{ from: string; to: string }> = [
      {
        from: 'gitignore',
        to: '.gitignore',
      },
      {
        from: 'eslint.js',
        to: '.eslintrc.js',
      },
    ]

    renames.forEach(({ from, to }) => {
      this.fs.move(this.destinationPath(from), this.destinationPath(to))
    })
  }

  async install(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      this.log('testing, no install')
      return
    }

    const { backend, webserver, cli } = this.answers

    const deps: { [x: string]: string[] } = {
      frontend: ['react', 'react-dom'],
      backend: [],
      webserver: ['express', 'helmet'],
      cli: ['commander', 'ora', 'chalk'],
    }
    const devDeps = ['jest']

    const untypedDevDeps = [
      // 'typescript',
      'ts-jest',
      // linting
      `eslint-config-${ESLINT_CONFIG_NAME}`,
      // formatting
      'prettier',
      // types
      ...(backend || webserver || cli ? ['@types/node'] : []),
    ]

    // only bring the dependencies we need for this type of project
    let prodDeps: string[] = []
    Object.entries(deps).forEach(([k, v]) => {
      if (this.answers[k]) {
        prodDeps = prodDeps.concat(v)
      }
    })

    if (prodDeps.length > 0) {
      this.log(`\nInstalling ${chalk.cyanBright.bold('prod')} deps, one sec...`)
      await typedInstall(prodDeps, { packageManager: 'yarn', exact: true })
    }
    if (devDeps.length > 0) {
      this.log(`\nInstalling ${chalk.cyanBright.bold('dev')} deps, one sec...`)
      await typedInstall(devDeps, {
        packageManager: 'yarn',
        exact: true,
        dev: true,
      })
    }

    // either way, we're doing this because they don't need types
    this.log(`\nInstalling ${chalk.cyanBright.bold('the rest')}`)
    this.yarnInstall(untypedDevDeps, {
      dev: true,
      exact: true,
    })

    this.log(`\nInstalling linting ${chalk.cyanBright.bold('peerDeps')}`)
    // install peer deps of my eslint config, which is all the linting stuff it depends on
    this.spawnCommandSync('npx', [
      'install-peerdeps',
      '--yarn',
      '--dev',
      `eslint-config-${ESLINT_CONFIG_NAME}`,
    ])
  }

  end(): void {
    this.log(`${chalk.greenBright("You're all set")}!`)
  }
}
