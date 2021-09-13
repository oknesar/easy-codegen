import { CosmiconfigResult } from 'cosmiconfig/dist/types'
import { cosmiconfigSync } from 'cosmiconfig'

const moduleName = require('../package.json').name.split('/').pop()
const { config, filepath }: Partial<CosmiconfigResult> = cosmiconfigSync(moduleName).search(process.cwd()) ?? {}
const configFormats = [
  `.${moduleName}rc`,
  `.${moduleName}rc.json`,
  `.${moduleName}rc.yaml`,
  `.${moduleName}rc.yml`,
  `.${moduleName}rc.js`,
  `.${moduleName}rc.cjs`,
  `${moduleName}.config.js`,
  `${moduleName}.config.cjs`,
  `package.json["${moduleName}"]`,
]

export { filepath as configFilepath, configFormats }
export default {
  ...config,
  moduleName,
}
