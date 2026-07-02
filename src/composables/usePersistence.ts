import { watchDebounced } from '@vueuse/core'

// Loads `state` from localStorage[key] once (mutating it in place so callers
// keep their existing reactive reference), then persists on every change,
// debounced 300ms so rapid mutations (e.g. HP changes during combat) don't
// cause write jank.
export function usePersistence<T extends object>(key: string, state: T): void {
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      Object.assign(state, JSON.parse(stored))
    } catch (err) {
      console.error(`[ioun] failed to load persisted state for "${key}"`, err)
    }
  }

  watchDebounced(
    state,
    (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { debounce: 300, deep: true },
  )
}
