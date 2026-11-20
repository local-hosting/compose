/**
 * Build 100 resilience-style social messages (neighbor / family SMS tone).
 * Output: compose/messages/resilience/resilience-synthetic.yaml
 */
import { writeCorpusYaml } from './write-corpus-yaml.mjs'

const QUESTION_TEMPLATES = [
  ['Anyone know if the nearest shelter is still taking people?', 'en', 'where_to_go'],
  ['We are torn — should we leave now or wait for the official notice?', 'en', 'what_to_do'],
  ['How long is this smoke supposed to last?', 'en', 'how_long'],
  ['Is it safe for the kids to wait outside the school gym?', 'en', 'is_it_safe_for_kids'],
  ['Can we drive through the standing water on Oak or is that reckless?', 'en', 'is_it_safe_outside'],
  ['Where can I go if the basement floods tonight?', 'en', 'where_to_go'],
  ['What should I do if the siren goes off again?', 'en', 'what_to_do'],
  ['Where is the nearest open shelter? Neighbors say the line is huge.', 'en', 'where_to_go'],
  ['¿Dónde hay refugio cerca? El grupo de WhatsApp no coincide', 'es', 'where_to_go'],
  ['¿Cuánto durará la alerta de humo?', 'es', 'how_long'],
  ['Les enfants peuvent-ils sortir dehors ce soir?', 'fr', 'is_it_safe_for_kids'],
  ['Où est le refuge le plus proche qui accepte encore des gens?', 'fr', 'where_to_go'],
]

const REPORT_TEMPLATES = [
  ['Group chat: water is rising on our block — basements are flooding', 'en'],
  ['Power died, smoke smells thick, trying to find out if the hospital is open', 'en'],
  ['Just felt another shake — cracks in the living room ceiling', 'en'],
  ['Stuck in traffic with an evac order — which way is everyone going?', 'en'],
  ['Street flooded knee-deep, cannot get to the main road from here', 'en'],
  ['Air quality is awful and the kids are coughing all night', 'en'],
  ['Dropping supplies at the school gym if anyone needs a ride there', 'en'],
  ['River jumped the levee downstream from us — water moving fast', 'en'],
  ['Trees down across the road by the clinic — sharing in case you are headed that way', 'en'],
  ['Phone at 4% — texting only, no calls', 'en'],
  ['Peor aquí: humo entrando por las ventanas', 'es'],
  ['Perdimos luz y hay mucho humo — ¿saben si hay refugio abierto?', 'es'],
  ['Otro sismo fuerte, daños en el edificio de al lado', 'es'],
  ['Ça empire ici — rue principale inondée, on ne peut plus sortir', 'fr'],
  ['Fumée partout — on cherche où aller avec les enfants', 'fr'],
  ['We are safe upstairs for now, just noisy', 'en'],
  ['Need help — grandma cannot get down the stairs and water is in the yard', 'en'],
  ['Power back briefly but the alert says flood warning again', 'en'],
  ['Car packed; heading toward Emergency shelter if the road stays open', 'en'],
  ['Sensor on the porch keeps failing — readings look wrong', 'en'],
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

writeCorpusYaml('resilience-synthetic', {
  description: 'Neighbor and family SMS during flood, wildfire smoke, and quake',
}, messages)