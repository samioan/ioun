import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { Player } from '@/types'

export const usePlayerStore = defineStore('players', () => {
  return createEntityStore<Player>('ioun:players')
  // TODO(feature-phase): computed modifiers, rest handling, XP totals
})
