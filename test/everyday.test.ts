import { describe, expect, it } from 'vitest'
import {
  REPORT_DEMAND,
  REPORT_OFFER,
  SYMBOL_INTENT,
  SYMBOL_QUERY,
  SYMBOL_REPORT,
  SYMBOL_VERIFY,
} from '@local-hosting/frames'
import { composeWords } from '../src/index.js'
import { labels, table } from './fixtures.js'

/**
 * Everyday: common family scenarios in natural language (some with emoji).
 */
describe('everyday family messages', () => {
  it('We need milk for breakfast 🥛', () => {
    const result = composeWords('We need milk for breakfast 🥛', table, labels)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_REPORT)
    expect(result.frame.fields?.offer).toBe(REPORT_DEMAND)
    expect(result.frame.codes.resource).toEqual([50])
  })

  it('I can offer a ride to school 🙂', () => {
    const result = composeWords('I can offer a ride to school 🙂', table, labels)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_REPORT)
    expect(result.frame.fields?.offer).toBe(REPORT_OFFER)
    expect(result.frame.codes.resource).toEqual([51])
    expect(result.frame.codes.place).toEqual([21])
  })

  it('Are you home yet?', () => {
    const result = composeWords('Are you home yet?', table, labels)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_QUERY)
    expect(result.frame.codes.place).toEqual([20])
  })

  it('Dinner plan: pickup the kids from school', () => {
    const result = composeWords(
      'Dinner plan: pickup the kids from school',
      table,
      labels,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_INTENT)
    expect(result.frame.codes.event).toEqual([1])
    expect(result.frame.codes.action).toEqual([10])
    expect(result.frame.codes.place).toEqual([21])
  })

  it('Can you confirm the medicine dose? ✅', () => {
    const result = composeWords(
      'Can you confirm the medicine dose? ✅',
      table,
      labels,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_VERIFY)
    expect(result.frame.codes.resource).toEqual([52])
  })
})
