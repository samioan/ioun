import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { CampaignTopic } from '@/types'

export const useTopicsStore = defineStore('topics', () => {
  return createEntityStore<CampaignTopic>('ioun:topics')
  // TODO(feature-phase): promise tracker extraction from conversation logs
})
