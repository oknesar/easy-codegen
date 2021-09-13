import path from 'path'

export default function ensureAbsolutePath(pathTo: string, relativeTo: string = process.cwd()) {
  if (path.isAbsolute(pathTo)) return pathTo
  return path.resolve(relativeTo, pathTo)
}
