import type { Campaign } from './campaign'
import type { Player } from './player'
import type { NPC, Faction, Landmark } from './world'
import type { Session } from './session'
import type { CampaignArc, Quest, CampaignTopic, Milestone } from './story'
import type { Enemy, BestiaryEntry } from './enemies'
import type { LootItem } from './loot'
import type { Dungeon } from './dungeons'
import type { CalendarEvent } from './calendar'
import type { RandomTable } from './tables'
import type { Handout } from './handouts'
import type { AmbientCue } from './ambient'
import type { RulesEntry } from './rules'
import type { DiceRoll } from './session'

export interface CampaignExport {
  version: string
  appName: 'ioun'
  exportedAt: string
  campaign: Campaign // includes campaign.systemDefinition
  players: Player[]
  npcs: NPC[]
  factions: Faction[]
  landmarks: Landmark[]
  sessions: Session[]
  arcs: CampaignArc[]
  enemies: Enemy[]
  customBestiary: BestiaryEntry[]
  loot: LootItem[]
  topics: CampaignTopic[]
  quests: Quest[]
  dungeons: Dungeon[]
  calendarEvents: CalendarEvent[]
  randomTables: RandomTable[]
  handouts: Handout[]
  ambientCues: AmbientCue[]
  customRules: RulesEntry[]
  milestones: Milestone[]
  diceHistory: DiceRoll[]
}
