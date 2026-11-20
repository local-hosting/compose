import {
  REPORT_DEMAND,
  REPORT_OFFER,
  SYMBOL_INTENT,
  SYMBOL_QUERY,
  SYMBOL_REPORT,
  SYMBOL_VERIFY,
} from '@local-hosting/frames'
import { expect } from 'vitest'
import { composeWords } from '../src/index.js'
import type { MessageCorpusId, MessageRow } from '../src/messages/types.js'
import { labels, table } from './fixtures.js'

export const COMPOSE_DOMAIN_CORPORA: MessageCorpusId[] = ['everyday', 'resilience']

const SYMBOL_BY_NAME = {
  report: SYMBOL_REPORT,
  query: SYMBOL_QUERY,
  intent: SYMBOL_INTENT,
  verify: SYMBOL_VERIFY,
} as const

export function assertComposeExpect(
  row: MessageRow,
  result: ReturnType<typeof composeWords>,
): void {
  const exp = row.expect
  if (!exp) {
    throw new Error(`${row.id}: missing expect in corpus YAML`)
  }
  expect(result.ok).toBe(exp.compose_ok)
  if (!exp.compose_ok || !result.ok) return
  if (exp.symbol) expect(result.frame.symbol).toBe(SYMBOL_BY_NAME[exp.symbol])
  if (exp.offer === 'demand') expect(result.frame.fields?.offer).toBe(REPORT_DEMAND)
  if (exp.offer === 'offer') expect(result.frame.fields?.offer).toBe(REPORT_OFFER)
  if (exp.resource_code != null) {
    expect(result.frame.codes.resource).toEqual([exp.resource_code])
  }
  if (exp.place_code != null) {
    expect(result.frame.codes.place).toEqual([exp.place_code])
  }
  if (exp.event_code != null) {
    expect(result.frame.codes.event).toEqual([exp.event_code])
  }
  if (exp.action_code != null) {
    expect(result.frame.codes.action).toEqual([exp.action_code])
  }
  if (exp.band != null) {
    expect(result.frame.fields?.band).toBe(exp.band)
  }
}

export function composeWordsForRow(row: MessageRow): ReturnType<typeof composeWords> {
  return composeWords(row.text, table, labels, row.lang)
}

export function nonEnglishRows(messages: MessageRow[]): MessageRow[] {
  return messages.filter((row) => row.lang !== 'en')
}