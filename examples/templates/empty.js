const { AbstractTemplate } = require('@oknesar/easy-codegen')

class EmptyTemplate extends AbstractTemplate {
  name = 'Template name'
  validationSchema = (yup) => ({
    // name: yup.string().required(),
  })
  prepareStructure(variables) {
    return {
      // [`./${variables.name}.js`]: `console.log('hello world at ${variables.name}')`,
    }
  }
}

module.exports = EmptyTemplate
