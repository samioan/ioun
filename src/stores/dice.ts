import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { DiceRoll } from '@/types'

export const useDiceStore = defineStore('dice', () => {
  return createEntityStore<DiceRoll>('ioun:diceHistory')
  // TODO(feature-phase): dice notation parser, roll statistics
})
