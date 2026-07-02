import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { Milestone } from '@/types'

export const useMilestonesStore = defineStore('milestones', () => {
  return createEntityStore<Milestone>('ioun:milestones')
})
