import AbstractTemplate from '../AbstractTemplate'
import path from 'path'

interface TemplateControllerSettings {
  name: string
  source: string
}

export default class TemplateController {
  private templateClass: AbstractTemplate<any>

  constructor({ name, source }: TemplateControllerSettings) {
    let templateClass = require(path.resolve(source, name)).default
    templateClass = templateClass?.default ?? templateClass
    if (!templateClass) {
      throw new Error(`Template "${name}" is not found at "${source}"`)
    }
    if (!AbstractTemplate.isPrototypeOf(templateClass)) {
      throw new Error(`Template "${name}" doesn't extend AbstractTemplate`)
    }
    this.templateClass = new (templateClass as new () => AbstractTemplate<any>)()
  }
}
