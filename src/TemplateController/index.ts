import AbstractTemplate, { TemplateStructure } from '../AbstractTemplate'
import path from 'path'
import fs from 'fs-extra'
import prettier from 'prettier'

interface TemplateControllerSettings {
  templateName: string
  templateDir: string
  workingDir?: string
}

export default class TemplateController<Variables extends object = any> {
  private template: AbstractTemplate<Variables>
  private readonly workingDir: string

  constructor({ templateName, templateDir, workingDir = '' }: TemplateControllerSettings) {
    this.workingDir = this.resolveDir(workingDir)
    this.initTemplate(templateName, this.resolveDir(templateDir))
  }

  private initTemplate(name: string, source: string) {
    let templateClass = require(path.resolve(source, name))
    templateClass = templateClass.default ?? templateClass
    if (!templateClass) {
      throw new Error(`Template "${name}" is not found at "${source}"`)
    }
    if (!AbstractTemplate.isPrototypeOf(templateClass)) {
      throw new Error(`Template "${name}" doesn't extend AbstractTemplate`)
    }
    this.template = new (templateClass as new () => AbstractTemplate<Variables>)()
  }

  async generate(variables: Variables) {
    const error = await this.template.validate(variables)
    if (error) throw error
    const files = this.template.generate(variables)
    await this.validateFilesDontExists(files)
    await this.writeTemplate(files, variables)
  }

  async validateFilesDontExists(files: TemplateStructure<Variables>) {
    for (const fileName of Object.keys(files)) {
      const filePath = path.resolve(this.workingDir, fileName)
      if (await fs.pathExists(filePath)) throw new Error(`File "${filePath}" already exists.`)
    }
  }

  async writeTemplate(files: TemplateStructure<Variables>, variables: Variables) {
    const prettierConfig = await prettier.resolveConfig(process.cwd())

    for (const fileName in files) {
      const filePath = path.resolve(this.workingDir, fileName)
      const content = files[fileName]
      let text = typeof content === 'function' ? content(variables) : content
      const prettierInfo = await prettier.getFileInfo(filePath)

      if (prettierConfig && !prettierInfo.ignored && prettierInfo.inferredParser) {
        text = prettier.format(text, {
          ...prettierConfig,
          parser: prettierInfo.inferredParser,
        })
      }

      await fs.outputFile(filePath, text)
    }
  }

  resolveDir(dir: string) {
    return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir)
  }
}
