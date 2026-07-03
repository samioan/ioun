<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhScroll } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useHandoutsStore } from '@/stores/handouts'
import { useSidePanel } from '@/composables/useSidePanel'
import { createDefaultHandout } from '@/utils/defaults'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import HandoutCard from '@/components/handouts/HandoutCard.vue'
import HandoutDetail from '@/components/handouts/HandoutDetail.vue'
import type { Handout } from '@/types'

const campaignStore = useCampaignStore()
const handoutsStore = useHandoutsStore()
const sidePanel = useSidePanel()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

const TYPES: Handout['type'][] = ['letter', 'map', 'journal', 'poster', 'riddle', 'code', 'prophecy', 'image', 'other']
const activeType = ref<Handout['type'] | 'all'>('all')

const allHandouts = computed(() => Object.values(handoutsStore.items))
const filteredHandouts = computed(() =>
  activeType.value === 'all' ? allHandouts.value : allHandouts.value.filter((h) => h.type === activeType.value),
)

function openDetail(handout: Handout) {
  sidePanel.push({ title: handout.name || 'Untitled Handout', component: HandoutDetail, props: { handout } })
}

function addHandout() {
  const handout = handoutsStore.add(createDefaultHandout({ name: 'New Handout' }))
  openDetail(handout)
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhScroll :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start building player-facing handouts.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Handouts">
      <template #actions>
        <Button label="Add Handout" @click="addHandout" />
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-2 border-b border-border px-6 py-3">
      <button
        type="button"
        class="tap-target rounded-full border px-3 py-1 text-xs"
        :class="activeType === 'all' ? 'border-gold text-gold' : 'border-border text-ink hover:text-parchment'"
        @click="activeType = 'all'"
      >
        All
      </button>
      <button
        v-for="type in TYPES"
        :key="type"
        type="button"
        class="tap-target rounded-full border px-3 py-1 text-xs"
        :class="activeType === type ? 'border-gold text-gold' : 'border-border text-ink hover:text-parchment'"
        @click="activeType = type"
      >
        {{ type }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-4">
      <div v-if="allHandouts.length === 0" class="flex flex-col items-center gap-3 py-16 text-center">
        <PhScroll :size="32" class="text-ink" />
        <p class="text-sm text-ink">No handouts yet. Prep the first letter, map, or clue for your players.</p>
      </div>
      <div v-else-if="filteredHandouts.length === 0" class="py-16 text-center text-sm text-ink">
        No handouts match this filter.
      </div>
      <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <HandoutCard
          v-for="handout in filteredHandouts"
          :key="handout.id"
          :handout="handout"
          @select="openDetail(handout)"
        />
      </div>
    </div>
  </div>
</template>
