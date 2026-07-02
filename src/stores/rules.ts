import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { RulesEntry } from '@/types'

export const useRulesStore = defineStore('rules', () => {
  return createEntityStore<RulesEntry>('ioun:customRules')
  // TODO(feature-phase): favorites, search
})
