import { describe, expect, it } from 'vitest'
import { SYMBOL_REPORT } from '@local-hosting/frames'
import {
  composeFromVocabulary,
  composeIntentToCompact,
  vocabularyTip,
  vocabularyToSymbolTable,
  type Vocabulary,
} from '../src/index.js'

const miniVocab: Vocabulary = {
  vocab_version: 'test-0.1',
  languages: ['en', 'es'],
  events: [{ id: 'E_dinner', code: 1, labels: { en: 'dinner', es: 'cena' } }],
  actions: [
    { id: 'A_notify', code: 12, events: ['E_dinner'], labels: { en: 'notify', es: 'avisar' } },
  ],
  places: [
    {
      id: 'P_home',
      code: 20,
      type: 'apartment_building',
      h3: '8928308280fffff',
      labels: { en: 'home', es: 'casa' },
    },
  ],
  resources: [{ id: 'R_milk', code: 50, labels: { en: 'milk', es: 'leche' } }],
  actors: [{ id: 'PR_parent', code: 40, labels: { en: 'parent', es: 'padre' } }],
  defaults: {},
}

describe('composeFromVocabulary', () => {
  it('composes es text via pack labels', () => {
    const result = composeFromVocabulary('Necesitamos leche en casa', miniVocab, 'es')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_REPORT)
    expect(result.frame.codes.resource).toEqual([50])
  })

  it('builds symbol table with vocab fingerprint tip', () => {
    const table = vocabularyToSymbolTable(miniVocab)
    expect(table.vocab_base).toBe(vocabularyTip(miniVocab))
    expect(table.entries.some((e) => e.id === 'R_milk')).toBe(true)
  })
})

describe('composeIntentToCompact', () => {
  it('maps ids to intent packed shape', () => {
    const frame = composeIntentToCompact(miniVocab, {
      event_ref: 'E_dinner',
      band: 2,
      actor_ids: ['PR_parent'],
      action_ids: ['A_notify'],
      place_ids: ['P_home'],
    })
    expect(frame?.codes.event).toEqual([1])
    expect(frame?.codes.actor).toEqual([40])
    expect(frame?.codes.action).toEqual([12])
    expect(frame?.codes.place).toEqual([20])
  })
})