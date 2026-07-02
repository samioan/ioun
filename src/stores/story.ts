import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { CampaignArc } from '@/types'

export const useStoryStore = defineStore('story', () => {
  return createEntityStore<CampaignArc>('ioun:arcs')
  // TODO(feature-phase): foreshadowing/callback graph helpers
})
