import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { LootItem } from '@/types'

export const useLootStore = defineStore('loot', () => {
  return createEntityStore<LootItem>('ioun:loot')
  // TODO(feature-phase): party wealth summary, encumbrance tracker, bulk award
})
