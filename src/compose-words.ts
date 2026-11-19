import {
  REPORT_DEMAND,
  REPORT_OFFER,
  SYMBOL_ACK,
  SYMBOL_INTENT,
  SYMBOL_QUERY,
  SYMBOL_READING,
  SYMBOL_REPORT,
  SYMBOL_VERIFY,
  codesToCompact,
  intentToCompact,
  type CompactFrame,
  type LabelMap,
  type LocalSymbolTablePack,
  type SymbolKind,
} from '@local-hosting/frames'

export type ComposeWordsResult =
  | {
      ok: true
      frame: CompactFrame
      matched: Array<{ id: string; kind: SymbolKind; label: string }>
      unmatched: string[]
    }
  | { ok: false; reason: string; unmatched: string[] }

const BAND_WORDS: Record<string, 1 | 2 | 3 | 4> = {
  '1': 1,
  low: 1,
  '2': 2,
  med: 2,
  medium: 2,
  '3': 3,
  high: 3,
  '4': 4,
  critical: 4,
  crit: 4,
}

/** Lexicon → illocution. `need`/`offer` are report polarity, not query. */
const SYMBOL_WORDS: Record<string, number> = {
  intent: SYMBOL_INTENT,
  reading: SYMBOL_READING,
  query: SYMBOL_QUERY,
  ask: SYMBOL_QUERY,
  ack: SYMBOL_ACK,
  report: SYMBOL_REPORT,
  need: SYMBOL_REPORT,
  needs: SYMBOL_REPORT,
  needing: SYMBOL_REPORT,
  demand: SYMBOL_REPORT,
  offer: SYMBOL_REPORT,
  offering: SYMBOL_REPORT,
  // es / fr (common field cues)
  necesito: SYMBOL_REPORT,
  necesitamos: SYMBOL_REPORT,
  ofrezco: SYMBOL_REPORT,
  ofreciendo: SYMBOL_REPORT,
  besoin: SYMBOL_REPORT,
  offrir: SYMBOL_REPORT,
  offre: SYMBOL_REPORT,
  verify: SYMBOL_VERIFY,
  confirm: SYMBOL_VERIFY,
  confirmed: SYMBOL_VERIFY,
  confirmar: SYMBOL_VERIFY,
  confirmado: SYMBOL_VERIFY,
  confirmer: SYMBOL_VERIFY,
  confirmé: SYMBOL_VERIFY,
}

/** Interrogatives that imply query without a `?` (avoid bare is/can — too common in prose). */
const QUERY_CUES = new Set([
  'ask',
  'anyone',
  'where',
  'when',
  'what',
  'who',
  'whom',
  'which',
  'dónde',
  'donde',
  'qué',
  'que',
  'où',
  'quoi',
])

