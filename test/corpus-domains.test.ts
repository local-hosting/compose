import { describe, expect, it } from 'vitest'
import { loadResilienceBenchMessages, readMessageCorpus } from '../src/messages/load-corpus.js'
import {
  assertComposeExpect,
  COMPOSE_DOMAIN_CORPORA,
  composeWordsForRow,
} from './corpus-harness.js'

describe('composeWords by domain (YAML gold)', () => {
  for (const corpusId of COMPOSE_DOMAIN_CORPORA) {
    describe(corpusId, () => {
      const doc = readMessageCorpus(corpusId)

      it(`loads expected_count (${doc.expected_count})`, () => {
        expect(doc.corpus).toBe(corpusId)
        expect(doc.messages).toHaveLength(doc.expected_count)
        expect(doc.messages.every((row) => row.expect?.compose_ok != null)).toBe(true)
      })

      for (const row of doc.messages) {
        it(`${row.id} (${row.lang})`, () => {
          assertComposeExpect(row, composeWordsForRow(row))
        })
      }
    })
  }
})

describe('resilience bench corpora', () => {
  it('synthetic + social yields 200 bench rows', () => {
    expect(loadResilienceBenchMessages()).toHaveLength(200)
  })
})