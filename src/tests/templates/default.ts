import AbstractTemplate from '../../AbstractTemplate'

class DefaultTemplate extends AbstractTemplate<{}> {
  name = 'Default'
  validationSchema = {}
  protected prepareStructure(variables: {}) {
    return {
      './index.js': `console.log('hello world')`,
    }
  }
}

export default DefaultTemplate
