import { describe, expect, it } from 'vitest'
import {
  REPORT_DEMAND,
  REPORT_OFFER,
  SYMBOL_INTENT,
  SYMBOL_QUERY,
  SYMBOL_REPORT,
  SYMBOL_VERIFY,
} from '@local-hosting/wire'
import { composeWords } from '../src/index.js'
import { labels, table } from './fixtures.js'

/**
 * Resilience: off-grid / disaster response in natural language (some with emoji).
 */
describe('resilience off-grid / disaster messages', () => {
  it('We need lodging for three families tonight 🏠', () => {
    const result = composeWords(
      'We need lodging for three families tonight 🏠',
      table,
      labels,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_REPORT)
    expect(result.frame.fields?.offer).toBe(REPORT_DEMAND)
    expect(result.frame.codes.resource).toEqual([53])
  })

  it('Offering food at the shelter — come by if you can 🍞', () => {
    const result = composeWords(
      'Offering food at the shelter — come by if you can 🍞',
      table,
      labels,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_REPORT)
    expect(result.frame.fields?.offer).toBe(REPORT_OFFER)
    expect(result.frame.codes.resource).toEqual([54])
    expect(result.frame.codes.place).toEqual([22])
  })

  it('Is the shelter open right now?', () => {
    const result = composeWords('Is the shelter open right now?', table, labels)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_QUERY)
    expect(result.frame.codes.place).toEqual([22])
  })

  it('Flood is rising — evacuate now, high priority 🚨', () => {
    const result = composeWords(
      'Flood is rising — evacuate now, high priority 🚨',
      table,
      labels,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_INTENT)
    expect(result.frame.codes.event).toEqual([2])
    expect(result.frame.codes.action).toEqual([11])
    expect(result.frame.fields?.band).toBe(3)
  })

  it('Confirmed: medicine arrived at the lobby ✅', () => {
    const result = composeWords(
      'Confirmed: medicine arrived at the lobby ✅',
      table,
      labels,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_VERIFY)
    expect(result.frame.codes.resource).toEqual([52])
    expect(result.frame.codes.place).toEqual([23])
  })
})
