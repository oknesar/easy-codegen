import yargs from 'yargs'
import TemplateController from './TemplateController'
import { cosmiconfigSync } from 'cosmiconfig'
import { CosmiconfigResult } from 'cosmiconfig/dist/types'

const moduleName = require('../package.json').name.split('/').pop()
const { config, filepath: configFilepath }: Partial<CosmiconfigResult> = cosmiconfigSync(moduleName).search() ?? {}
const configFormats = [
  `package.json["${moduleName}"]`,
  `.${moduleName}rc`,
  `.${moduleName}rc.json`,
  `.${moduleName}rc.yaml`,
  `.${moduleName}rc.yml`,
  `.${moduleName}rc.js`,
  `.${moduleName}rc.cjs`,
  `${moduleName}.config.js`,
  `${moduleName}.config.cjs`,
]

const api = yargs(process.argv.slice(2))
api.command<{
  template?: string
  name: string
  workingDir?: string
  templatesDir?: string
}>({
  command: 'make [template] <name>',
  describe: 'Generate a code by template',
  builder: (yargs) =>
    yargs
      .positional('template', {
        describe: 'A template name',
        type: 'string',
      })
      .positional('name', {
        describe: 'Output module name',
        type: 'string',
      })
      .option('workingDir', {
        alias: 'wd',
        type: 'string',
      })
      .option('templatesDir', {
        alias: 'td',
        type: 'string',
      }),
  handler: async ({ template, name, workingDir, templatesDir, ...variables }) => {
    console.warn(
      `Config is not found; Define a config file for better experience by one of formats below:\n\n ${configFormats.join(
        ',\n'
      )}\n`
    )
    if (template) [template, name] = [name, template]
    else template = 'default'

    const controllerSettings = {
      templateName: template,
      templateDir: templatesDir ?? config?.templatesDir,
      workingDir: workingDir ?? config?.workingDir,
    }

    throwIf(
      !controllerSettings.templateDir,
      `Template source is not defined; check ${configFilepath || 'config file'}.`
    )
    throwIf(
      !controllerSettings.templateDir,
      `Working directory is not defined; check ${configFilepath || 'config file'}.`
    )

    const controller = new TemplateController(controllerSettings)
    await controller.generate({
      name,
      ...variables,
    })
  },
})

api.demandCommand(1)
api.help()
api.argv

function throwIf(condition: any, message: string) {
  if (condition) throw new Error(message)
}
