import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { Handout } from '@/types'

export const useHandoutsStore = defineStore('handouts', () => {
  return createEntityStore<Handout>('ioun:handouts')
  // TODO(feature-phase): reveal-state tracking, print-friendly view
})
