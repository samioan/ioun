<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhSpeakerHigh } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useAmbientStore } from '@/stores/ambient'
import { useSidePanel } from '@/composables/useSidePanel'
import { createDefaultAmbientCue } from '@/utils/defaults'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import AmbientCueCard from '@/components/ambient/AmbientCueCard.vue'
import AmbientCueDetail from '@/components/ambient/AmbientCueDetail.vue'
import type { AmbientCue } from '@/types'

const campaignStore = useCampaignStore()
const ambientStore = useAmbientStore()
const sidePanel = useSidePanel()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

const allCues = computed(() => Object.values(ambientStore.items))
const tags = computed(() => [...new Set(allCues.value.flatMap((c) => c.tags).filter(Boolean))].sort())
const activeTag = ref('all')

const filteredCues = computed(() =>
  activeTag.value === 'all' ? allCues.value : allCues.value.filter((c) => c.tags.includes(activeTag.value)),
)

function openDetail(cue: AmbientCue) {
  sidePanel.push({ title: cue.name || 'Untitled Cue', component: AmbientCueDetail, props: { cue } })
}

function addCue() {
  const cue = ambientStore.add(createDefaultAmbientCue({ name: 'New Cue' }))
  openDetail(cue)
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhSpeakerHigh :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start curating ambient cues.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Atmosphere">
      <template #actions>
        <Button label="Add Cue" @click="addCue" />
      </template>
    </PageHeader>

    <div v-if="allCues.length" class="flex flex-wrap items-center gap-2 border-b border-border px-6 py-3">
      <button
        type="button"
        class="tap-target rounded-full border px-3 py-1 text-xs"
        :class="activeTag === 'all' ? 'border-gold text-gold' : 'border-border text-ink hover:text-parchment'"
        @click="activeTag = 'all'"
      >
        All
      </button>
      <button
        v-for="tag in tags"
        :key="tag"
        type="button"
        class="tap-target rounded-full border px-3 py-1 text-xs"
        :class="activeTag === tag ? 'border-gold text-gold' : 'border-border text-ink hover:text-parchment'"
        @click="activeTag = tag"
      >
        {{ tag }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-4">
      <div v-if="allCues.length === 0" class="flex flex-col items-center gap-3 py-16 text-center">
        <PhSpeakerHigh :size="32" class="text-ink" />
        <p class="text-sm text-ink">No cues yet. Link the tracks and soundscapes that set your table's mood.</p>
      </div>
      <div v-else-if="filteredCues.length === 0" class="py-16 text-center text-sm text-ink">
        No cues match this tag.
      </div>
      <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AmbientCueCard v-for="cue in filteredCues" :key="cue.id" :cue="cue" @select="openDetail(cue)" />
      </div>
    </div>
  </div>
</template>
