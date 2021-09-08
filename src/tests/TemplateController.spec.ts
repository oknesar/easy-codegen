import TemplateController from '../TemplateController'
import path from 'path'
import fs from 'fs-extra'

describe('TemplateController', () => {
  beforeEach(async () => {
    await fs.remove(path.resolve(__dirname, './output'))
  })

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

  test('Controller should generate a template', async () => {
    const controller = new TemplateController({
      name: 'default',
      source: path.resolve(__dirname, './templates'),
      workingDir: path.resolve(__dirname, './output'),
    })
    await controller.generate({})
  })
})
