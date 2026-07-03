<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { formatWorldDate } from '@/utils/worldDate'
import type { CalendarSystem, WorldDate } from '@/types'

export interface TimelineEntry {
  id: string
  label: string
  date: WorldDate
  kind: 'event' | 'quest-deadline' | 'topic-deadline'
  isSecret?: boolean
}

defineProps<{ entries: TimelineEntry[]; calendar: CalendarSystem }>()
defineEmits<{ 'select-event': [string] }>()

const KIND_LABEL: Record<TimelineEntry['kind'], string> = {
  event: 'Event',
  'quest-deadline': 'Quest Deadline',
  'topic-deadline': 'Topic Deadline',
}
const KIND_LINK: Record<TimelineEntry['kind'], string | undefined> = {
  event: undefined,
  'quest-deadline': '/quests',
  'topic-deadline': '/topics',
}
</script>

<template>
  <div class="flex gap-3 overflow-x-auto pb-2">
    <p v-if="entries.length === 0" class="text-sm text-ink">No events on the calendar yet.</p>
    <div
      v-for="entry in entries"
      :key="`${entry.kind}-${entry.id}`"
      class="flex w-48 shrink-0 flex-col gap-1 rounded-md border border-border bg-slate p-3"
    >
      <p class="text-xs uppercase tracking-wide text-ink">{{ KIND_LABEL[entry.kind] }}</p>
      <RouterLink
        v-if="KIND_LINK[entry.kind]"
        :to="KIND_LINK[entry.kind]!"
        class="truncate text-left text-sm text-parchment hover:text-gold"
      >
        {{ entry.label }}
      </RouterLink>
      <button
        v-else
        type="button"
        class="truncate text-left text-sm text-parchment hover:text-gold"
        @click="$emit('select-event', entry.id)"
      >
        {{ entry.label }}
      </button>
      <p class="text-xs text-ink">{{ formatWorldDate(entry.date, calendar) }}</p>
      <span v-if="entry.isSecret" class="w-fit rounded-full border border-crimson/40 px-2 py-0.5 text-xs text-crimson">
        Secret
      </span>
    </div>
  </div>
</template>
