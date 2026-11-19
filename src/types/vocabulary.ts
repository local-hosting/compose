import type { LabelMap as FramesLabelMap } from '@local-hosting/frames'
import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '../languages.js'

export { SUPPORTED_LANGUAGES, type SupportedLanguage }

export type LabelMap = FramesLabelMap & Partial<Record<SupportedLanguage, string>>

export type LabeledId = {
  id: string
  code?: number
  labels: LabelMap
}

export type VocabEvent = LabeledId

export type VocabAction = LabeledId & {
  events: string[]
}

export type VocabPlace = LabeledId & {
  /** Geotypes slug */
  type: string
  h3: string
  wire_code?: string
}

export type VocabResource = LabeledId & {
  place_id?: string
  wire_code?: string
  category?: string
  subcategory?: string
}

export type VocabActor = LabeledId

/** event vocab id → band key → action ids */
export type VocabDefaults = Record<string, Record<string, string[]>>

export type Vocabulary = {
  vocab_version: string
  languages: SupportedLanguage[]
  events: VocabEvent[]
  actions: VocabAction[]
  places: VocabPlace[]
  resources: VocabResource[]
  actors: VocabActor[]
  defaults: VocabDefaults
}