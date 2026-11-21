import { readFileSync } from 'node:fs'
import { parse as parseYaml } from 'yaml'
import { messageCorpusYamlPath } from './paths.js'
import type { MessageCorpusDocument, MessageCorpusId, MessageRow } from './types.js'

function assertCorpusDoc(raw: unknown, file: string): MessageCorpusDocument {
  if (!raw || typeof raw !== 'object') {
    throw new Error(`${file}: expected YAML mapping at root`)
  }
  const doc = raw as MessageCorpusDocument
  if (doc.version !== 1) {
    throw new Error(`${file}: unsupported version ${String(doc.version)}`)
  }
  if (!Array.isArray(doc.messages)) {
    throw new Error(`${file}: missing messages array`)
  }
  if (doc.messages.length !== doc.expected_count) {
    throw new Error(
      `${file}: expected ${doc.expected_count} messages, got ${doc.messages.length}`,
    )
  }
  return doc
}

export function readMessageCorpus(id: MessageCorpusId): MessageCorpusDocument {
  const file = messageCorpusYamlPath(id)
  const raw = parseYaml(readFileSync(file, 'utf8'))
  return assertCorpusDoc(raw, file)
}

/** Resilience bench rows (synthetic + social corpus) for spatial / local-ai harnesses. */
export function loadResilienceBenchMessages(): MessageRow[] {
  const synthetic = readMessageCorpus('resilience-synthetic')
  const social = readMessageCorpus('resilience-social')
  return [...synthetic.messages, ...social.messages]
}