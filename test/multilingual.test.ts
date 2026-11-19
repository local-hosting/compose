import { describe, expect, it } from 'vitest'
import {
  REPORT_DEMAND,
  REPORT_OFFER,
  SYMBOL_QUERY,
  SYMBOL_REPORT,
  SYMBOL_VERIFY,
} from '@local-hosting/wire'
import { composeWords } from '../src/index.js'
import { SUPPORTED_LANGUAGES } from '../src/languages.js'
import { labels, table } from './fixtures.js'

describe('SUPPORTED_LANGUAGES contract', () => {
  it('lists the twelve BCP-47 tags (owned here, not in AI)', () => {
    expect([...SUPPORTED_LANGUAGES]).toEqual([
      'ar',
      'en',
      'es',
      'fr',
      'he',
      'hi',
      'it',
      'nl',
      'pt',
      'ta',
      'zh-Hans',
      'zh-Hant',
    ])
  })
})

describe('multilingual compose', () => {
  it('es: Necesitamos leche para el desayuno 🥛', () => {
    const result = composeWords(
      'Necesitamos leche para el desayuno 🥛',
      table,
      labels,
      'es',
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_REPORT)
    expect(result.frame.fields?.offer).toBe(REPORT_DEMAND)
    expect(result.frame.codes.resource).toEqual([50])
  })

  it('es: ¿Está abierto el refugio?', () => {
    const result = composeWords('¿Está abierto el refugio?', table, labels, 'es')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_QUERY)
    expect(result.frame.codes.place).toEqual([22])
  })

  it('fr: On offre de la nourriture à l’abri 🍞', () => {
    const result = composeWords(
      'On offre de la nourriture à l’abri 🍞',
      table,
      labels,
      'fr',
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_REPORT)
    expect(result.frame.fields?.offer).toBe(REPORT_OFFER)
    expect(result.frame.codes.resource).toEqual([54])
    expect(result.frame.codes.place).toEqual([22])
  })

  it('fr: Confirmer les médicaments ✅', () => {
    const result = composeWords(
      'Confirmer les médicaments ✅',
      table,
      labels,
      'fr',
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_VERIFY)
    expect(result.frame.codes.resource).toEqual([52])
  })

  it('zh-Hans: 我们需要住宿 🏠', () => {
    const result = composeWords('我们需要住宿 🏠', table, labels, 'zh-Hans')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_REPORT)
    expect(result.frame.codes.resource).toEqual([53])
  })

  it('zh-Hans: 避难所开放了吗？', () => {
    const result = composeWords('避难所开放了吗？', table, labels, 'zh-Hans')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.frame.symbol).toBe(SYMBOL_QUERY)
    expect(result.frame.codes.place).toEqual([22])
  })
})
