<script setup lang="ts">
import { computed } from 'vue'
import { PhTrash, PhPlus } from '@phosphor-icons/vue'
import { useTablesStore } from '@/stores/tables'
import { useDiceStore } from '@/stores/dice'
import { useSidePanel } from '@/composables/useSidePanel'
import { createDefaultRandomTableEntry } from '@/utils/defaults'
import { newId } from '@/utils/id'
import TableRoller from './TableRoller.vue'
import type { RandomTable } from '@/types'

const props = defineProps<{ table: RandomTable }>()

const tablesStore = useTablesStore()
const diceStore = useDiceStore()
const sidePanel = useSidePanel()

const otherTables = computed(() => Object.values(tablesStore.items).filter((t) => t.id !== props.table.id))

const rollHistory = computed(() =>
  Object.values(diceStore.items)
    .filter((r) => r.tableId === props.table.id)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 10),
)

function addEntry() {
  props.table.entries.push({ id: newId(), ...createDefaultRandomTableEntry() })
}
function removeEntry(id: string) {
  const index = props.table.entries.findIndex((e) => e.id === id)
  if (index !== -1) props.table.entries.splice(index, 1)
}

function addTag() {
  props.table.tags.push('')
}
function removeTag(index: number) {
  props.table.tags.splice(index, 1)
}

function remove() {
  if (window.confirm('Remove this table? This cannot be undone.')) {
    tablesStore.remove(props.table.id)
    sidePanel.close()
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-start justify-between gap-3">
      <input
        v-model="table.name"
        placeholder="Table Name"
        class="w-full bg-transparent font-display text-xl text-gold outline-none"
      />
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="remove">
        <PhTrash :size="18" />
      </button>
    </div>

    <TableRoller :table="table" />

    <div class="grid grid-cols-2 gap-2">
      <input
        v-model="table.category"
        placeholder="Category"
        class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
      />
      <input
        v-model="table.diceNotation"
        placeholder="1d20"
        class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Description</label>
      <textarea
        v-model="table.description"
        rows="2"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div>
      <div class="mb-2 flex items-center justify-between">
        <p class="font-display text-sm text-gold">Entries</p>
        <button type="button" class="tap-target text-gold hover:text-gold-dim" @click="addEntry">
          <PhPlus :size="14" />
        </button>
      </div>
      <div v-for="entry in table.entries" :key="entry.id" class="mb-2 flex flex-col gap-2 rounded-md border border-border p-2">
        <div class="flex items-center gap-2">
          <input v-model.number="entry.minRoll" type="number" class="w-14 shrink-0 rounded-md border border-border bg-slate px-1 py-0.5 text-center text-xs text-parchment outline-none" />
          <span class="shrink-0 text-ink">–</span>
          <input v-model.number="entry.maxRoll" type="number" class="w-14 shrink-0 rounded-md border border-border bg-slate px-1 py-0.5 text-center text-xs text-parchment outline-none" />
          <!-- min-w-0 lets this actually shrink below an <input>'s default
               intrinsic width — without it, flex-1 alone isn't enough and
               this row pushes past the panel's width instead of shrinking.
               Same reasoning removes tap-target from the button below: its
               44px min-size is one packed sibling too many in a 400px panel. -->
          <input v-model="entry.result" placeholder="Result…" class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-0.5 text-sm text-parchment outline-none" />
          <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeEntry(entry.id)">
            <PhTrash :size="12" />
          </button>
        </div>
        <div class="flex items-center gap-2">
          <input v-model="entry.notes" placeholder="Notes (optional)" class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-0.5 text-xs text-parchment outline-none" />
          <!-- max-w caps this regardless of how long an option's label is —
               native <select> sizes to its longest option otherwise, which
               can push this row past the panel's width instead of shrinking. -->
          <select v-model="entry.subTable" class="w-[150px] shrink-0 truncate rounded-md border border-border bg-slate px-1 py-0.5 text-xs text-parchment">
            <option value="">No sub-table</option>
            <option v-for="t in otherTables" :key="t.id" :value="t.id">Roll on: {{ t.name }}</option>
          </select>
        </div>
      </div>
      <p v-if="table.entries.length === 0" class="text-xs text-ink">No entries yet.</p>
    </div>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Tags</p>
      <div class="flex flex-wrap items-center gap-2">
        <div v-for="(_tag, index) in table.tags" :key="index" class="flex items-center gap-1 rounded-full border border-border bg-slate px-2 py-0.5 text-xs text-parchment">
          <input v-model="table.tags[index]" class="w-16 bg-transparent outline-none" />
          <button type="button" class="text-ink hover:text-crimson" @click="removeTag(index)">
            <PhTrash :size="10" />
          </button>
        </div>
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="addTag">+ Add tag</button>
      </div>
    </div>

    <div>
      <p class="mb-2 font-display text-sm text-gold">Recent Rolls</p>
      <p v-if="rollHistory.length === 0" class="text-xs text-ink">No rolls logged yet.</p>
      <div v-for="roll in rollHistory" :key="roll.id" class="mb-1 flex items-center justify-between text-xs text-ink">
        <span class="truncate text-parchment">{{ roll.purpose }}</span>
        <span class="shrink-0 font-mono">{{ roll.total }}</span>
      </div>
    </div>
  </div>
</template>
