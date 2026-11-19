export type PackMode = 'daily' | 'resilience'

export const PACK_IDS = {
  daily: 'city-default',
  resilience: 'resilience',
} as const satisfies Record<PackMode, string>

export type PackId = (typeof PACK_IDS)[PackMode]

export function resolvePackId(mode: PackMode): PackId {
  return PACK_IDS[mode]
}