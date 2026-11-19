export { composeWords, type ComposeWordsResult } from './compose-words.js'
export { composeFromVocabulary } from './compose-from-vocabulary.js'
export {
  composeIntentToCompact,
  type IntentBodyIds,
} from './intent-from-vocabulary.js'
export {
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  type SupportedLanguage,
} from './languages.js'
export { resolvePackId, PACK_IDS, type PackMode, type PackId } from './types/pack-mode.js'
export {
  type Vocabulary,
  type VocabEvent,
  type VocabAction,
  type VocabPlace,
  type VocabResource,
  type VocabActor,
  type VocabDefaults,
  type LabeledId,
} from './types/vocabulary.js'
export {
  vocabularyToSymbolTable,
  vocabularyToVocabSnapshot,
  vocabularyToVocabStore,
  vocabularyTip,
  vocabularyEntries,
} from './vocabulary-table.js'
export {
  vocabularyToLabelPack,
  englishLabel,
  labelInLang,
  codeForId,
  idForCode,
  codesForIds,
  allLabeledRows,
} from './vocabulary-labels.js'
export {
  applyWireCrosswalk,
  type ComposeCrosswalkRow,
} from './wire-crosswalk.js'
export { defaultActionIdsForEvent } from './defaults-intent.js'

/** Re-export frames so apps (including AI) depend on compose → frames, not frames directly. */
export {
  REPORT_DEMAND,
  REPORT_OFFER,
  SYMBOL_ACK,
  SYMBOL_BASE,
  SYMBOL_DIGEST,
  SYMBOL_INTENT,
  SYMBOL_NARRATIVE,
  SYMBOL_PATTERN,
  SYMBOL_QUERY,
  SYMBOL_RATING,
  SYMBOL_READING,
  SYMBOL_REPORT,
  SYMBOL_SIGNAL,
  SYMBOL_TREND,
  SYMBOL_VERIFY,
  buildCrosswalkIndex,
  codesToCompact,
  compactToIntent,
  compressIds,
  createVocabSnapshot,
  createVocabStore,
  decodeSymbolEnvelope,
  encodeSymbolEnvelope,
  expandCodes,
  expandCompactFrame,
  expandWithStore,
  fingerprintEntries,
  idToLegacy,
  intentCodec,
  intentPackedCodec,
  intentToCompact,
  labelsForIds,
  legacyToId,
  mergeCrosswalkIntoTable,
  resolveCodeById,
  resolveIdByCode,
  snapshotToTable,
} from '@local-hosting/frames'

export type {
  CompactFrame,
  IntentBody,
  LabelMap,
  LocalSymbolTablePack,
  SymbolEnvelope,
  SymbolKind,
  SymbolTableEntry,
  VocabSnapshot,
  VocabStore,
} from '@local-hosting/frames'
