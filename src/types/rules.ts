// House Rules
export interface HouseRule {
  id: string
  title: string
  category: string
  description: string
  source?: string // "Homebrew" | "UA" | "Critical Role variant"
  isActive: boolean
}

// Quick Reference
export interface RulesEntry {
  id: string
  title: string
  category: string
  system: string
  content: string // markdown
  tags: string[]
  isCustom: boolean
  source?: string
  isFavorited: boolean
}
