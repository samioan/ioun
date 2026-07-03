import type { CalendarSystem, WorldDate } from '@/types'

// Formatting/comparison only — no calendar arithmetic. Real date-advance
// math belongs to the future useWorldDate composable (see spec's
// Implementation Notes); this just needs to display and sort dates.
export function formatWorldDate(date: WorldDate, calendar: CalendarSystem): string {
  const month = calendar.months[date.month - 1]
  const monthLabel = month?.name ?? `Month ${date.month}`
  return `${monthLabel} ${date.day}, Year ${date.year}`
}

export function compareWorldDate(a: WorldDate, b: WorldDate): number {
  if (a.year !== b.year) return a.year - b.year
  if (a.month !== b.month) return a.month - b.month
  if (a.day !== b.day) return a.day - b.day
  return (a.hour ?? 0) - (b.hour ?? 0)
}

function daysInMonth(calendar: CalendarSystem, month: number): number {
  return calendar.months[month - 1]?.days ?? 30
}

// Cascades hour -> day -> month/year using the campaign's own calendar
// shape (variable month lengths, days-per-week, hours-per-day) rather than
// assuming a real-world Gregorian calendar. Supports negative `amount`.
export function advanceWorldDate(
  date: WorldDate,
  calendar: CalendarSystem,
  amount: number,
  unit: 'hour' | 'day' | 'week' | 'month',
): WorldDate {
  const result: WorldDate = { ...date }

  if (unit === 'hour') {
    const hoursPerDay = calendar.hoursPerDay || 24
    const totalHours = (result.hour ?? 0) + amount
    const dayCarry = Math.floor(totalHours / hoursPerDay)
    result.hour = ((totalHours % hoursPerDay) + hoursPerDay) % hoursPerDay
    return advanceWorldDate(result, calendar, dayCarry, 'day')
  }

  if (unit === 'week') {
    return advanceWorldDate(result, calendar, amount * (calendar.daysPerWeek || 7), 'day')
  }

  if (unit === 'month') {
    const monthsPerYear = calendar.monthsPerYear || 12
    const totalMonths = result.month - 1 + amount
    result.year += Math.floor(totalMonths / monthsPerYear)
    result.month = (((totalMonths % monthsPerYear) + monthsPerYear) % monthsPerYear) + 1
    result.day = Math.min(result.day, daysInMonth(calendar, result.month))
    return result
  }

  // unit === 'day'
  let day = result.day + amount
  let month = result.month
  let year = result.year
  const monthsPerYear = calendar.monthsPerYear || 12

  while (day > daysInMonth(calendar, month)) {
    day -= daysInMonth(calendar, month)
    month += 1
    if (month > monthsPerYear) {
      month = 1
      year += 1
    }
  }
  while (day < 1) {
    month -= 1
    if (month < 1) {
      month = monthsPerYear
      year -= 1
    }
    day += daysInMonth(calendar, month)
  }

  result.day = day
  result.month = month
  result.year = year
  return result
}
