import * as Yup from 'yup'
import { AnySchema, ValidationError } from 'yup'
import { mapKeys } from 'lodash'
import path from 'path'

export type TemplateStructure<V extends object> = Record<string, string | ((variables: V) => string)>

export default abstract class AbstractTemplate<Variables extends object> {
  protected abstract name: string
  protected abstract validationSchema: (yup: typeof Yup) => { [name in keyof Variables]: AnySchema }
  protected abstract prepareStructure(variables: Variables): TemplateStructure<Variables>

  public basePath = './'

  public getName() {
    return this.name
  }

  public async validate(variables: Variables) {
    const schema = Yup.object(this.validationSchema(Yup))

    try {
      await schema.validate(variables, {
        context: this,
      })
    } catch (e) {
      if (!(e instanceof ValidationError)) throw e
      return e
    }
  }

  public generate(variables: Variables): TemplateStructure<Variables> {
    const filesStructure = this.prepareStructure(variables)
    if (Object.keys(filesStructure).length === 0)
      throw new Error(`Template ${this.getName()} should generate al least one file; check prepareStructure method.`)
    return mapKeys(filesStructure, (_, key) => {
      return path.join(this.basePath, key)
    })
  }
}
