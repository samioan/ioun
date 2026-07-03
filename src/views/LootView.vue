<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Button from 'primevue/button'
import { PhCoins } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useLootStore } from '@/stores/loot'
import { usePlayerStore } from '@/stores/players'
import { useSystemDefinition } from '@/composables/useSystemDefinition'
import { useSidePanel } from '@/composables/useSidePanel'
import { createDefaultLootItem } from '@/utils/defaults'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import LootTable from '@/components/loot/LootTable.vue'
import LootItemDetail from '@/components/loot/LootItemDetail.vue'
import BulkAwardDialog from '@/components/loot/BulkAwardDialog.vue'
import type { LootItem } from '@/types'

const campaignStore = useCampaignStore()
const lootStore = useLootStore()
const playerStore = usePlayerStore()
const { system } = useSystemDefinition()
const sidePanel = useSidePanel()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

const filters = reactive({ holder: '', rarity: '', type: '', identified: '', attuned: '' })
const groupByHolder = ref(false)
const selectedIds = ref<string[]>([])
const showBulkAward = ref(false)

const allItems = computed(() => Object.values(lootStore.items))
const players = computed(() => Object.values(playerStore.items))

const typeOptions = computed(() => [...new Set(allItems.value.map((i) => i.type).filter(Boolean))])
const rarityOptions = computed(() => [...new Set(allItems.value.map((i) => i.rarity).filter(Boolean))])

const filteredItems = computed(() =>
  allItems.value.filter((item) => {
    if (filters.rarity && item.rarity !== filters.rarity) return false
    if (filters.type && item.type !== filters.type) return false
    if (filters.identified === 'yes' && !item.isIdentified) return false
    if (filters.identified === 'no' && item.isIdentified) return false
    if (filters.attuned === 'yes' && !item.attunementRequired) return false
    if (filters.attuned === 'no' && item.attunementRequired) return false
    if (filters.holder === 'stash' && item.currentHolderId) return false
    if (filters.holder && filters.holder !== 'stash' && item.currentHolderId !== filters.holder) return false
    return true
  }),
)

const groups = computed(() => {
  if (!groupByHolder.value) return [{ label: 'All Items', items: filteredItems.value }]
  const byHolder = new Map<string, LootItem[]>()
  byHolder.set('__stash__', [])
  for (const player of players.value) byHolder.set(player.id, [])
  for (const item of filteredItems.value) {
    const key = item.currentHolderId && byHolder.has(item.currentHolderId) ? item.currentHolderId : '__stash__'
    byHolder.get(key)!.push(item)
  }
  const result = [{ label: 'Party Stash', items: byHolder.get('__stash__') ?? [] }]
  for (const player of players.value) {
    result.push({ label: player.name, items: byHolder.get(player.id) ?? [] })
  }
  return result
})

function toggleSelect(id: string) {
  const index = selectedIds.value.indexOf(id)
  if (index !== -1) selectedIds.value.splice(index, 1)
  else selectedIds.value.push(id)
}

function openDetail(item: LootItem) {
  sidePanel.push({ title: item.name || 'Item', component: LootItemDetail, props: { item } })
}

function addItem() {
  const item = lootStore.add(createDefaultLootItem({ name: 'New Item' }))
  openDetail(item)
}

function onBulkAwardDone() {
  selectedIds.value = []
}

// Party wealth: LootItem.value is freetext ("50 gp") with no reliable
// numeric parse — sum each player's structured currency instead (same
// per-denomination total CurrencyEditor.vue already computes per player).
const partyWealth = computed(() => {
  if (!system.value) return []
  const totals: Record<string, number> = {}
  for (const player of players.value) {
    for (const denom of system.value.currency) {
      totals[denom.key] = (totals[denom.key] ?? 0) + (player.currency[denom.key] ?? 0)
    }
  }
  return system.value.currency.map((denom) => ({ label: denom.abbreviation, total: totals[denom.key] ?? 0 }))
})
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhCoins :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start tracking loot.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Loot Ledger">
      <template #actions>
        <Button
          v-if="selectedIds.length"
          :label="`Award ${selectedIds.length} selected`"
          class="!bg-transparent !text-gold hover:!text-gold-dim"
          @click="showBulkAward = true"
        />
        <Button label="Add Item" @click="addItem" />
      </template>
    </PageHeader>

    <div v-if="partyWealth.length" class="flex flex-wrap items-center gap-4 border-b border-border px-6 py-3 text-sm">
      <span class="text-ink">Party Wealth:</span>
      <span v-for="w in partyWealth" :key="w.label" class="font-mono text-parchment">{{ w.total }}{{ w.label }}</span>
    </div>

    <div class="flex flex-wrap items-center gap-2 px-6 py-3">
      <select v-model="filters.type" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-ink">
        <option value="">All types</option>
        <option v-for="t in typeOptions" :key="t" :value="t">{{ t }}</option>
      </select>
      <select v-model="filters.rarity" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-ink">
        <option value="">All rarities</option>
        <option v-for="r in rarityOptions" :key="r" :value="r">{{ r }}</option>
      </select>
      <select v-model="filters.holder" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-ink">
        <option value="">All holders</option>
        <option value="stash">Party Stash</option>
        <option v-for="p in players" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <select v-model="filters.identified" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-ink">
        <option value="">Identified: any</option>
        <option value="yes">Identified</option>
        <option value="no">Unidentified</option>
      </select>
      <select v-model="filters.attuned" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-ink">
        <option value="">Attunement: any</option>
        <option value="yes">Requires</option>
        <option value="no">No</option>
      </select>
      <label class="ml-auto flex items-center gap-1 text-xs text-ink">
        <input type="checkbox" v-model="groupByHolder" class="h-4 w-4 accent-gold" /> Group by holder
      </label>
    </div>

    <div class="flex-1 overflow-y-auto px-6 pb-6">
      <div v-if="allItems.length === 0" class="flex flex-col items-center gap-3 py-16 text-center">
        <PhCoins :size="32" class="text-ink" />
        <p class="text-sm text-ink">The party travels light. Add items from the session or create loot.</p>
      </div>
      <div v-else>
        <div v-for="group in groups" :key="group.label" class="mb-6">
          <p v-if="groupByHolder" class="mb-2 text-xs uppercase tracking-wide text-ink">
            {{ group.label }} ({{ group.items.length }})
          </p>
          <LootTable :items="group.items" :selected-ids="selectedIds" @toggle="toggleSelect" @select="openDetail" />
        </div>
      </div>
    </div>

    <BulkAwardDialog v-model:visible="showBulkAward" :item-ids="selectedIds" @done="onBulkAwardDone" />
  </div>
</template>
