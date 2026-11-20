import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { MessageCorpusId } from './types.js'

/** Package root (`compose/`), whether loaded from `src/` or `dist/`. */
export function composePackageRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, '..', '..')
}

export function messageCorpusYamlPath(id: MessageCorpusId): string {
  const root = composePackageRoot()
  if (id === 'everyday-spatial') {
    return path.join(root, 'messages', 'daily', 'spatial.yaml')
  }
  if (id === 'everyday-reports') {
    return path.join(root, 'messages', 'daily', 'reports.yaml')
  }
  if (id === 'everyday') {
    return path.join(root, 'messages', 'daily', 'corpus.yaml')
  }
  if (id === 'resilience') {
    return path.join(root, 'messages', id, 'corpus.yaml')
  }
  return path.join(root, 'messages', 'resilience', `${id}.yaml`)
}