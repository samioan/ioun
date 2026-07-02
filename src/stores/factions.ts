import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { Faction } from '@/types'

export const useFactionStore = defineStore('factions', () => {
  return createEntityStore<Faction>('ioun:factions')
  // TODO(feature-phase): reputation tracking helpers
})
