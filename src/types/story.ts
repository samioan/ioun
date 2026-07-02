import type { WorldDate } from './calendar'

// Story / Campaign Arc
export interface StoryBeat {
  id: string
  arcId: string
  order: number
  title: string
  description: string
  status: 'upcoming' | 'active' | 'completed' | 'abandoned' | 'skipped'
  type: 'main' | 'side' | 'character' | 'world' | 'interlude'
  linkedSessionIds: string[]
  linkedEntityIds: string[]
  secrets: string
  foreshadowing: string
  callbackTo?: string // beatId this pays off
  foreshadowedIn?: string[] // beatIds where this was seeded
  playerChoiceMade?: string
  alternateOutcomes?: string[]
}

export interface CampaignArc {
  id: string
  name: string
  order: number
  summary: string
  theme: string
  status: 'upcoming' | 'active' | 'completed'
  beats: StoryBeat[]
  openingHook: string
  climax: string
  resolution: string
  antagonistId?: string
}

// Milestone / Progression
export interface Milestone {
  id: string
  title: string
  description: string
  xpValue?: number // for XP mode
  isReached: boolean
  reachedSessionId?: string
  linkedStoryBeatId?: string
  awardedToAllPlayers: boolean
  notes: string
}

// Important Topics / Hooks
export interface CampaignTopic {
  id: string
  title: string
  category:
    | 'prophecy'
    | 'mystery'
    | 'rumor'
    | 'quest'
    | 'secret'
    | 'lore'
    | 'hook'
    | 'threat'
    | 'promise'
    | 'bounty'
    | 'contract'
  description: string
  dmNotes: string
  status: 'open' | 'resolved' | 'red-herring' | 'ongoing' | 'dormant'
  linkedEntityIds: string[]
  revealedToPlayers: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  introducedSessionId?: string
  resolvedSessionId?: string
  deadline?: WorldDate
  reward?: string
  consequences?: string // what happens if ignored
}

// Quest
export interface Quest {
  id: string
  title: string
  giverNpcId?: string // who gave the quest
  giverFactionId?: string
  type: 'main' | 'side' | 'personal' | 'faction' | 'bounty' | 'exploration' | 'custom'
  status: 'available' | 'active' | 'completed' | 'failed' | 'abandoned'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  description: string // what the players know
  dmNotes: string // background, truth, alternate outcomes
  objectives: QuestObjective[]
  rewards: QuestReward[]
  consequences: string // what happens if failed/ignored
  deadline?: WorldDate
  linkedLandmarkIds: string[]
  linkedNpcIds: string[]
  linkedStoryBeatId?: string
  linkedTopicIds: string[]
  acceptedSessionId?: string
  completedSessionId?: string
  isSecret: boolean // hidden from players until discovered
  location?: string // brief description of where to go
  followUpQuestId?: string // quest this unlocks on completion
  notes: string
}

export interface QuestObjective {
  id: string
  description: string
  isComplete: boolean
  isOptional: boolean
  isSecret: boolean // DM-only until revealed
  linkedEntityIds: string[]
  completedSessionId?: string
}

export interface QuestReward {
  type: 'gold' | 'item' | 'xp' | 'reputation' | 'information' | 'favor' | 'custom'
  description: string
  value?: string // "500 gp", "250 XP", "+20 rep with Merchants Guild"
  lootItemId?: string
  isAwarded: boolean
}
