// Random Tables
export interface RandomTable {
  id: string
  name: string
  category: string // "Encounters", "Weather", "NPC Traits", "Loot", etc.
  description: string
  diceNotation: string // "1d20", "2d6"
  entries: RandomTableEntry[]
  tags: string[]
  isCustom: boolean
  source?: string
}

export interface RandomTableEntry {
  id: string
  minRoll: number
  maxRoll: number
  result: string
  subTable?: string // reference to another table ID
  notes?: string
}
