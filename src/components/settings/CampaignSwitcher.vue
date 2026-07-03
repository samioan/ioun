<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhTrash } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'

const campaignStore = useCampaignStore()
const showWizard = ref(false)

const campaigns = computed(() => Object.values(campaignStore.items).sort((a, b) => a.name.localeCompare(b.name)))
const activeId = computed(() => campaignStore.activeCampaignId)

function switchTo(id: string) {
  campaignStore.setActive(id)
}

function removeCampaign(id: string) {
  if (
    !window.confirm(
      'Delete this campaign? This removes the campaign record itself. Players, NPCs, and other data are not campaign-scoped yet and will remain.',
    )
  ) {
    return
  }
  campaignStore.remove(id)
  if (activeId.value === id) campaignStore.setActive(null)
}
</script>

<template>
  <section class="border-b border-border px-6 py-4">
    <div class="mb-2 flex items-center justify-between">
      <p class="font-display text-lg text-gold">Campaigns</p>
      <Button label="New Campaign" class="!bg-transparent !text-ink hover:!text-gold" @click="showWizard = true" />
    </div>
    <p class="mb-3 text-xs text-ink">
      Switching changes which campaign's name, system, calendar, and house rules are active. Players, NPCs, Quests,
      and everything else are shared across all campaigns for now — they aren't scoped per campaign yet.
    </p>
    <p v-if="campaigns.length === 0" class="text-sm text-ink">No campaigns yet.</p>
    <div v-else class="flex flex-col gap-2">
      <div
        v-for="campaign in campaigns"
        :key="campaign.id"
        class="flex items-center justify-between gap-2 rounded-md border border-border bg-slate p-3"
      >
        <div>
          <p class="text-sm text-parchment">{{ campaign.name || 'Unnamed Campaign' }}</p>
          <p class="text-xs text-ink">{{ campaign.systemDefinition.name }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span
            v-if="campaign.id === activeId"
            class="rounded-full border border-gold-dim px-2 py-0.5 text-xs text-gold"
          >
            Active
          </span>
          <Button
            v-else
            label="Switch"
            class="!bg-transparent !text-ink hover:!text-gold"
            @click="switchTo(campaign.id)"
          />
          <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeCampaign(campaign.id)">
            <PhTrash :size="16" />
          </button>
        </div>
      </div>
    </div>

    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </section>
</template>
