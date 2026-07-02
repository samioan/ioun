import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { RandomTable } from '@/types'

export const useTablesStore = defineStore('tables', () => {
  return createEntityStore<RandomTable>('ioun:randomTables')
  // TODO(feature-phase): roll resolution, chained sub-tables, favorites
})
