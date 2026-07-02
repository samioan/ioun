// Loot / Item
// Item types and rarities are free-text strings — the system defines what these mean.
// A D&D DM uses "uncommon/rare/legendary"; a Shadowrun DM uses gear ratings;
// a Mothership DM uses "Standard/Salvage/Artifact". No closed unions.
export interface LootItem {
  id: string
  name: string
  type: string // "weapon", "armor", "cyberware", "stim", "artifact" — free-text
  rarity?: string // "uncommon", "Rating 6", "Tier 3" — free-text, optional
  description: string
  value: string // "50 gp", "¥12,000", "3 credits" — free-text
  weight?: number
  isIdentified: boolean
  isCursed?: boolean
  cursedEffect?: string
  // Attunement — only rendered if SystemDefinition.hasAttunement
  attunementRequired: boolean
  attunedToPlayerId?: string
  currentHolderId?: string
  acquiredSessionId?: string
  acquiredLandmarkId?: string
  acquiredFromNpcId?: string
  charges?: { current: number; max: number; recharge: string }
  properties?: string[] // free-text tags: "Finesse", "Silenced", "Biotech"
  // Custom fields — keys defined by SystemDefinition.customFields for 'item'
  customFields: Record<string, number | string | boolean>
  notes: string
}

export interface InventoryItem {
  lootItemId?: string
  name: string
  quantity: number
  weight?: number
  equipped: boolean
  notes: string
}
