import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { Landmark } from '@/types'

export const useWorldStore = defineStore('world', () => {
  return createEntityStore<Landmark>('ioun:landmarks')
  // TODO(feature-phase): shop helpers, landmark hierarchy traversal, travel-time calculator
})
