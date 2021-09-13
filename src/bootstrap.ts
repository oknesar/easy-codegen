import yargs from 'yargs'
import { mapValues } from 'lodash'

yargs(process.argv.slice(2))
  .middleware((args) => {
    return mapValues(args, (value) => {
      switch (value) {
        case 'true':
          return true
        case 'false':
          return false
        default:
          return value
      }
    })
  })
  .commandDir('cli', {
    extensions: ['js', 'ts'],
    visit: (commandObject) => commandObject.default ?? commandObject,
  })
  .demandCommand(1)
  .help().argv
