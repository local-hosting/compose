import type { SupportedLanguage } from '../languages.js'

export type MessageCorpusId =
  | 'everyday'
  | 'resilience'
  | 'resilience-synthetic'
  | 'resilience-crisislex'

/** Optional composeWords expectations (uses test/fixtures table). */
export type ComposeExpect = {
  compose_ok: boolean
  symbol?: 'report' | 'query' | 'intent' | 'verify'
  offer?: 'demand' | 'offer'
  resource_code?: number
  place_code?: number
  event_code?: number
  action_code?: number
  band?: 1 | 2 | 3 | 4
}

export type MessageKind = 'question' | 'report'

export type MessageSession = {
  lat?: number
  lon?: number
  geotype?: string
}

/** Gold or tightened rubric for live local-ai compose eval (optional). */
export type ComposeIntentExpect = {
  /** Each actor row: every action_id must be in this list (local-ai eval semantics). */
  acceptable_action_ids?: string[][]
  must_include_place_ids?: string[]
}

export type MessageRow = {
  id: string
  text: string
  lang: SupportedLanguage
  kind: MessageKind
  expect?: ComposeExpect
  expected_map_label?: string
  expected_place_id?: string
  session?: MessageSession
  event_ref?: string
  band?: number
  /** placesNear rank-1 at corpus build (canonical spatial gold). */
  geo_rank1_id?: string
  /** Top-two ids for partial-credit scoring. */
  geo_rank2_ids?: string[]
  expect_compose?: ComposeIntentExpect
  crisislex?: {
    corpus: string
    crisis: string
    tweet_id: string
    attribution?: string
  }
}

export type MessageCorpusDocument = {
  version: number
  corpus: MessageCorpusId
  expected_count: number
  meta?: Record<string, string>
  messages: MessageRow[]
}