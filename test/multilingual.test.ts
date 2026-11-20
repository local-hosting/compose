import { describe, expect, it } from 'vitest'
import { SYMBOL_QUERY, SYMBOL_VERIFY } from '@local-hosting/frames'
import { composeWords } from '../src/index.js'
import { SUPPORTED_LANGUAGES } from '../src/languages.js'
import { readMessageCorpus } from '../src/messages/load-corpus.js'
import {
  assertComposeExpect,
  COMPOSE_DOMAIN_CORPORA,
  composeWordsForRow,
} from './corpus-harness.js'
import { labels, table } from './fixtures.js'

describe('SUPPORTED_LANGUAGES contract', () => {
  it('lists the twelve BCP-47 tags (owned here, not in AI)', () => {
    expect([...SUPPORTED_LANGUAGES]).toEqual([
      'ar',
      'en',
      'es',
      'fr',
      'he',
      'hi',
      'it',
      'nl',
      'pt',
      'ta',
      'zh-Hans',
      'zh-Hant',
    ])
  })
})

describe('multilingual compose from domain corpora', () => {
  for (const corpusId of COMPOSE_DOMAIN_CORPORA) {
    describe(corpusId, () => {
      const rows = readMessageCorpus(corpusId).messages.filter((row) => row.lang !== 'en')
      it(`has non-English coverage (${rows.length} rows)`, () => {
        expect(rows.length).toBeGreaterThan(0)
      })
      for (const row of rows) {
        it(`${row.id} (${row.lang})`, () => {
          assertComposeExpect(row, composeWordsForRow(row))
        })
      }
    })
  }
})

describe('multilingual compose extras (not duplicated in YAML)', () => {
  it('everyday: fr medicine verify', () => {
    const result = composeWords(
      'Confirmer les médicaments ✅',
      table,
      labels,
      'fr',
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_VERIFY)
    expect(result.frame.codes.resource).toEqual([52])
  })

  it('resilience: zh-Hans shelter query', () => {
    const result = composeWords('避难所开放了吗？', table, labels, 'zh-Hans')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_QUERY)
    expect(result.frame.codes.place).toEqual([22])
  })
})