import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { Session } from '@/types'

export const useSessionStore = defineStore('session', () => {
  return createEntityStore<Session>('ioun:sessions')
  // TODO(feature-phase): initiative tracker, live event log, recap generation
})
