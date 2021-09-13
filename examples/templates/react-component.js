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
    let { name, styled = false, hooks = false, standalone = false, memo = true } = variables
    return Object.assign(
      {
        [standalone && !styled && !hooks ? `./${variables.name}.js` : `./${variables.name}/index.js`]: `
        ${[
          memo && 'import {memo} from "react";',
          styled && `import {${name}SC} from "./styled";`,
          hooks && `import {} from "./hooks";`,
        ]
          .filter(Boolean)
          .join('\n')}
        
        const ${name} = props => {
          return <${styled ? `${name}SC` : 'div'}></${styled ? `${name}SC` : 'div'}>
        }
        
        export default ${memo ? `memo(${name})` : name}
      `,
      },
      styled
        ? {
            [`./${variables.name}/styled.js`]: `
            import styled from 'styled-components'
            
            export const ${name}SC = styled.div\`\`
            `,
          }
        : {},
      hooks
        ? {
            [`./${variables.name}/hooks.js`]: ``,
          }
        : {}
    )
  }
}

module.exports = EmptyTemplate
