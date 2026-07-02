import type { SystemDefinition } from './system'
import type { CalendarSystem, WorldDate } from './calendar'
import type { HouseRule } from './rules'

// Campaign (root)
export interface Campaign {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  description: string
  coverImageUrl?: string
  systemDefinition: SystemDefinition // the full system schema for this campaign
  calendarSystem: CalendarSystem
  currentWorldDate: WorldDate
  houseRules: HouseRule[]
  tags: string[]
}
