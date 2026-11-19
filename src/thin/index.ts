import {
  SYMBOL_INTENT,
  encodeCodesPackedBytes,
  encodeIntentPackedBytes,
  type CompactFrame,
} from '@local-hosting/frames'
import { planFrame, type PlanFrameResult } from '@local-hosting/frames/link'
import { composeFromVocabulary } from '../compose-from-vocabulary.js'
import { composeIntentToCompact, type IntentBodyIds } from '../intent-from-vocabulary.js'
import type { SupportedLanguage, Vocabulary } from '../types/vocabulary.js'
import { vocabularyTip } from '../vocabulary-table.js'

export type ThinPrepareInput = {
  vocab: Vocabulary
  bearerId: string
  overlayId?: string
  text?: string
  lang?: SupportedLanguage
  intentBody?: IntentBodyIds
}

export type ThinPrepareSuccess = {
  ok: true
  bytes: Uint8Array
  frame: CompactFrame
  vocab_tip: string
  linkPlan: Extract<PlanFrameResult, { ok: true }>
}

export type ThinPrepareFailure = {
  ok: false
  reason: string
  suggestFatHeal?: boolean
}

export type ThinPrepareResult = ThinPrepareSuccess | ThinPrepareFailure

function encodePackedFrame(frame: CompactFrame): Uint8Array {
  if (frame.symbol === SYMBOL_INTENT) {
    return encodeIntentPackedBytes(frame)
  }
  return encodeCodesPackedBytes(frame)
}

export function thinPrepare(input: ThinPrepareInput): ThinPrepareResult {
  const vocab_tip = vocabularyTip(input.vocab)
  let frame: CompactFrame | null = null

  if (input.intentBody) {
    frame = composeIntentToCompact(input.vocab, {
      ...input.intentBody,
      vocab_tip,
    })
    if (!frame) {
      return { ok: false, reason: 'intent: unknown event_ref or codes' }
    }
  } else if (input.text && input.lang) {
    const composed = composeFromVocabulary(input.text, input.vocab, input.lang)
    if (!composed.ok) {
      return { ok: false, reason: composed.reason }
    }
    frame = composed.frame
  } else {
    return { ok: false, reason: 'thinPrepare: provide text+lang or intentBody' }
  }

  const bytes = encodePackedFrame(frame)
  const linkPlan = planFrame(input.bearerId, bytes.length, input.overlayId)
  if (!linkPlan.ok) {
    return { ok: false, reason: `link: ${linkPlan.reason}` }
  }
  if (linkPlan.preferEncode !== 'packed') {
    return {
      ok: false,
      reason: 'link prefers text encode; thin path requires packed only',
      suggestFatHeal: linkPlan.allowFatHeal,
    }
  }
  if (!linkPlan.fitsTypical) {
    return {
      ok: false,
      reason: `payload ${bytes.length}B exceeds typical budget ${linkPlan.budgetBytes}B`,
      suggestFatHeal: linkPlan.allowFatHeal,
    }
  }

  return {
    ok: true,
    bytes,
    frame,
    vocab_tip,
    linkPlan,
  }
}