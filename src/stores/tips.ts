import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { usePersistence } from '@/composables/usePersistence'

// One-time dismissable section banners (Principle 4/5: "a single dismissable
// inline tip appears ... once and never again"). Flat key -> dismissed flag,
// not an entity store — persisted forever, unlike ui.ts which resets on reload.
export const useTipsStore = defineStore('tips', () => {
  const dismissed = reactive<Record<string, boolean>>({})
  usePersistence('ioun:dismissedTips', dismissed)

  function isDismissed(key: string): boolean {
    return !!dismissed[key]
  }

  function dismiss(key: string) {
    dismissed[key] = true
  }

  function $reset() {
    for (const key of Object.keys(dismissed)) delete dismissed[key]
  }

  return { dismissed, isDismissed, dismiss, $reset }
})
