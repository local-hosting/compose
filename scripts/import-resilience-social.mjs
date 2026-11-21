/**
 * Pull 100 on-topic social posts → compose/messages/resilience/resilience-social.yaml
 * Upstream: https://github.com/sajao/CrisisLex/tree/master/data (Olteanu et al., ICWSM 2014)
 */
import { createHash } from 'node:crypto'
import { writeCorpusYaml } from './write-corpus-yaml.mjs'

const BASE =
  'https://raw.githubusercontent.com/sajao/CrisisLex/master/data/CrisisLexT6'

const CRISES = [
  { dir: '2012_Sandy_Hurricane', event_ref: 'E_FLOOD', band: 4 },
  { dir: '2013_Alberta_Floods', event_ref: 'E_FLOOD', band: 3 },
  { dir: '2013_Oklahoma_Tornado', event_ref: 'E_FLOOD', band: 4 },
  { dir: '2013_Queensland_Floods', event_ref: 'E_FLOOD', band: 3 },
  { dir: '2013_West_Texas_Explosion', event_ref: 'E_WILDFIRE', band: 4 },
]

const SESSION_OFFSETS = [
  { lat: 0, lon: 0, place_index: 9 },
  { lat: 0.02, lon: -0.01, place_index: 10 },
  { lat: -0.015, lon: 0.012, place_index: 11 },
  { lat: 0.03, lon: 0.02, place_index: 12 },
  { lat: -0.025, lon: -0.02, place_index: 13 },
  { lat: 0.01, lon: 0.035, place_index: 14 },
  { lat: 0.04, lon: -0.03, place_index: 15 },
  { lat: -0.04, lon: 0.025, place_index: 16 },
]

const CENTROID = { lat: 37.7749, lon: -122.4194 }
const TARGET_TOTAL = 100
const PER_CRISIS = Math.ceil(TARGET_TOTAL / CRISES.length)

function parseCrisisLexLine(line) {
  const trimmed = line.replace(/\r$/, '').trim()
  if (!trimmed || trimmed.startsWith('tweet id')) return null
  const labelMatch = trimmed.match(/,\s*(on-topic|off-topic)\s*$/)
  if (!labelMatch) return null
  const topic = labelMatch[1]
  const body = trimmed.slice(0, trimmed.length - labelMatch[0].length)
  const quoted = body.match(/^'([^']+)',\s*"(.*)"\s*$/s)
  if (quoted) {
    return {
      tweet_id: quoted[1],
      text: quoted[2].replace(/""/g, '"').trim(),
      topic,
    }
  }
  const plain = body.match(/^'([^']+)',\s*(.+)\s*$/s)
  if (!plain) return null
  return {
    tweet_id: plain[1],
    text: plain[2].replace(/^"|"$/g, '').trim(),
    topic,
  }
}

function kindFor(text) {
  if (/[?？¿]/.test(text)) return 'question'
  const lower = text.toLowerCase()
  if (/\b(where|when|how|what|who|shelter|evacuat)\b/.test(lower)) {
    return 'question'
  }
  return 'report'
}

function dedupeKey(text) {
  return createHash('sha256').update(text.toLowerCase()).digest('hex').slice(0, 16)
}

async function fetchOnTopic(crisis) {
  const url = `${BASE}/${crisis.dir}/${crisis.dir}-ontopic_offtopic.csv`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch failed ${url}: ${res.status}`)
  const csv = await res.text()
  const rows = []
  const seen = new Set()
  for (const line of csv.split('\n')) {
    const parsed = parseCrisisLexLine(line)
    if (!parsed || parsed.topic !== 'on-topic') continue
    const key = dedupeKey(parsed.text)
    if (seen.has(key)) continue
    seen.add(key)
    rows.push(parsed)
  }
  return rows
}

async function main() {
  const messages = []
  let n = 0
  for (const crisis of CRISES) {
    const onTopic = await fetchOnTopic(crisis)
    for (let i = 0; i < Math.min(PER_CRISIS, onTopic.length); i++) {
      const row = onTopic[i]
      const off = SESSION_OFFSETS[n % SESSION_OFFSETS.length]
      n += 1
      messages.push({
        id: `clx_${String(messages.length + 1).padStart(3, '0')}`,
        text: row.text,
        lang: 'en',
        kind: kindFor(row.text),
        expected_place_id: `P_DIS_${String(off.place_index).padStart(2, '0')}`,
        session: {
          lat: CENTROID.lat + off.lat,
          lon: CENTROID.lon + off.lon,
          geotype: n % 7 === 0 ? 'shelter' : undefined,
        },
        event_ref: crisis.event_ref,
        band: crisis.band,
        provenance: {
          dataset: 'CrisisLexT6',
          event: crisis.dir,
          external_id: row.tweet_id,
          attribution:
            'Olteanu et al., CrisisLex (ICWSM 2014); github.com/sajao/CrisisLex',
        },
      })
      if (messages.length >= TARGET_TOTAL) break
    }
    if (messages.length >= TARGET_TOTAL) break
  }

  if (messages.length < TARGET_TOTAL) {
    throw new Error(`Only collected ${messages.length} social rows (wanted ${TARGET_TOTAL})`)
  }

  writeCorpusYaml(
    'resilience-social',
    {
      description: 'On-topic social posts (2012–2013 crisis events)',
      upstream: 'https://github.com/sajao/CrisisLex/tree/master/data',
    },
    messages,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})