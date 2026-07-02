// Sound / Atmosphere
export interface AmbientCue {
  id: string
  name: string
  url: string // Spotify, YouTube, Syrinscape link
  type: 'music' | 'ambience' | 'sfx'
  tags: string[] // "combat", "tavern", "dungeon", "boss", "tension"
  linkedLandmarkId?: string
  linkedEncounterId?: string
}
