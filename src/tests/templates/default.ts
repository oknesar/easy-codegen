import AbstractTemplate from '../../core/AbstractTemplate'

class DefaultTemplate extends AbstractTemplate<{}> {
  name = 'Default'
  validationSchema = () => ({})
  protected prepareStructure(variables: {}) {
    return {
      './index.ts': `console.log(  'hello world')`,
    }
  }
}

export default DefaultTemplate
