import { CommandModule } from 'yargs'
import fs from 'fs-extra'
import config from '../config'
import prettier from 'prettier'
import path from 'path'

const command: CommandModule<
  {},
  {
    type: string
    workingDir: string
    templatesDir: string
  }
> = {
  builder: (yargs) =>
    yargs
      .option('type', {
        describe: 'config file type',
        default: 'rc',
        choices: ['rc', 'json', 'js'],
      })
      .option('workingDir', {
        default: './',
        describe: 'Path to working directory',
        type: 'string',
      })
      .option('templatesDir', {
        type: 'string',
        describe: 'Path to templates directory',
        default: './templates',
      }),
  command: 'init',
  describe: 'Initialize easy-codegen',
  async handler(args) {
    const params = {
      workingDir: args.workingDir,
      templatesDir: args.templatesDir,
    }
    const configVariants = {
      rc: {
        name: `.${config.moduleName}rc`,
        content: prettier.format(JSON.stringify(params), {
          parser: 'json',
        }),
      },
      json: {
        name: `.${config.moduleName}rc.json`,
        content: prettier.format(JSON.stringify(params), {
          parser: 'json',
        }),
      },
      js: {
        name: `.${config.moduleName}rc.js`,
        content: prettier.format(`module.exports = ${JSON.stringify(params)}`, {
          parser: 'babel',
        }),
      },
    }

    const { name, content } = configVariants[args.type as keyof typeof configVariants]
    await fs.ensureDir(params.templatesDir)
    await fs.outputFile(name, content)
    await fs.copy(
      path.resolve(__dirname, '../../examples/templates/empty.js'),
      path.resolve(params.templatesDir, 'empty.js')
    )
  },
}

export default command
