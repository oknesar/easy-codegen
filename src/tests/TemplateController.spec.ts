import TemplateController from '../core/TemplateController'
import path from 'path'
import fs from 'fs-extra'

describe('TemplateController', () => {
  beforeEach(async () => {
    await fs.remove(path.resolve(__dirname, './output'))
  })

  test('Controller should resolve a template', () => {
    expect(
      () => new TemplateController({ templateName: 'default', templateDir: path.resolve(__dirname, './templates') })
    ).not.toThrowError()
  })

  test('If a template name is incorrect throw an error', () => {
    expect(
      () => new TemplateController({ templateName: 'noSuchName', templateDir: path.resolve(__dirname, './templates') })
    ).toThrowError()
  })

  test('If a root directory is incorrect throw an error', () => {
    expect(
      () =>
        new TemplateController({
          templateName: 'default',
          templateDir: path.resolve(__dirname, './noSuchTemplateDirectory'),
        })
    ).toThrowError()
  })

  test('Controller should generate a template', async () => {
    const controller = new TemplateController({
      templateName: 'default',
      templateDir: path.resolve(__dirname, './templates'),
      workingDir: path.resolve(__dirname, './output'),
    })
    await controller.generate({})
  })
})
