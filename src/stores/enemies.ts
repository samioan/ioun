import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { Enemy } from '@/types'

export const useEnemyStore = defineStore('enemies', () => {
  return createEntityStore<Enemy>('ioun:enemies')
  // TODO(feature-phase): encounter tracking helpers
})
