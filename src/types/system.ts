// The schema that defines how a specific RPG system works.
// Lives on Campaign and drives how all entity forms render.
export interface SystemDefinition {
  id: string
  name: string // "D&D 5e" | "Call of Cthulhu 7e" | "My Homebrew" | etc.
  isPreset: boolean // true for bundled templates
  isCustom: boolean

  // Stats (ability scores, attributes, or whatever the system calls them)
  stats: StatDefinition[]

  // Skills
  skills: SkillDefinition[]

  // Conditions / status effects the system uses
  conditions: ConditionDefinition[]

  // What proficiency/mastery levels are called and how many exist
  // e.g. D&D: ["none","proficient","expert"]
  // e.g. Pathfinder 2e: ["untrained","trained","expert","master","legendary"]
  // e.g. Call of Cthulhu: [] (uses percentile scores, not tiers)
  proficiencyScale: string[]

  // Progression
  progression: ProgressionDefinition

  // Currency denominations (empty array = no currency system)
  currency: CurrencyDenomination[]

  // Whether this system uses a challenge rating / threat rating concept
  hasThreatRating: boolean
  threatRatingLabel: string // "CR", "Threat Level", "Nemesis Tier", etc.

  // Whether the system has a spell slot or equivalent resource pool concept
  hasMagicSystem: boolean
  magicSystemLabel: string // "Spell Slots", "Mana", "Power Points", "Bonds", etc.

  // Whether the system tracks HP or an equivalent resource
  hasHealthPoints: boolean
  healthLabel: string // "HP", "Hit Points", "Health", "Stress", "Integrity"

  // Whether the system has a death/incapacitation save mechanic
  hasDeathMechanic: boolean
  deathMechanicLabel: string // "Death Saves", "Last Gasp", "Trauma Roll", etc.
  deathMechanicDescription: string

  // Whether the system uses a size/scale category for entities
  hasSizeCategories: boolean
  sizeCategories: string[] // ["Tiny","Small","Medium","Large","Huge","Gargantuan"] or custom

  // Whether the system uses initiative / turn order in conflicts
  hasInitiative: boolean
  initiativeLabel: string // "Initiative", "Reflex Order", "Turn Order"

  // Whether the system uses encumbrance / carry weight
  hasEncumbrance: boolean

  // Whether the system uses attunement or equivalent binding mechanic
  hasAttunement: boolean
  attunementLabel: string // "Attunement", "Bonding", "Resonance"
  maxAttunedItems: number

  // Rest / recovery types (empty = no structured rest system)
  restTypes: RestTypeDefinition[]

  // Any additional system-level fields the DM wants to define per entity type
  customFields: CustomFieldDef[]

  // Free-text system notes / house rule summary
  notes: string
}

export interface StatDefinition {
  key: string // internal key, e.g. "strength" or "bod" or "physique"
  label: string // display name: "Strength", "Body", "Physique"
  abbreviation: string // "STR", "BOD", "PHY"
  description?: string
  minValue: number
  maxValue: number
  // If this stat has a derived modifier (like D&D's floor((score-10)/2)), define the formula
  // Supported tokens: {value} = raw stat value
  modifierFormula?: string // "floor(({value} - 10) / 2)" | "({value} - 10)" | null
  modifierLabel?: string // "Modifier", "Bonus", "Derived"
}

export interface SkillDefinition {
  key: string // internal key
  label: string // "Acrobatics", "Stealth", "Drive", etc.
  linkedStatKey?: string // which stat governs this skill
  description?: string
  // How skill competence is stored:
  // "proficiency" = uses the proficiency scale defined above (D&D / PF2e style)
  // "percentage"  = 0–100 numeric value (Call of Cthulhu style)
  // "rank"        = 0–N numeric rank (Shadowrun, etc.)
  // "boolean"     = known / not known
  competenceModel: 'proficiency' | 'percentage' | 'rank' | 'boolean'
  maxRank?: number // for rank model
}

export interface ConditionDefinition {
  key: string
  label: string // "Blinded", "On Fire", "Stressed", "Wanted"
  description: string // full effect text shown as tooltip
  color?: string // optional tag color override
  icon?: string // optional phosphor icon name
}

export interface ProgressionDefinition {
  // How characters advance
  model: 'level' | 'xp-threshold' | 'milestone' | 'skill-based' | 'custom'
  label: string // "Level", "Rank", "Tier", "Mark"
  minValue: number // usually 1
  maxValue: number // 20, 10, 5, etc.
  // XP thresholds per level (for xp-threshold model); index = level
  xpThresholds?: number[]
  // For custom models, a freetext description
  customDescription?: string
}

export interface CurrencyDenomination {
  key: string // "gp", "nuyen", "credits", "gold"
  label: string // "Gold Pieces", "Nuyen", "Credits"
  abbreviation: string // "gp", "¥", "cr"
  // Conversion rate relative to the base denomination (index 0 = base = 1)
  conversionRate: number // e.g. 1 gp = 1, 1 sp = 0.1, 1 cp = 0.01
}

export interface RestTypeDefinition {
  key: string // "short", "long", "night", "meditation"
  label: string // "Short Rest", "Long Rest", "Full Night's Sleep"
  description: string
  durationHint: string // "1 hour", "8 hours", "1 scene"
}

export interface CustomFieldDef {
  id: string
  key: string // internal key for storage
  label: string // display label
  type: 'number' | 'text' | 'boolean' | 'select' | 'tracker'
  options?: string[] // for select type
  // tracker type: renders as current/max resource (like CustomTracker but schema-defined)
  trackerMax?: number
  // Which entity types this field applies to
  appliesTo: Array<'player' | 'npc' | 'enemy' | 'item'>
  defaultValue?: number | string | boolean
  description?: string
  // Display grouping on entity forms
  group?: string // "Combat", "Social", "Special", etc.
  isRequired: boolean
  isSecret: boolean // DM-only field
}

// Universal stat block — keys are defined by SystemDefinition.stats[].key
// Values are numbers for numeric stats, strings for descriptive attributes
export type StatBlock = Record<string, number | string>

// Universal skill block — keys are defined by SystemDefinition.skills[].key
// Values depend on the skill's competenceModel:
//   proficiency → index into proficiencyScale (0, 1, 2...)
//   percentage  → 0–100
//   rank        → 0–N
//   boolean     → 0 (false) or 1 (true)
export type SkillBlock = Record<string, number>

// Conditions are plain strings matching ConditionDefinition.key
export type ActiveCondition = string

export interface DerivedStat {
  key: string // "ac", "initiative", "speed", "sanity", "defense"
  label: string
  value: number | string
  formula?: string // human-readable formula note: "10 + DEX mod + armor"
  isComputed: boolean // if true, recompute from stats on change
}

// Universal action model — covers D&D actions, PbtA moves, CoC special abilities, etc.
export interface EntityAction {
  name: string
  category: string // "Action", "Bonus Action", "Reaction", "Legendary",
  // "Move", "Special", "Passive" — free-text
  description: string
  // Optional mechanical fields — all optional since systems vary wildly
  attackBonus?: number
  reach?: string
  targets?: string
  damage?: string
  damageType?: string
  saveStat?: string // key into StatBlock — "dexterity", "agility", "bod"
  saveDifficulty?: number // DC, difficulty number, target number
  onFailEffect?: string
  onSuccessEffect?: string
  recharge?: string // "Recharge 5–6", "Once per scene", "3/day"
  limitedUses?: number
  tags: string[]
}
