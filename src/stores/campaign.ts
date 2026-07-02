import { defineStore } from 'pinia'
import { reactive, toRef } from 'vue'
import { createEntityStore } from './createEntityStore'
import { usePersistence } from '@/composables/usePersistence'
import type { Campaign } from '@/types'

export const useCampaignStore = defineStore('campaign', () => {
  const entityStore = createEntityStore<Campaign>('ioun:campaigns')

  // Multiple campaigns can be stored independently; this tracks which one
  // is currently open (Settings → Campaign switching).
  const meta = reactive<{ activeCampaignId: string | null }>({ activeCampaignId: null })
  usePersistence('ioun:activeCampaignId', meta)

  function setActive(id: string | null) {
    meta.activeCampaignId = id
  }

  function getActive(): Campaign | undefined {
    return meta.activeCampaignId ? entityStore.getById(meta.activeCampaignId) : undefined
  }

  // TODO(feature-phase): onboarding wizard, import/export wiring, house-rule helpers

  return { ...entityStore, activeCampaignId: toRef(meta, 'activeCampaignId'), setActive, getActive }
})
