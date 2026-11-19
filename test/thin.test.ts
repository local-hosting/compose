import { describe, expect, it } from 'vitest'
import type { Vocabulary } from '../src/types/vocabulary.js'
import { thinPrepare } from '../src/thin/index.js'

const miniVocab: Vocabulary = {
  vocab_version: 'test-0.1',
  languages: ['en'],
  events: [{ id: 'E_dinner', code: 1, labels: { en: 'dinner' } }],
  actions: [{ id: 'A_notify', code: 12, events: ['E_dinner'], labels: { en: 'notify' } }],
  places: [
    {
      id: 'P_home',
      code: 20,
      type: 'apartment_building',
      h3: '8928308280fffff',
      labels: { en: 'home' },
    },
  ],
  resources: [{ id: 'R_milk', code: 50, labels: { en: 'milk' } }],
  actors: [{ id: 'PR_parent', code: 40, labels: { en: 'parent' } }],
  defaults: {},
}

describe('thinPrepare', () => {
  it('intent body fits typical LoRa budget', () => {
    const result = thinPrepare({
      vocab: miniVocab,
      bearerId: 'lorawan',
      intentBody: {
        event_ref: 'E_dinner',
        band: 2,
        actor_ids: ['PR_parent'],
        action_ids: ['A_notify'],
        place_ids: ['P_home'],
      },
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.bytes.length).toBeLessThanOrEqual(32)
    expect(result.linkPlan.preferEncode).toBe('packed')
    expect(result.linkPlan.fitsTypical).toBe(true)
  })
})