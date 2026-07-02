import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { Quest } from '@/types'

export const useQuestsStore = defineStore('quests', () => {
  return createEntityStore<Quest>('ioun:quests')
  // TODO(feature-phase): objective tracker, reward distribution, follow-up chains
})
