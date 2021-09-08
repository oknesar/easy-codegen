import TemplateController from '../TemplateController'
import path from 'path'

describe('TemplateController', () => {
  test('Controller should resolve a template', () => {
    expect(
      () => new TemplateController({ name: 'default', source: path.resolve(__dirname, './templates') })
    ).not.toThrowError()
  })

  test('If a template name is incorrect throw an error', () => {
    expect(
      () => new TemplateController({ name: 'noSuchName', source: path.resolve(__dirname, './templates') })
    ).toThrowError()
  })

  test('If a root directory is incorrect throw an error', () => {
    expect(
      () => new TemplateController({ name: 'default', source: path.resolve(__dirname, './noSuchTemplateDirectory') })
    ).toThrowError()
  })
})
