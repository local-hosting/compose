import type { LabelMap, LocalSymbolTablePack } from '@local-hosting/wire'
import { SUPPORTED_LANGUAGES } from '../src/languages.js'

/** Shared tip: family everyday + crisis resilience labels. */
export const table: LocalSymbolTablePack = {
  vocab_base: 'fp-test',
  entries: [
    { id: 'E_dinner', code: 1, kind: 'event' },
    { id: 'E_flood', code: 2, kind: 'event' },
    { id: 'A_pickup', code: 10, kind: 'action' },
    { id: 'A_evacuate', code: 11, kind: 'action' },
    { id: 'A_notify', code: 12, kind: 'action' },
    { id: 'P_home', code: 20, kind: 'place' },
    { id: 'P_school', code: 21, kind: 'place' },
    { id: 'P_shelter', code: 22, kind: 'place' },
    { id: 'P_lobby', code: 23, kind: 'place' },
    { id: 'R_milk', code: 50, kind: 'resource' },
    { id: 'R_ride', code: 51, kind: 'resource' },
    { id: 'R_medicine', code: 52, kind: 'resource' },
    { id: 'R_lodging', code: 53, kind: 'resource' },
    { id: 'R_food', code: 54, kind: 'resource' },
  ],
}

/** en + a slice of SUPPORTED_LANGUAGES for compose tests (hosts may ship all 12). */
export const labels: Record<string, LabelMap> = {
  E_dinner: { en: 'dinner', es: 'cena', fr: 'dîner', 'zh-Hans': '晚餐' },
  E_flood: { en: 'flood', es: 'inundación', fr: 'inondation', 'zh-Hans': '洪水' },
  A_pickup: { en: 'pickup', es: 'recoger', fr: 'récupérer', 'zh-Hans': '接' },
  A_evacuate: { en: 'evacuate', es: 'evacuar', fr: 'évacuer', 'zh-Hans': '撤离' },
  A_notify: { en: 'notify', es: 'avisar', fr: 'notifier', 'zh-Hans': '通知' },
  P_home: { en: 'home', es: 'casa', fr: 'maison', 'zh-Hans': '家' },
  P_school: { en: 'school', es: 'escuela', fr: 'école', 'zh-Hans': '学校' },
  P_shelter: { en: 'shelter', es: 'refugio', fr: 'abri', 'zh-Hans': '避难所' },
  P_lobby: { en: 'lobby', es: 'vestíbulo', fr: 'hall', 'zh-Hans': '大厅' },
  R_milk: { en: 'milk', es: 'leche', fr: 'lait', 'zh-Hans': '牛奶' },
  R_ride: { en: 'ride', es: 'viaje', fr: 'trajet', 'zh-Hans': '顺风车' },
  R_medicine: { en: 'medicine', es: 'medicina', fr: 'médicaments', 'zh-Hans': '药' },
  R_lodging: { en: 'lodging', es: 'alojamiento', fr: 'hébergement', 'zh-Hans': '住宿' },
  R_food: { en: 'food', es: 'comida', fr: 'nourriture', 'zh-Hans': '食物' },
}

export { SUPPORTED_LANGUAGES }
