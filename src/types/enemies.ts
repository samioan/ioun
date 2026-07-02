import type { StatBlock, SkillBlock, ActiveCondition, DerivedStat, EntityAction } from './system'

// Enemy / Adversary
// "Enemy" is the universal term — for systems that call them monsters, threats,
// antagonists, or NPCs with stat blocks, this model covers all of them.
export interface Enemy {
  id: string
  name: string
  type: string // free-text: "beast", "corporate agent", "cultist", "mech"
  size?: string // free-text or from SystemDefinition.sizeCategories
  threatRating?: string // CR, Threat Level, Nemesis Tier — label from SystemDefinition
  rewardValue?: number // XP, karma, bounty — whatever the system uses

  // Health
  health: { current: number; max: number }

  // System-agnostic stat block
  stats: StatBlock
  skills?: SkillBlock
  derivedStats: DerivedStat[]
  conditions: ActiveCondition[]

  // Actions — system-neutral action economy
  actions: EntityAction[]
  specialActions?: EntityAction[] // legendary actions, bonus actions, reactions, etc.

  // Narrative
  lore: string
  tactics: string
  weaknesses: string[]
  resistances: string[]
  immunities: string[]
  vulnerabilities: string[]
  senses: string
  languages: string[]

  // Custom fields — keys defined by SystemDefinition.customFields for 'enemy'
  customFields: Record<string, number | string | boolean>

  // Tracking
  isDefeated: boolean
  isBoss: boolean
  encounterIds: string[]
  lootDropIds: string[]
  notes: string
  templateId?: string
  isCustom: boolean
}

// Bestiary (template library)
export interface BestiaryEntry {
  id: string
  name: string
  systemId: string // which system this template is for
  source: string // "MM p.64" | "Bestiary 2" | "Custom"
  isCustom: boolean
  // Full stat template — same shape as Enemy
  type: string
  size?: string
  threatRating?: string
  defaultHealth: number
  stats: StatBlock
  derivedStats: DerivedStat[]
  actions: EntityAction[]
  lore: string
  tags: string[]
  customFields: Record<string, number | string | boolean>
}

// Prepared Encounter
export interface PreparedEncounter {
  id: string
  name: string
  locationId?: string
  difficulty: 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly' | 'custom'
  enemies: { templateId: string; count: number; notes: string }[]
  description: string
  triggers: string
  terrain: string
  complications: string[]
  lootIds: string[]
  // System-agnostic reward budget — XP, karma, bounty, whatever the system uses
  rewardBudget: number
  rewardLabel: string // "XP", "Karma", "Bounty", "Threat Points"
  notes: string
  isUsed: boolean
}