function normalize(text: string): string {
  return text.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function tokensOf(text: string): string[] {
  return normalize(text)
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
}

function phraseInHaystack(phrase: string, haystack: string): boolean {
  const needle = normalize(phrase)
  if (!needle) return false
  // Spaced languages
  if (` ${haystack} `.includes(` ${needle} `)) return true
  // CJK / unspaced scripts
  if (!needle.includes(' ') && haystack.includes(needle)) return true
  const parts = needle.split(' ').filter(Boolean)
  return parts.length > 0 && parts.every((p) => ` ${haystack} `.includes(` ${p} `))
}

function pickBand(text: string, tokens: string[]): 1 | 2 | 3 | 4 {
  for (const t of tokens) {
    const band = BAND_WORDS[t]
    if (band) return band
  }
  const m = text.match(/\bband\s*[:=]?\s*([1-4])\b/i)
  if (m) return Number(m[1]) as 1 | 2 | 3 | 4
  return 2
}

function pickReportPolarity(tokens: string[]): typeof REPORT_DEMAND | typeof REPORT_OFFER {
  if (
    tokens.some((t) =>
      ['offer', 'offering', 'have', 'ofrezco', 'ofreciendo', 'offrir', 'offre'].includes(
        t,
      ),
    )
  ) {
    return REPORT_OFFER
  }
  return REPORT_DEMAND
}

function looksLikeQuery(text: string, tokens: string[]): boolean {
  if (/[?？¿]/.test(text)) return true
  return tokens.some((t) => QUERY_CUES.has(t))
}

function pickSymbol(
  text: string,
  tokens: string[],
  byKind: Partial<Record<SymbolKind, string[]>>,
): number {
  const query = looksLikeQuery(text, tokens)
  for (const t of tokens) {
    const symbol = SYMBOL_WORDS[t]
    if (symbol === undefined) continue
    // "Anyone know if we need lodging?" → query, not demand
    if (query && symbol === SYMBOL_REPORT) continue
    return symbol
  }
  // Intent from event+action beats a trailing `?` in compound sentences.
  if (byKind.event?.length && (byKind.action?.length || byKind.actor?.length)) {
    return SYMBOL_INTENT
  }
  if (query) return SYMBOL_QUERY
  if (byKind.resource?.length) return SYMBOL_REPORT
  return SYMBOL_READING
}

/**
 * Map free-text words onto local symbol-table labels, then build a CompactFrame.
 * Rules/lexicon only — no model runtime.
 */
export function composeWords(
  text: string,
  table: LocalSymbolTablePack,
  labels: Record<string, LabelMap>,
  lang = 'en',
): ComposeWordsResult {
  const raw = text.trim()
  if (!raw) return { ok: false, reason: 'empty', unmatched: [] }

  const haystack = normalize(raw)
  const tokens = tokensOf(raw)
  const reserved = new Set([
    ...Object.keys(BAND_WORDS),
    ...Object.keys(SYMBOL_WORDS),
    ...QUERY_CUES,
    'band',
    'have',
    'please',
    'the',
    'a',
    'an',
    'to',
    'for',
    'at',
    'from',
    'you',
    'we',
    'i',
    'our',
    'my',
    'tonight',
    'now',
    'open',
    'kids',
    'kids',
    'breakfast',
    'priority',
  ])

  const matched: Array<{ id: string; kind: SymbolKind; label: string }> = []
  const matchedIds = new Set<string>()

  for (const entry of table.entries) {
    if (matchedIds.has(entry.id)) continue
    const label = labels[entry.id]?.[lang] ?? labels[entry.id]?.en ?? entry.id
    const idHit =
      tokens.includes(normalize(entry.id)) ||
      tokens.includes(normalize(entry.id).replace(/_/g, ''))
    const labelHit = phraseInHaystack(label, haystack)
    if (!idHit && !labelHit) continue
    matchedIds.add(entry.id)
    matched.push({ id: entry.id, kind: entry.kind, label })
  }

  const byKind: Partial<Record<SymbolKind, string[]>> = {}
  for (const m of matched) {
    const list = byKind[m.kind] ?? (byKind[m.kind] = [])
    list.push(m.id)
  }

  const unmatched = tokens.filter((t) => {
    if (reserved.has(t)) return false
    return !matched.some(
      (m) =>
        phraseInHaystack(m.label, t) ||
        normalize(m.id) === t ||
        normalize(m.id).replace(/_/g, '') === t ||
        tokensOf(m.label).includes(t),
    )
  })

  if (matched.length === 0) {
    return {
      ok: false,
      reason: 'no vocab matches — try labels like notify, lobby, staff',
      unmatched,
    }
  }

  const codes: Partial<Record<SymbolKind, number[]>> = {}
  for (const [kind, ids] of Object.entries(byKind) as Array<
    [SymbolKind, string[]]
  >) {
    codes[kind] = ids.map((id) => {
      const entry = table.entries.find((e) => e.id === id)!
      return entry.code
    })
  }

  const symbol = pickSymbol(raw, tokens, byKind)
  const band = pickBand(raw, tokens)

  let frame: CompactFrame
  if (symbol === SYMBOL_INTENT) {
    const event_code = codes.event?.[0]
    if (event_code === undefined) {
      return {
        ok: false,
        reason: 'intent needs an event (e.g. “Demo event”)',
        unmatched,
      }
    }
    frame = intentToCompact(table.vocab_base, {
      event_code,
      band,
      actor_codes: codes.actor ?? [],
      action_codes: codes.action ?? [],
      place_codes: codes.place ?? [],
    })
  } else if (symbol === SYMBOL_REPORT) {
    const polarity = pickReportPolarity(tokens)
    frame = codesToCompact(symbol, table.vocab_base, codes, {
      band,
      offer: polarity,
    })
  } else {
    frame = codesToCompact(symbol, table.vocab_base, codes, { band })
  }

  return { ok: true, frame, matched, unmatched }
}
