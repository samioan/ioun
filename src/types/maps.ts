// Interactive World Map
export interface WorldMap {
  id: string
  name: string
  imageUrl: string // URL only — same convention as Campaign.coverImageUrl / Handout images
  pins: MapPin[]
  notes: string
}

export interface MapPin {
  id: string
  label: string
  landmarkId?: string // optional tie to a real Landmark; pins can be freestanding
  x: number // 0-100, percentage of image width
  y: number // 0-100, percentage of image height
  isRevealed: boolean
  notes: string
}
