import yargs from 'yargs'

yargs(process.argv.slice(2))
  .commandDir('cli', {
    extensions: ['js', 'ts'],
    visit: (commandObject) => commandObject.default ?? commandObject,
  })
  .demandCommand(1)
  .help().argv
