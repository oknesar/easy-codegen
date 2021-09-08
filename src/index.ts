import yargs from 'yargs'

const api = yargs(process.argv.slice(2))

api.command({
  command: 'make [template] <output>',
  describe: 'Generate a code by template',
  builder: (yargs) =>
    yargs
      .positional('template', {
        describe: 'A template name',
        default: 'default',
      })
      .positional('output', {
        describe: 'Output path',
      }),
  handler: (argv) => console.log(argv),
})

api.demandCommand()
api.help()
api.argv
