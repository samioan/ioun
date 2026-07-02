import type { StatBlock, SkillBlock, ActiveCondition, DerivedStat, EntityAction } from './system'
import type { PreparedEncounter } from './enemies'

// NPC
export interface NPC {
  id: string
  name: string
  aliases: string[]
  role: string
  occupation?: string
  factionId?: string
  locationId?: string
  disposition: 'friendly' | 'neutral' | 'hostile' | 'unknown'
  isAlive: boolean
  description: string
  appearance: string
  personality: string
  motivation: string
  secretInfo: string
  conversationLog: ConversationEntry[]
  relationshipMap: Record<string, string>
  portrait?: string
  voice?: string
  tags: string[]
  stats?: NPCStatBlock
  isRecurring: boolean
  firstAppearedSessionId?: string
  importanceLevel: 'minor' | 'supporting' | 'major' | 'key'
  customFields: Record<string, number | string | boolean>
}

export interface NPCStatBlock {
  // System-agnostic: all stats are freeform key-value
  stats: StatBlock
  skills?: SkillBlock
  derivedStats: DerivedStat[]
  conditions: ActiveCondition[]
  health: { current: number; max: number }
  threatRating?: string // CR, Threat Level, etc. — label from SystemDefinition
  speed?: string
  resistances: string[]
  immunities: string[]
  senses: string
  languages: string[]
  actions: EntityAction[]
  customFields: Record<string, number | string | boolean>
}

export interface ConversationEntry {
  id: string
  sessionId: string
  timestamp: string
  summary: string
  fullText?: string
  participants: string[]
  importance: 'low' | 'medium' | 'high' | 'critical'
  playerPromisedSomething?: string
  npcPromisedSomething?: string
  openThreads?: string[] // unanswered questions or loose ends
}

// Faction / Allegiance
export interface Faction {
  id: string
  name: string
  type: string
  alignment: string
  description: string
  goals: string
  methods: string
  secrets: string
  memberIds: string[]
  leaderIds: string[]
  alliedFactionIds: string[]
  enemyFactionIds: string[]
  playerRelationship: Record<string, 'allied' | 'friendly' | 'neutral' | 'hostile' | 'enemy'>
  reputationScore: Record<string, number> // playerId → -100 to +100
  notoriety: number
  resources: string
  headquartersId?: string
  symbol?: string
  notes: string
  isSecret: boolean
}

// World / Landmark
export interface Landmark {
  id: string
  name: string
  type:
    | 'city'
    | 'town'
    | 'village'
    | 'dungeon'
    | 'wilderness'
    | 'building'
    | 'region'
    | 'plane'
    | 'sea'
    | 'road'
    | 'ruin'
    | 'other'
  parentId?: string
  description: string
  atmosphere: string
  secretInfo: string
  npcIds: string[]
  lootIds: string[]
  factionIds: string[]
  hasBeenVisited: boolean
  isKnownToPlayers: boolean
  tags: string[]
  mapNotes: string
  coordinates?: { x: number; y: number }
  travelTime?: Record<string, string> // landmarkId → "3 days on foot"
  encounters?: PreparedEncounter[]
  shops?: Shop[]
  rumors?: string[]
  questHooks?: string[]
  weather?: string
  population?: string
  government?: string
}

export interface Shop {
  id: string
  name: string
  ownerNpcId?: string
  type: string
  inventory: ShopItem[]
  notes: string
}

export interface ShopItem {
  name: string
  price: string
  quantity: number | 'unlimited'
  notes?: string
}
