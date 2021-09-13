import { CommandModule } from 'yargs'
import TemplateController from '../core/TemplateController'
import config, { configFilepath, configFormats } from '../config'
import assert from '../utils/assert'

const command: CommandModule<
  {},
  {
    template?: string
    name: string
    workingDir?: string
    templatesDir?: string
  }
> = {
  command: 'make [template] <name>',
  aliases: '$0',
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
        type: 'string',
      })
      .option('templatesDir', {
        type: 'string',
      }),
  handler: async ({ template, name, workingDir, templatesDir, ...variables }) => {
    if (!config)
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

    assert(controllerSettings.templateDir, `Template source is not defined; check ${configFilepath || 'config file'}.`)
    assert(
      controllerSettings.templateDir,
      `Working directory is not defined; check ${configFilepath || 'config file'}.`
    )

    const controller = new TemplateController(controllerSettings)
    await controller.generate({
      name,
      ...variables,
    })
  },
}

export default command
