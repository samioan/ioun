import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { NPC } from '@/types'

export const useNPCStore = defineStore('npcs', () => {
  return createEntityStore<NPC>('ioun:npcs')
  // TODO(feature-phase): conversation log helpers, relationship graph
})
