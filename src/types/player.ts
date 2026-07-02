import type { StatBlock, SkillBlock, ActiveCondition, DerivedStat } from './system'
import type { InventoryItem } from './loot'

// Player Character
export interface Player {
  id: string
  name: string
  playerName: string
  pronouns?: string

  // Universal identity fields — labels adapt to system (race→species, class→archetype, etc.)
  // These are free-text; the DM's system definition sets what they mean
  ancestry: string // "race", "species", "heritage", "origin"
  characterClass: string // "class", "archetype", "role", "playbook"
  subclass?: string
  additionalClasses?: { className: string; level: number }[]
  background: string
  alignment?: string // optional — many systems don't use alignment

  // Progression — label and scale come from SystemDefinition.progression
  progressionValue: number // level, rank, tier — whatever the system uses
  experiencePoints: number // 0 if milestone system

  // Stats — keys defined by SystemDefinition.stats
  stats: StatBlock

  // Skills — keys defined by SystemDefinition.skills
  skills: SkillBlock

  // Health — only rendered if SystemDefinition.hasHealthPoints
  health: {
    current: number
    max: number
    temp: number // temporary HP or equivalent
  }

  // Death mechanic — only rendered if SystemDefinition.hasDeathMechanic
  deathMechanic?: {
    successes: number
    failures: number
    label: string // pulled from SystemDefinition
  }

  // Derived/computed values — stored as freeform because formulas vary by system
  // Each entry: a label (e.g. "Armor Class", "Defense", "Evasion") and a value
  derivedStats: DerivedStat[]

  // Active conditions — strings matching SystemDefinition.conditions[].key
  conditions: ActiveCondition[]

  // Magic / ability resource pools — only rendered if SystemDefinition.hasMagicSystem
  // Generic model: named pools with current/max; DM defines what they are
  resourcePools: ResourcePool[]

  // Features, abilities, talents — system-neutral
  features: CharacterFeature[]

  // Inventory
  inventory: InventoryItem[]

  // Currency — keys defined by SystemDefinition.currency[].key
  currency: Record<string, number>

  // Custom fields — keys defined by SystemDefinition.customFields for 'player'
  customFields: Record<string, number | string | boolean>

  // Narrative fields
  notes: string
  backstory: string
  appearance: string
  personalityTraits: string
  ideals: string
  bonds: string
  flaws: string
  age?: string
  height?: string
  weight?: string
  languages: string[]
  proficiencies: string[] // free-text list of general proficiencies

  // Meta
  allegiances: string[] // faction IDs
  portrait?: string
  isAlive: boolean
  attunedItemIds: string[] // only relevant if SystemDefinition.hasAttunement
  relationshipMap: Record<string, string>
  xpLog: XPEntry[]

  // Custom resource trackers beyond the structured pools (player-defined ad hoc)
  trackers: CustomTracker[]
}

export interface ResourcePool {
  id: string
  name: string // "Spell Slots Lv1", "Stress", "Mana", "Power Points"
  current: number
  max: number
  rechargeOn?: string // references RestTypeDefinition.key or freetext
  color?: string
  slots?: { level: number; used: number; max: number }[] // for leveled slot systems
}

export interface CharacterFeature {
  id: string
  name: string
  source: string
  description: string
  // Optional limited-use tracking; rechargeOn references RestTypeDefinition.key
  uses?: { current: number; max: number; rechargeOn: string }
}

export interface CustomTracker {
  id: string
  name: string
  current: number
  max: number
  rechargeOn: string // RestTypeDefinition.key or "manual"
  color?: string
}

export interface XPEntry {
  id: string
  amount: number
  reason: string
  sessionId?: string
  timestamp: string
}
