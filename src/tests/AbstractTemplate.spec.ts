import AbstractTemplate from '../AbstractTemplate'
import * as Yup from 'yup'
import { ValidationError } from 'yup'

describe('Template', () => {
  type Variables = { noFile?: boolean; path: string }
  const testStructure = {
    './index.js': `console.log('hello world')`,
  }

  class Template extends AbstractTemplate<Variables> {
    name = 'Template name'
    validationSchema = {
      path: Yup.string().required(),
      noFile: Yup.boolean(),
    }

    prepareStructure(variables: Variables) {
      if (variables.noFile) return {}
      return testStructure
    }
  }

  let template: Template

  beforeEach(() => {
    template = new Template()
  })

  test('Template should have a name', () => {
    expect(template.getName()).toBe('Template name')
  })

  test('Template should have ability to check input data', async () => {
    expect(await template.validate({ path: undefined as any })).toBeInstanceOf(ValidationError)
    expect(await template.validate({ path: 'string' })).toBeUndefined()
  })

  test('Template should have output structure', () => {
    expect(template.getStructure({ path: 'string' })).toBe(testStructure)
  })

  test("Template structure can't be empty", () => {
    expect(() => template.getStructure({ path: 'string', noFile: true })).toThrowError()
  })
})
