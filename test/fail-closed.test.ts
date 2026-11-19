import { describe, expect, it } from 'vitest'
import { SYMBOL_QUERY, SYMBOL_REPORT } from '@local-hosting/frames'
import { composeWords } from '../src/index.js'
import { labels, table } from './fixtures.js'

/** Guardrails: never invent codes from unmatched or incomplete prose. */
describe('fail-closed', () => {
  it('empty / nonsense → no frame', () => {
    expect(composeWords('', table, labels)).toEqual({
      ok: false,
      reason: 'empty',
      unmatched: [],
    })
    expect(composeWords('zzzz nohit', table, labels).ok).toBe(false)
  })

  it('sympathy-only noise → no vocab match', () => {
    const result = composeWords(
      'Praying for everyone — stay safe out there ❤️',
      table,
      labels,
    )
    expect(result.ok).toBe(false)
  })

  it('explicit intent without a named event → fail', () => {
    const result = composeWords(
      'intent: please evacuate now, high priority',
      table,
      labels,
    )
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toMatch(/intent needs an event/i)
  })

  it('noisy share still keeps the real need', () => {
    const result = composeWords(
      'Please RT!!! we need lodging #flood 🙏',
      table,
      labels,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_REPORT)
    expect(result.frame.codes.resource).toEqual([53])
  })

  it('question that also says need → query wins', () => {
    const result = composeWords(
      'Anyone know if we need lodging tonight?',
      table,
      labels,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_QUERY)
  })
})
