import { intentToCompact, type CompactFrame } from '@local-hosting/frames'
import type { Vocabulary } from './types/vocabulary.js'
import { codesForIds, codeForId } from './vocabulary-labels.js'
import { vocabularyTip } from './vocabulary-table.js'

export type IntentBodyIds = {
  event_ref: string
  band: 1 | 2 | 3 | 4
  actor_ids: string[]
  action_ids: string[]
  place_ids?: string[]
  vocab_tip?: string
}

/** Structured ids → CompactFrame (codes only on wire). */
export function composeIntentToCompact(
  vocab: Vocabulary,
  body: IntentBodyIds,
): CompactFrame | null {
  const event_code = codeForId(vocab, body.event_ref)
  if (event_code === undefined) return null
  const actor_codes = codesForIds(vocab, body.actor_ids)
  const action_codes = codesForIds(vocab, body.action_ids)
  const place_codes = body.place_ids?.length ? codesForIds(vocab, body.place_ids) : []
  return intentToCompact(body.vocab_tip ?? vocabularyTip(vocab), {
    event_code,
    band: body.band,
    actor_codes,
    action_codes,
    place_codes,
  })
}