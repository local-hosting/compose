/**
 * Build 100 resilience-style social messages (Ready.gov / EIN patterns, paraphrased).
 * Output: compose/messages/resilience/resilience-synthetic.yaml
 */
import { writeCorpusYaml } from './write-corpus-yaml.mjs'

const QUESTION_TEMPLATES = [
  ['Where is the nearest shelter open right now?', 'en', 'where_to_go'],
  ['Any open evacuation center near me?', 'en', 'where_to_go'],
  ['flash flood warning — should we leave?', 'en', 'what_to_do'],
  ['How long will this smoke last?', 'en', 'how_long'],
  ['Is it safe for kids outside?', 'en', 'is_it_safe_for_kids'],
  ['Can I drive through the water on 3rd?', 'en', 'is_it_safe_outside'],
  ['¿Dónde hay refugio cerca?', 'es', 'where_to_go'],
  ['¿Cuánto durará la alerta?', 'es', 'how_long'],
  ['Où est le refuge le plus proche?', 'fr', 'where_to_go'],
  ["C'est safe dehors pour les enfants?", 'fr', 'is_it_safe_for_kids'],
]

const REPORT_TEMPLATES = [
  ['Water rising fast on our block — need shelter info', 'en'],
  ['Lost power, smoke thick, anyone know hospital status?', 'en'],
  ['Just felt another shake, ceiling cracked', 'en'],
  ['Stuck on highway, evacuation order — where to go?', 'en'],
  ['Neighborhood flooded knee deep, can’t reach main road', 'en'],
  ['Air quality terrible, kids coughing', 'en'],
  ['Volunteers needed at school gym — sharing location', 'en'],
  ['River overcame the levee downstream', 'en'],
  ['Trees down, roads blocked near the clinic', 'en'],
  ['Using phone battery last bar — texting not calling', 'en'],
  ['Agua subiendo rápido — necesitamos refugio', 'es'],
  ['Humo horrible, ¿hay centro de evacuación?', 'es'],
  ['Otro temblor fuerte, edificio dañado', 'es'],
  ['Inondation rue principale impossible sortir', 'fr'],
  ['Fumée incendie — où aller?', 'fr'],
]

const SESSION_OFFSETS = [
  { lat: 0, lon: 0, place_index: 1 },
  { lat: 0.02, lon: -0.01, place_index: 2 },
  { lat: -0.015, lon: 0.012, place_index: 3 },
  { lat: 0.03, lon: 0.02, place_index: 4 },
  { lat: -0.025, lon: -0.02, place_index: 5 },
  { lat: 0.01, lon: 0.035, place_index: 6 },
  { lat: 0.04, lon: -0.03, place_index: 7 },
  { lat: -0.04, lon: 0.025, place_index: 8 },
]

const CENTROID = { lat: 37.7749, lon: -122.4194 }

const messages = []
let n = 0
while (messages.length < 100) {
  const pool = n % 3 === 0 ? QUESTION_TEMPLATES : REPORT_TEMPLATES
  const tpl = pool[n % pool.length]
  const off = SESSION_OFFSETS[n % SESSION_OFFSETS.length]
  const kind = tpl.length > 2 ? 'question' : 'report'
  const eventRef = n % 3 === 0 ? 'E_FLOOD' : n % 3 === 1 ? 'E_WILDFIRE' : 'E_QUAKE'
  const mapLabel = kind === 'question' ? tpl[2] : undefined
  messages.push({
    id: `msg_${String(messages.length + 1).padStart(3, '0')}`,
    text: tpl[0],
    lang: tpl[1],
    kind,
    expected_map_label: mapLabel,
    expected_place_id: `P_DIS_${String(off.place_index).padStart(2, '0')}`,
    session: {
      lat: CENTROID.lat + off.lat,
      lon: CENTROID.lon + off.lon,
      geotype: n % 5 === 0 ? 'shelter' : undefined,
    },
    event_ref: eventRef,
    band: 2 + (n % 3),
  })
  n += 1
}

writeCorpusYaml('resilience-synthetic', { description: 'Paraphrased Ready.gov-style prompts' }, messages)