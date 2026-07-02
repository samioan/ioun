import { reactive } from 'vue'
import { usePersistence } from '@/composables/usePersistence'
import { newId } from '@/utils/id'

interface Identifiable {
  id: string
}

// Shared CRUD + persistence behavior for the ~20 domain stores. Each store
// wraps this in its own defineStore() so it gets its own name/id (and is a
// natural home for feature-specific logic added later, e.g. rest handling,
// XP totals, encounter difficulty — none of that belongs here).
export function createEntityStore<T extends Identifiable>(persistKey: string) {
  const items = reactive<Record<string, T>>({})

  usePersistence(persistKey, items)

  function add(entity: Omit<T, 'id'> & { id?: string }): T {
    const id = entity.id ?? newId()
    const record = { ...entity, id } as T
    items[id] = record
    return record
  }

  function update(id: string, patch: Partial<T>) {
    const existing = items[id]
    if (existing) Object.assign(existing, patch)
  }

  function remove(id: string) {
    delete items[id]
  }

  function getById(id: string): T | undefined {
    return items[id]
  }

  function $reset() {
    for (const key of Object.keys(items)) delete items[key]
  }

  return { items, add, update, remove, getById, $reset }
}
