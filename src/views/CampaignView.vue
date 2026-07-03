<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhBookOpen } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useStoryStore } from '@/stores/story'
import { createDefaultArc } from '@/utils/defaults'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import ArcTimeline from '@/components/campaign/ArcTimeline.vue'
import BeatKanban from '@/components/campaign/BeatKanban.vue'

const campaignStore = useCampaignStore()
const storyStore = useStoryStore()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)
const viewMode = ref<'timeline' | 'kanban'>('timeline')

const arcs = computed(() => [...Object.values(storyStore.items)].sort((a, b) => a.order - b.order))

function beatLookup(id?: string): string | undefined {
  if (!id) return undefined
  for (const arc of Object.values(storyStore.items)) {
    const beat = arc.beats.find((b) => b.id === id)
    if (beat) return `${arc.name} — ${beat.title}`
  }
  return undefined
}

function addArc() {
  storyStore.add(createDefaultArc({ name: 'New Arc', order: arcs.value.length }))
}

function removeArc(id: string) {
  if (window.confirm('Remove this story arc and all its beats? This cannot be undone.')) {
    storyStore.remove(id)
  }
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhBookOpen :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start outlining your story.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Campaign Arc">
      <template #actions>
        <div class="flex rounded-md border border-border">
          <button
            type="button"
            class="tap-target rounded-l-md px-3 py-1.5 text-sm"
            :class="viewMode === 'timeline' ? 'bg-slate text-gold' : 'text-ink'"
            @click="viewMode = 'timeline'"
          >
            Timeline
          </button>
          <button
            type="button"
            class="tap-target rounded-r-md px-3 py-1.5 text-sm"
            :class="viewMode === 'kanban' ? 'bg-slate text-gold' : 'text-ink'"
            @click="viewMode = 'kanban'"
          >
            Kanban
          </button>
        </div>
        <Button label="Add Arc" @click="addArc" />
      </template>
    </PageHeader>

    <div class="flex-1 overflow-y-auto">
      <template v-if="viewMode === 'timeline'">
        <div v-if="arcs.length === 0" class="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <PhBookOpen :size="32" class="text-ink" />
          <p class="text-sm text-ink">No story arc yet. Outline your campaign's shape here.</p>
        </div>
        <div class="flex flex-col gap-4 p-4">
          <ArcTimeline v-for="arc in arcs" :key="arc.id" :arc="arc" :beat-lookup="beatLookup" @remove="removeArc(arc.id)" />
        </div>
      </template>
      <BeatKanban v-else />
    </div>
  </div>
</template>
