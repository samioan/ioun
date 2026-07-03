<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhFlag } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useFactionStore } from '@/stores/factions'
import { createDefaultFaction } from '@/utils/defaults'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import FactionCard from '@/components/world/FactionCard.vue'
import FactionDetail from '@/components/world/FactionDetail.vue'

const campaignStore = useCampaignStore()
const factionStore = useFactionStore()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

const factions = computed(() => Object.values(factionStore.items).sort((a, b) => a.name.localeCompare(b.name)))
const selectedId = ref<string | null>(null)
const selected = computed(() => (selectedId.value ? factionStore.getById(selectedId.value) : undefined))

function addFaction() {
  const faction = factionStore.add(createDefaultFaction({ name: 'New Faction' }))
  selectedId.value = faction.id
}

function removeFaction(id: string) {
  if (window.confirm('Remove this faction? This cannot be undone.')) {
    factionStore.remove(id)
    if (selectedId.value === id) selectedId.value = null
  }
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhFlag :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start tracking factions.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Factions">
      <template #actions>
        <Button label="Add Faction" @click="addFaction" />
      </template>
    </PageHeader>
    <div class="flex flex-1 overflow-hidden">
      <div class="h-full w-72 shrink-0 overflow-y-auto border-r border-border">
        <div v-if="factions.length === 0" class="flex flex-col items-center gap-3 px-4 py-16 text-center">
          <PhFlag :size="32" class="text-ink" />
          <p class="text-sm text-ink">No factions yet. Add the groups your party will cross.</p>
        </div>
        <FactionCard
          v-for="faction in factions"
          :key="faction.id"
          :faction="faction"
          :is-selected="faction.id === selectedId"
          @select="selectedId = faction.id"
        />
      </div>
      <div class="flex-1 overflow-y-auto">
        <FactionDetail v-if="selected" :faction="selected" @remove="removeFaction(selected.id)" />
        <p v-else class="p-6 text-sm text-ink">Select a faction to view details.</p>
      </div>
    </div>
  </div>
</template>
