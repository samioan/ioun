<script setup lang="ts">
import Button from 'primevue/button'
import { useCampaignStore } from '@/stores/campaign'
import type { Campaign } from '@/types'

const props = defineProps<{ campaign: Campaign }>()

const campaignStore = useCampaignStore()

function deleteCampaign() {
  if (
    !window.confirm(
      `Delete "${props.campaign.name || 'this campaign'}"? This removes the campaign record itself. Players, NPCs, and other data are not campaign-scoped yet and will remain.`,
    )
  ) {
    return
  }
  campaignStore.remove(props.campaign.id)
  campaignStore.setActive(null)
}

// The one operation that's actually clean and correct given that no store
// is campaign-scoped: there's no way to wipe "just one campaign's data",
// so this wipes everything, honestly, rather than pretending to be scoped.
function clearAllData() {
  if (!window.confirm('Clear ALL local data for every campaign? This cannot be undone.')) return
  if (!window.confirm('Really clear everything? This is your last chance to cancel.')) return
  localStorage.clear()
  window.location.reload()
}
</script>

<template>
  <section class="border-b border-border px-6 py-4">
    <p class="mb-1 font-display text-lg text-crimson">Danger Zone</p>
    <div class="flex flex-wrap items-center gap-3">
      <Button label="Delete this Campaign" class="!bg-transparent !text-crimson hover:!text-crimson" @click="deleteCampaign" />
      <Button label="Clear ALL Local Data" class="!bg-crimson hover:!bg-crimson" @click="clearAllData" />
    </div>
  </section>
</template>
