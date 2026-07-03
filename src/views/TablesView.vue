<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhDiceFive } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useTablesStore } from '@/stores/tables'
import { useSidePanel } from '@/composables/useSidePanel'
import { createDefaultRandomTable } from '@/utils/defaults'
import { sampleRandomTables } from '@/data/sample-tables'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import TableCard from '@/components/tables/TableCard.vue'
import TableDetail from '@/components/tables/TableDetail.vue'
import type { RandomTable } from '@/types'

const campaignStore = useCampaignStore()
const tablesStore = useTablesStore()
const sidePanel = useSidePanel()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

const allTables = computed(() => Object.values(tablesStore.items))
const categories = computed(() => [...new Set(allTables.value.map((t) => t.category).filter(Boolean))].sort())
const activeCategory = ref('all')

const filteredTables = computed(() =>
  activeCategory.value === 'all' ? allTables.value : allTables.value.filter((t) => t.category === activeCategory.value),
)

function openDetail(table: RandomTable) {
  sidePanel.push({ title: table.name || 'Untitled Table', component: TableDetail, props: { table } })
}

function addTable() {
  const table = tablesStore.add(createDefaultRandomTable({ name: 'New Table' }))
  openDetail(table)
}

function loadSamples() {
  for (const sample of sampleRandomTables) tablesStore.add(sample)
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhDiceFive :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start building random tables.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Random Tables">
      <template #actions>
        <Button label="Load Sample Tables" class="!bg-transparent !text-ink hover:!text-gold" @click="loadSamples" />
        <Button label="Add Table" @click="addTable" />
      </template>
    </PageHeader>

    <div v-if="allTables.length" class="flex flex-wrap items-center gap-2 border-b border-border px-6 py-3">
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

    <div class="flex-1 overflow-y-auto px-6 py-4">
      <div v-if="allTables.length === 0" class="flex flex-col items-center gap-3 py-16 text-center">
        <PhDiceFive :size="32" class="text-ink" />
        <p class="text-sm text-ink">No tables yet. Load the starter set or build your own.</p>
      </div>
      <div v-else-if="filteredTables.length === 0" class="py-16 text-center text-sm text-ink">
        No tables match this filter.
      </div>
      <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <TableCard v-for="table in filteredTables" :key="table.id" :table="table" @select="openDetail(table)" />
      </div>
    </div>
  </div>
</template>
