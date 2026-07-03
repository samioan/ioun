import type { ActiveCondition, DerivedStat } from './system'
import type { WorldDate } from './calendar'

// Session
export interface Session {
  id: string
  number: number
  date: string
  title: string
  summary: string
  recap: string // player-facing summary for next session
  attendingPlayerIds: string[]
  absentPlayerIds: string[]
  events: SessionEvent[]
  diceRolls: DiceRoll[]
  combatEncounters: CombatEncounter[]
  lootAwarded: string[]
  xpAwarded: number
  notes: string
  duration?: number
  startingWorldDate?: WorldDate
  endingWorldDate?: WorldDate
  openedHooks: string[] // topic IDs introduced
  closedHooks: string[] // topic IDs resolved
  playerMoments: PlayerMoment[]
  dmNotes: string // private prep notes
  nextSessionPrep: string // what to have ready
  musicPlaylist?: string // Spotify/YouTube link
  cliffhanger?: string
}

export interface PlayerMoment {
  playerId: string
  description: string
  type: 'heroic' | 'funny' | 'dramatic' | 'character' | 'clutch'
}

export interface SessionEvent {
  id: string
  timestamp: string
  type:
    | 'story'
    | 'combat'
    | 'discovery'
    | 'decision'
    | 'death'
    | 'levelup'
    | 'loot'
    | 'npc_interaction'
    | 'travel'
    | 'rest'
    | 'custom'
  title: string
  description: string
  linkedEntityIds: string[]
  importance: 'minor' | 'major' | 'pivotal'
  worldDate?: WorldDate
}

// Combat
export interface CombatEncounter {
  id: string
  sessionId: string
  name: string
  status: 'pending' | 'active' | 'completed'
  round: number
  currentTurnIndex: number
  initiativeOrder: InitiativeEntry[]
  enemyIds: string[]
  locationId?: string
  terrain: string
  notes: string
  conditions: string
  rewards: { xp: number; lootIds: string[] }
}

export interface InitiativeEntry {
  entityId: string
  entityType: 'player' | 'npc' | 'enemy'
  initiative: number
  tiebreaker?: number
  hasActed: boolean
  conditions: ActiveCondition[]
  // Freetext concentration/ongoing effect note — not 5e-specific
  ongoingEffect?: string
  healthCurrent: number
  healthMax: number
  healthTemp: number
  // derivedStats snapshot for quick reference (AC/Defense/Evasion — whatever applies)
  derivedStats: DerivedStat[]
  isHidden: boolean
  // Generic "extra action pool" (legendary actions, reactions, bonus actions)
  // Stored as key-value: "reaction" → used/total, "legendaryActions" → 0/3
  actionPools: Record<string, { used: number; max: number }>
  notes: string
}

// Dice
export interface DiceRoll {
  id: string
  sessionId?: string
  timestamp: string
  notation: string
  results: number[]
  modifier: number
  total: number
  purpose?: string
  rolledBy?: string
  isNatural20: boolean
  isNatural1: boolean
  isAdvantage: boolean
  isDisadvantage: boolean
  dropped?: number[] // dropped dice (adv/dis)
  isSecret: boolean // DM-only roll
  dcTarget?: number // if checking against a DC, record result
  succeeded?: boolean
  tableId?: string // set when this roll resolved a RandomTable
  tableEntryId?: string
}

// Player Recap (for session 0 and "last time on...")
export interface SessionRecap {
  sessionId: string
  playerFacingText: string // clean recap safe to share/read aloud
  dmPrivateNotes: string
  openQuestions: string[] // things players are wondering
  nextSessionTeaser: string
}
