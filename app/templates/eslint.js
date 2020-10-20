const { join } = require('path')

module.exports = {
  root: true,
  extends: 'xavdid',
  parserOptions: {
    project: join(__dirname, '/tsconfig.json'),
  },
}
