const { AbstractTemplate } = require('@oknesar/easy-codegen')

class EmptyTemplate extends AbstractTemplate {
  name = 'React Component'

  validationSchema = (yup) => ({
    name: yup.string().required(),
    styled: yup.boolean(),
    hooks: yup.boolean(),
    memo: yup.boolean(),
    standalone: yup.boolean(),
  })

  prepareStructure(variables) {
    let { name: path, styled = false, hooks = false, standalone = false, memo = true } = variables
    const componentName = path.split('/').pop()
    const imports = [
      memo && 'import {memo} from "react";',
      styled && `import {${componentName}SC} from "./styled";`,
      hooks && `import {} from "./hooks";`,
    ].filter(Boolean)
    const rootTag = styled ? `${componentName}SC` : 'div'

    return {
      [standalone && !styled && !hooks ? `./${path}.js` : `./${path}/index.js`]: `
        ${imports.join('\n')}
        
        const ${componentName} = props => {
          return <${rootTag}></${rootTag}>
        }
        
        export default ${memo ? `memo(${componentName})` : componentName}
      `,
      [`./${path}/styled.js`]:
        styled &&
        `
            import styled from 'styled-components'
            
            export const ${componentName}SC = styled.div\`\`
            `,
      [`./${path}/hooks.js`]: hooks && ``,
    }
  }
}

module.exports = EmptyTemplate
