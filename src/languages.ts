/** BCP-47 tags for vocab labels. Hosts may ship a subset. Alphabetized. */
export const SUPPORTED_LANGUAGES = [
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
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}
