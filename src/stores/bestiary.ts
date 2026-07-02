import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { BestiaryEntry } from '@/types'

export const useBestiaryStore = defineStore('bestiary', () => {
  return createEntityStore<BestiaryEntry>('ioun:bestiary')
  // TODO(feature-phase): CR/XP calculator, encounter builder, SRD import
})
