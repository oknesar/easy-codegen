# EasyCodegen

Developer friendly utility for generating boilerplate code designed to reduce the routine creation of components, controllers, models, etc.

## Motivation

I work a lot with React and this includes a lot of routine for creating components, I created several templates inside
IDE, but this is not very convenient, because usually a component contains several files (index file, styles, hooks)
and you first need to create a folder and then call each of the templates... also, when you work in a team with several
developers, you start to notice that to create new components, they copy existing ones and rename entities, and this
entails errors, bad naming, etc.  
I wanted to have a utility that could generate file structures based on
templates, as this is done when working with Angular or Laravel like

```
    # angular
    ng generate component hero-detail

    # laravel
    php artisan make:controller UserController --plain
```

Since React is only a library that has grown into a large ecosystem over the years of popularity, projects based on
React differ greatly in structure, approach, etc., so a utility for generating code should:

- not be tied to the project structure
- support many extensions (js, jsx, ts, tsx, css, scss, less, etc.)
- creating templates should be simple and not force the user to learn a new programming language, syntax, etc.
- be intuitive
- easy to install

as a result `@oknesar/easy-codegen` was created.

## Install

Install `@oknesar/easy-codegen` globally

```
    # npm
    npm i @oknesar/easy-codegen -g
    # yarn
    yarn global add @oknesar/easy-codegen
```

Initialize cli

```
    easy-codegen init --workingDir ./src/components --templatesDir ./templates
```

> You can change `workingDir` and `templatesDir` later at `.easy-codegenrc`

## Get started

```
    npm i @oknesar/easy-codegen -g
    easy-codegen init --workingDir ./src/components --templatesDir ./templates
```

Rename `./templates/empty.js` to `./templates/console-template.js` and edit an entries

```javascript
const { AbstractTemplate } = require('@oknesar/easy-codegen')

class EmptyTemplate extends AbstractTemplate {
  name = 'Template name' // template name
  validationSchema = (yup) => ({
    name: yup.string().required(), // validation schema for input variables
    // you can retur an empty object if you don't want to validate an input
  })
  prepareStructure(variables) {
    return {
      // `name` is a build in variable required by cli; look at snippet below
      [`./${variables.name}.js`]: `console.log('hello ${variables.name}')`,
    }
  }
}

module.exports = EmptyTemplate
```

Call the template

```
    # easy-codegen make [template] <name>
    easy-codegen make console-template EasyCodegen
```

Output at `./src/components/EasyCodegen.js`

```javascript
console.log('hello EasyCodegen')
```

---

Let's look at a more complicated template `./templates/react-component.js`

```javascript
const { AbstractTemplate } = require('@oknesar/easy-codegen')

class EmptyTemplate extends AbstractTemplate {
  name = 'React Component'
  validationSchema = (yup) => ({
    name: yup.string().required(),
    styled: yup.boolean(), // have to generate styled file
    hooks: yup.boolean(), // have to generate hooks file
    memo: yup.boolean(), // hate to wrap a component with React.memo
    standalone: yup.boolean(), // create standalode component without addition files and folder structure
  })

  prepareStructure(variables) {
    let { name: path, styled = false, hooks = false, standalone = false, memo = true } = variables
    const componentName = path.split('/').pop() // if passed name like `shared/ComponentName` use last part of a path as a name
    const imports = [
      // imports depends on passed variables
      memo && 'import {memo} from "react";',
      styled && `import {${componentName}SC} from "./styled";`,
      hooks && `import {} from "./hooks";`,
    ].filter(Boolean)
    const rootTag = styled ? `${componentName}SC` : 'div' // component name depends on is it styled or not

    return {
      // output object keys are a relative path to an output file
      // output object values are a content of an output file
      // if a value is falsy and it's not a string (null, undefined, false, etc.) a file will be ignored during generation
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
```

Using of the template

```
easy-codegen make react-component TextBlock
easy-codegen make react-component TextBlockStandalone --standalone
easy-codegen make react-component StyledTextBlock --styled
easy-codegen make react-component StyledTextBlockWithHooks --styled --hooks
easy-codegen make react-component StyledTextBlockWithHooksNoMemo --styled --hooks --memo false
```
