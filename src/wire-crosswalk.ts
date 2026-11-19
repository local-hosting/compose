import {
  mergeCrosswalkIntoTable,
  type LabelMap,
  type LocalSymbolTablePack,
} from '@local-hosting/frames'

export type ComposeCrosswalkRow = {
  legacy_code: string
  id: string
  code: number
  kind: 'resource'
  category?: string
  subcategory?: string
  labels?: LabelMap
}

export function applyWireCrosswalk(
  table: LocalSymbolTablePack,
  rows: ComposeCrosswalkRow[],
): LocalSymbolTablePack {
  if (!rows.length) return table
  return mergeCrosswalkIntoTable(table, rows)
}