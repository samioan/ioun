import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { CalendarEvent } from '@/types'

export const useCalendarStore = defineStore('calendar', () => {
  return createEntityStore<CalendarEvent>('ioun:calendarEvents')
  // TODO(feature-phase): calendar arithmetic across custom calendar systems (useWorldDate)
})
