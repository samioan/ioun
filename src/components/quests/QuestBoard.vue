<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useQuestsStore } from '@/stores/quests'
import { useSidePanel } from '@/composables/useSidePanel'
import QuestCard from './QuestCard.vue'
import QuestDetail from './QuestDetail.vue'
import type { Quest } from '@/types'

interface Column {
  key: string
  label: string
  statuses: Quest['status'][]
}

const questsStore = useQuestsStore()
const sidePanel = useSidePanel()

const filters = reactive({ type: '', priority: '', giver: '', search: '' })

const COLUMNS: Column[] = [
  { key: 'available', label: 'Available', statuses: ['available'] },
  { key: 'active', label: 'Active', statuses: ['active'] },
  { key: 'completed', label: 'Completed', statuses: ['completed'] },
  { key: 'failed', label: 'Failed', statuses: ['failed'] },
  { key: 'other', label: 'Other', statuses: ['abandoned'] },
]

const filteredQuests = computed(() => {
  const search = filters.search.trim().toLowerCase()
  return Object.values(questsStore.items).filter((quest) => {
    if (filters.type && quest.type !== filters.type) return false
    if (filters.priority && quest.priority !== filters.priority) return false
    if (search && !quest.title.toLowerCase().includes(search)) return false
    return true
  })
})

function questsFor(column: Column): Quest[] {
  return filteredQuests.value.filter((q) => column.statuses.includes(q.status))
}

const { draggedId, dragOverKey, onDragStart, onDragOver, onDrop, onDragEnd } = useDragAndDrop()

function moveToColumn(column: Column, questId: string) {
  // Flat-field patch via update() — the correct case for it, unlike the
  // nested beat-reorder splice which needs direct mutation.
  questsStore.update(questId, { status: column.statuses[0] })
}

function openDetail(quest: Quest) {
  sidePanel.push({ title: quest.title || 'Untitled Quest', component: QuestDetail, props: { quest } })
}
</script>

<template>
  <div class="flex flex-col gap-3 p-4">
    <div class="flex flex-wrap items-center gap-2">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search quests…"
        class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
      />
      <select v-model="filters.type" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-ink">
        <option value="">All types</option>
        <option v-for="t in ['main', 'side', 'personal', 'faction', 'bounty', 'exploration', 'custom']" :key="t" :value="t">
          {{ t }}
        </option>
      </select>
      <select v-model="filters.priority" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-ink">
        <option value="">All priorities</option>
        <option v-for="p in ['low', 'medium', 'high', 'urgent']" :key="p" :value="p">{{ p }}</option>
      </select>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-5">
      <div
        v-for="column in COLUMNS"
        :key="column.key"
        class="flex flex-col gap-2 rounded-md border border-border bg-obsidian p-2"
        :class="dragOverKey === column.key ? 'ring-2 ring-gold' : ''"
        @dragover="onDragOver($event, column.key)"
        @drop="onDrop($event, (id) => moveToColumn(column, id))"
      >
        <p class="text-xs uppercase tracking-wide text-ink">{{ column.label }} ({{ questsFor(column).length }})</p>
        <div
          v-for="quest in questsFor(column)"
          :key="quest.id"
          draggable="true"
          class="transition-opacity"
          :class="draggedId === quest.id ? 'opacity-40' : ''"
          @dragstart="onDragStart($event, quest.id)"
          @dragend="onDragEnd"
        >
          <QuestCard :quest="quest" @select="openDetail(quest)" />
        </div>
        <p v-if="questsFor(column).length === 0" class="text-xs text-ink">No quests.</p>
      </div>
    </div>
  </div>
</template>
