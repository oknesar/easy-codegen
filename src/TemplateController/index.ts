import AbstractTemplate from '../AbstractTemplate'
import path from 'path'

interface TemplateControllerSettings {
  name: string
  source: string
  workingDir?: string
}

export default class TemplateController<Variables extends object = any> {
  private templateClass: AbstractTemplate<Variables>
  private workingDir: string

  constructor({ name, source, workingDir = '' }: TemplateControllerSettings) {
    this.resolveWorkingDir(workingDir)
    this.initTemplate(name, source)
  }

  private resolveWorkingDir(workingDir: string) {
    this.workingDir = path.isAbsolute(workingDir) ? workingDir : path.resolve(process.cwd(), workingDir)
  }

  private initTemplate(name: string, source: string) {
    let templateClass = require(path.resolve(source, name)).default
    templateClass = templateClass?.default ?? templateClass
    if (!templateClass) {
      throw new Error(`Template "${name}" is not found at "${source}"`)
    }
    if (!AbstractTemplate.isPrototypeOf(templateClass)) {
      throw new Error(`Template "${name}" doesn't extend AbstractTemplate`)
    }
    this.templateClass = new (templateClass as new () => AbstractTemplate<Variables>)()
  }
}
