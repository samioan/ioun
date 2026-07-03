import { createDefaultEnemy } from './defaults'
import type { BestiaryEntry, Enemy } from '@/types'

// A BestiaryEntry is a reusable TEMPLATE — unlike Player/Enemy -> InitiativeEntry
// (which deliberately SHARE references so combat mutations reflect back onto
// the live record), spawning an Enemy from a template must deep-copy
// stats/derivedStats/actions. Sharing references here would mean editing one
// spawned Goblin's stats in combat silently mutates every future Goblin.
// JSON.parse(JSON.stringify(...)) matches the one deep-copy idiom this app
// already implicitly relies on (usePersistence round-trips all state through
// JSON on every write, so this data is already proven JSON-safe).
export function cloneBestiaryEntryToEnemy(entry: BestiaryEntry): Omit<Enemy, 'id'> {
  return createDefaultEnemy({
    name: entry.name,
    type: entry.type,
    size: entry.size,
    threatRating: entry.threatRating,
    health: { current: entry.defaultHealth, max: entry.defaultHealth },
    stats: JSON.parse(JSON.stringify(entry.stats)),
    derivedStats: JSON.parse(JSON.stringify(entry.derivedStats)),
    actions: JSON.parse(JSON.stringify(entry.actions)),
    lore: entry.lore,
    customFields: JSON.parse(JSON.stringify(entry.customFields)),
    templateId: entry.id,
  })
}
