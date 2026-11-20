import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, stringify } from 'yaml'

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const yamlPath = path.join(pkgRoot, 'messages/resilience/resilience-synthetic.yaml')
const annotateTs = path.resolve(pkgRoot, '../spatial-ai/scripts/geo-annotate-stdin.ts')

const doc = parse(readFileSync(yamlPath, 'utf8'))
const annotated = execFileSync(
  'node',
  ['--import', 'tsx', annotateTs],
  {
    input: JSON.stringify(doc.messages),
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  },
)
doc.messages = JSON.parse(annotated)
writeFileSync(yamlPath, `${stringify(doc, { lineWidth: 0 })}\n`)
console.log(`Annotated geo gold on ${doc.messages.length} rows → ${yamlPath}`)