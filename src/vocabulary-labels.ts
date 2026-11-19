import type { LabelMap, SupportedLanguage, Vocabulary } from './types/vocabulary.js'

export function allLabeledRows(vocab: Vocabulary) {
  return [
    ...vocab.events,
    ...vocab.actions,
    ...vocab.places,
    ...vocab.resources,
    ...vocab.actors,
  ]
}

export function vocabularyToLabelPack(vocab: Vocabulary): Record<string, LabelMap> {
  const out: Record<string, LabelMap> = {}
  for (const row of allLabeledRows(vocab)) {
    out[row.id] = { ...row.labels }
  }
  return out
}

export function englishLabel(vocab: Vocabulary, id: string): string | undefined {
  return allLabeledRows(vocab).find((e) => e.id === id)?.labels.en
}

export function labelInLang(
  vocab: Vocabulary,
  id: string,
  lang: SupportedLanguage,
): string | undefined {
  const row = allLabeledRows(vocab).find((e) => e.id === id)
  if (!row) return undefined
  return row.labels[lang] ?? row.labels.en
}

export function codeForId(vocab: Vocabulary, id: string): number | undefined {
  return allLabeledRows(vocab).find((e) => e.id === id)?.code
}

export function idForCode(vocab: Vocabulary, code: number): string | undefined {
  return allLabeledRows(vocab).find((e) => e.code === code)?.id
}

export function codesForIds(vocab: Vocabulary, ids: string[]): number[] {
  const out: number[] = []
  for (const id of ids) {
    const code = codeForId(vocab, id)
    if (code !== undefined) out.push(code)
  }
  return out
}