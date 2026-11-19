import type { Vocabulary } from './types/vocabulary.js'
import type { IntentBodyIds } from './intent-from-vocabulary.js'

const BAND_KEYS = ['1', '2', '3', '4'] as const

/**
 * When defaults exist for event_ref + band, return action ids to omit from wire
 * (receiver expands from pack.defaults).
 */
export function defaultActionIdsForEvent(
  vocab: Vocabulary,
  event_ref: string,
  band: IntentBodyIds['band'],
): string[] {
  const bands = vocab.defaults[event_ref]
  if (!bands) return []
  const key = BAND_KEYS[band - 1]
  return bands[key] ?? []
}