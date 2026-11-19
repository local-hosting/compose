import { composeWords, type ComposeWordsResult } from './compose-words.js'
import type { SupportedLanguage, Vocabulary } from './types/vocabulary.js'
import { vocabularyToLabelPack } from './vocabulary-labels.js'
import { vocabularyToSymbolTable } from './vocabulary-table.js'

export function composeFromVocabulary(
  text: string,
  vocab: Vocabulary,
  lang: SupportedLanguage,
): ComposeWordsResult {
  const table = vocabularyToSymbolTable(vocab)
  const labels = vocabularyToLabelPack(vocab)
  return composeWords(text, table, labels, lang)
}