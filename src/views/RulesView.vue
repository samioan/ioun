<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhBookOpen } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useRulesStore } from '@/stores/rules'
import { useSidePanel } from '@/composables/useSidePanel'
import { createDefaultRulesEntry } from '@/utils/defaults'
import { sampleRulesEntries } from '@/data/sample-rules'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import HouseRulesList from '@/components/rules/HouseRulesList.vue'
import SystemReference from '@/components/rules/SystemReference.vue'
import RulesCard from '@/components/rules/RulesCard.vue'
import RulesDetail from '@/components/rules/RulesDetail.vue'
import type { RulesEntry } from '@/types'

const campaignStore = useCampaignStore()
const rulesStore = useRulesStore()
const sidePanel = useSidePanel()

const hasCampaign = computed(() => !!campaignStore.getActive())
const campaign = computed(() => campaignStore.getActive())
const showWizard = ref(false)

const search = ref('')
const activeCategory = ref('all')

const allEntries = computed(() => Object.values(rulesStore.items))
const categories = computed(() => [...new Set(allEntries.value.map((e) => e.category).filter(Boolean))].sort())

const filteredEntries = computed(() => {
  const query = search.value.trim().toLowerCase()
  return allEntries.value
    .filter((e) => activeCategory.value === 'all' || e.category === activeCategory.value)
    .filter((e) => !query || e.title.toLowerCase().includes(query) || e.content.toLowerCase().includes(query))
    .sort((a, b) => Number(b.isFavorited) - Number(a.isFavorited) || a.title.localeCompare(b.title))
})

function openDetail(entry: RulesEntry) {
  sidePanel.push({ title: entry.title || 'Untitled Rule', component: RulesDetail, props: { entry } })
}

function addEntry() {
  const entry = rulesStore.add(createDefaultRulesEntry({ title: 'New Rule' }))
  openDetail(entry)
}

function loadSamples() {
  for (const sample of sampleRulesEntries) rulesStore.add(sample)
}

function toggleFavorite(entry: RulesEntry) {
  rulesStore.update(entry.id, { isFavorited: !entry.isFavorited })
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhBookOpen :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start building your rules reference.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Rules Reference">
      <template #actions>
        <Button label="Load Sample Rules" class="!bg-transparent !text-ink hover:!text-gold" @click="loadSamples" />
        <Button label="Add Rule" @click="addEntry" />
      </template>
    </PageHeader>

    <div class="flex-1 overflow-y-auto">
      <HouseRulesList v-if="campaign" :campaign="campaign" />
      <SystemReference />

      <div class="px-6 py-4">
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <input
            v-model="search"
            type="text"
            placeholder="Search rules…"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
          />
          <button
            type="button"
            class="tap-target rounded-full border px-3 py-1 text-xs"
            :class="activeCategory === 'all' ? 'border-gold text-gold' : 'border-border text-ink hover:text-parchment'"
            @click="activeCategory = 'all'"
          >
            All
          </button>
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="tap-target rounded-full border px-3 py-1 text-xs"
            :class="activeCategory === category ? 'border-gold text-gold' : 'border-border text-ink hover:text-parchment'"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <div v-if="allEntries.length === 0" class="flex flex-col items-center gap-3 py-16 text-center">
          <PhBookOpen :size="32" class="text-ink" />
          <p class="text-sm text-ink">No rules yet. Load the starter set or add your own.</p>
        </div>
        <div v-else-if="filteredEntries.length === 0" class="py-16 text-center text-sm text-ink">
          No rules match this search.
        </div>
        <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <RulesCard
            v-for="entry in filteredEntries"
            :key="entry.id"
            :entry="entry"
            @select="openDetail(entry)"
            @toggle-favorite="toggleFavorite(entry)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
