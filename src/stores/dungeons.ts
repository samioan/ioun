import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { Dungeon } from '@/types'

export const useDungeonStore = defineStore('dungeons', () => {
  return createEntityStore<Dungeon>('ioun:dungeons')
  // TODO(feature-phase): room graph layout, trap/connection editors
})
