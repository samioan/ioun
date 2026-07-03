import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { WorldMap } from '@/types'

export const useMapsStore = defineStore('maps', () => {
  return createEntityStore<WorldMap>('ioun:maps')
})
