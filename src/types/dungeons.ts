import type { PreparedEncounter } from './enemies'

// Dungeon
export interface Dungeon {
  id: string
  name: string
  type: 'dungeon' | 'cave' | 'ruins' | 'fortress' | 'tower' | 'sewer' | 'tomb' | 'planar' | 'custom'
  linkedLandmarkId?: string // tie to a World landmark
  description: string
  atmosphere: string // sensory details: smells, sounds, lighting
  history: string // lore and backstory
  secretInfo: string // DM-only notes
  rooms: DungeonRoom[]
  connections: DungeonConnection[]
  traps: DungeonTrap[]
  factionId?: string // who controls this dungeon
  tags: string[]
  isCompleted: boolean // party has cleared it
  notes: string
}

export interface DungeonRoom {
  id: string
  dungeonId: string
  name: string
  number: number // Room 1, Room 2 — for quick reference
  type:
    | 'entrance'
    | 'corridor'
    | 'chamber'
    | 'boss'
    | 'trap'
    | 'puzzle'
    | 'rest'
    | 'secret'
    | 'exit'
    | 'custom'
  description: string // what players see on entry
  dmNotes: string // hidden details, GM context
  secretInfo: string // secret doors, hidden compartments
  dimensions?: string // "20ft × 30ft"
  lighting: 'bright' | 'dim' | 'dark' | 'magical'
  encounters: PreparedEncounter[]
  lootIds: string[]
  trapIds: string[]
  puzzleDescription?: string
  npcIds: string[]
  isExplored: boolean // party has been here
  isSecret: boolean // hidden until discovered
  x?: number // position on visual graph (for layout)
  y?: number
  notes: string
}

export interface DungeonConnection {
  id: string
  fromRoomId: string
  toRoomId: string
  type:
    | 'door'
    | 'secret-door'
    | 'corridor'
    | 'stairs-up'
    | 'stairs-down'
    | 'ladder'
    | 'portal'
    | 'pit'
    | 'open'
  description?: string // "Heavy oak door, locked (DC 15)"
  isLocked: boolean
  lockDC?: number
  isSecret: boolean
  isDiscovered: boolean
  notes: string
}

export interface DungeonTrap {
  id: string
  name: string
  roomId: string
  type: string // "Pit trap", "Poison dart", "Magic glyph"
  description: string
  triggerDescription: string
  effect: string
  saveDC?: number
  saveStat?: string // key into SystemDefinition.stats — "dexterity", "agility"
  attackBonus?: number
  damage?: string
  detectDC?: number // Perception DC to spot
  disableDC?: number // Thieves' Tools DC to disarm
  isTriggered: boolean
  isDisarmed: boolean
  notes: string
}
