<script setup lang="ts">
import { computed } from 'vue'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useStoryStore } from '@/stores/story'
import type { StoryBeat, CampaignArc } from '@/types'

interface FlatBeat {
  beat: StoryBeat
  arc: CampaignArc
}

interface Column {
  key: string
  label: string
  statuses: StoryBeat['status'][]
}

const storyStore = useStoryStore()

const allBeats = computed<FlatBeat[]>(() =>
  Object.values(storyStore.items).flatMap((arc) => arc.beats.map((beat) => ({ beat, arc }))),
)

const COLUMNS: Column[] = [
  { key: 'upcoming', label: 'Upcoming', statuses: ['upcoming'] },
  { key: 'active', label: 'Active', statuses: ['active'] },
  { key: 'completed', label: 'Completed', statuses: ['completed'] },
  { key: 'other', label: 'Other', statuses: ['abandoned', 'skipped'] },
]

function beatsFor(column: Column): FlatBeat[] {
  return allBeats.value.filter((fb) => column.statuses.includes(fb.beat.status))
}

const { draggedId, dragOverKey, onDragStart, onDragOver, onDrop, onDragEnd } = useDragAndDrop()

function findBeat(id: string): FlatBeat | undefined {
  return allBeats.value.find((fb) => fb.beat.id === id)
}

function moveToColumn(column: Column, draggedBeatId: string) {
  const found = findBeat(draggedBeatId)
  if (found) found.beat.status = column.statuses[0]
}
</script>

<template>
  <div class="grid grid-cols-1 gap-3 p-4 sm:grid-cols-4">
    <div
      v-for="column in COLUMNS"
      :key="column.key"
      class="flex flex-col gap-2 rounded-md border border-border bg-obsidian p-2"
      :class="dragOverKey === column.key ? 'ring-2 ring-gold' : ''"
      @dragover="onDragOver($event, column.key)"
      @drop="onDrop($event, (id) => moveToColumn(column, id))"
    >
      <p class="text-xs uppercase tracking-wide text-ink">{{ column.label }} ({{ beatsFor(column).length }})</p>
      <div
        v-for="fb in beatsFor(column)"
        :key="fb.beat.id"
        draggable="true"
        class="rounded-md border border-border bg-slate p-2 transition-opacity"
        :class="draggedId === fb.beat.id ? 'opacity-40' : ''"
        @dragstart="onDragStart($event, fb.beat.id)"
        @dragend="onDragEnd"
      >
        <p class="text-xs text-ink">{{ fb.arc.name }}</p>
        <p class="text-sm text-parchment">{{ fb.beat.title || 'Untitled Beat' }}</p>
      </div>
      <p v-if="beatsFor(column).length === 0" class="text-xs text-ink">No beats.</p>
    </div>
  </div>
</template>
