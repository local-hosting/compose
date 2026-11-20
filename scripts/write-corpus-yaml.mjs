import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stringify as stringifyYaml } from 'yaml'

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function corpusFile(id) {
  if (id === 'everyday-spatial') {
    return { dir: path.join('messages', 'daily'), file: 'spatial.yaml' }
  }
  if (id === 'everyday-reports') {
    return { dir: path.join('messages', 'daily'), file: 'reports.yaml' }
  }
  if (id === 'everyday') {
    return { dir: path.join('messages', 'daily'), file: 'corpus.yaml' }
  }
  if (id === 'resilience') {
    return { dir: path.join('messages', id), file: 'corpus.yaml' }
  }
  return { dir: path.join('messages', 'resilience'), file: `${id}.yaml` }
}

export function writeCorpusYaml(id, meta, messages) {
  const { dir: subdir, file: filename } = corpusFile(id)
  const dir = path.join(pkgRoot, subdir)
  mkdirSync(dir, { recursive: true })
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