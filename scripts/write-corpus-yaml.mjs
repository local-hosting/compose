import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stringify as stringifyYaml } from 'yaml'

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export function writeCorpusYaml(id, meta, messages) {
  const subdir =
    id === 'everyday' || id === 'resilience'
      ? path.join('messages', id)
      : path.join('messages', 'resilience')
  const dir = path.join(pkgRoot, subdir)
  mkdirSync(dir, { recursive: true })
  const filename = id === 'everyday' || id === 'resilience' ? 'corpus.yaml' : `${id}.yaml`
  const file = path.join(dir, filename)
  const doc = {
    version: 1,
    corpus: id,
    expected_count: messages.length,
    meta,
    messages,
  }
  writeFileSync(file, stringifyYaml(doc, { lineWidth: 0 }))
  console.log(`Wrote ${messages.length} → ${file}`)
  return file
}