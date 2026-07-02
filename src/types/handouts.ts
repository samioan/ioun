// Handouts
export interface Handout {
  id: string
  name: string
  type: 'letter' | 'map' | 'journal' | 'poster' | 'riddle' | 'code' | 'prophecy' | 'image' | 'other'
  content: string // markdown or base64 image
  isRevealed: boolean // has been shown to players
  revealedSessionId?: string
  linkedEntityIds: string[]
  notes: string // DM context, not shown to players
}
