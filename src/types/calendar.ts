// Custom Calendar
export interface CalendarSystem {
  name: string
  monthsPerYear: number
  months: CalendarMonth[]
  daysPerWeek: number
  weekDayNames: string[]
  hoursPerDay: number
  notes: string
}

export interface CalendarMonth {
  name: string
  days: number
  description?: string
  holidays?: CalendarEvent[]
}

export interface WorldDate {
  year: number
  month: number
  day: number
  hour?: number
  note?: string
}

export interface CalendarEvent {
  id: string
  name: string
  worldDate: WorldDate
  type: 'holiday' | 'historical' | 'session' | 'planned' | 'deadline' | 'custom'
  description: string
  isRecurring: boolean
  linkedEntityIds: string[]
  isSecret: boolean
}
