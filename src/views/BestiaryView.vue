<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhSkull } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useBestiaryStore } from '@/stores/bestiary'
import { useEnemyStore } from '@/stores/enemies'
import { useSessionStore } from '@/stores/session'
import { useSessionMode } from '@/composables/useSessionMode'
import { createDefaultBestiaryEntry } from '@/utils/defaults'
import { cloneBestiaryEntryToEnemy } from '@/utils/bestiary'
import { ensureActiveEncounter, resortInitiative, buildEnemyInitiativeEntry } from '@/utils/combat'
import { sampleBestiaryEntries } from '@/data/sample-bestiary'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import BestiaryCard from '@/components/creatures/BestiaryCard.vue'
import BestiaryDetail from '@/components/creatures/BestiaryDetail.vue'

const campaignStore = useCampaignStore()
const bestiaryStore = useBestiaryStore()
const enemyStore = useEnemyStore()
const sessionStore = useSessionStore()
const { isPlaying, activeSessionId } = useSessionMode()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

const entries = computed(() => Object.values(bestiaryStore.items).sort((a, b) => a.name.localeCompare(b.name)))
const selectedId = ref<string | null>(null)
const selected = computed(() => (selectedId.value ? bestiaryStore.getById(selectedId.value) : undefined))

function addEntry() {
  const entry = bestiaryStore.add(createDefaultBestiaryEntry({ name: 'New Creature' }))
  selectedId.value = entry.id
}

function removeEntry(id: string) {
  if (window.confirm('Remove this bestiary entry? This cannot be undone.')) {
    bestiaryStore.remove(id)
    if (selectedId.value === id) selectedId.value = null
  }
}

function loadSamples() {
  for (const sample of sampleBestiaryEntries) bestiaryStore.add(sample)
}

// "Quick-add to active encounter" — only meaningful mid-session; silently
// no-ops otherwise rather than surfacing an error for a DM just browsing.
const canQuickAdd = computed(() => isPlaying.value && !!activeSessionId.value)

function quickAddToEncounter() {
  if (!selected.value || !activeSessionId.value) return
  const session = sessionStore.getById(activeSessionId.value)
  if (!session) return
  const enemy = enemyStore.add(cloneBestiaryEntryToEnemy(selected.value))
  const encounter = ensureActiveEncounter(session)
  encounter.initiativeOrder.push(buildEnemyInitiativeEntry(enemy))
  resortInitiative(encounter)
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhSkull :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start building your bestiary.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Bestiary">
      <template #actions>
        <Button label="Load Sample Monsters" class="!bg-transparent !text-ink hover:!text-gold" @click="loadSamples" />
        <Button label="Create Monster" @click="addEntry" />
      </template>
    </PageHeader>
    <div class="flex flex-1 overflow-hidden">
      <div class="h-full w-72 shrink-0 overflow-y-auto border-r border-border">
        <div v-if="entries.length === 0" class="flex flex-col items-center gap-3 px-4 py-16 text-center">
          <PhSkull :size="32" class="text-ink" />
          <p class="text-sm text-ink">Your bestiary is empty. Import SRD monsters or create your own.</p>
        </div>
        <BestiaryCard
          v-for="entry in entries"
          :key="entry.id"
          :entry="entry"
          :is-selected="entry.id === selectedId"
          @select="selectedId = entry.id"
        />
      </div>
      <div class="flex-1 overflow-y-auto">
        <BestiaryDetail
          v-if="selected"
          :entry="selected"
          :can-quick-add="canQuickAdd"
          @remove="removeEntry(selected.id)"
          @quick-add="quickAddToEncounter"
        />
        <p v-else class="p-6 text-sm text-ink">Select a creature to view details.</p>
      </div>
    </div>
  </div>
</template>
