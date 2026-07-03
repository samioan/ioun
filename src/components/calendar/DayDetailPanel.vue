<script setup lang="ts">
import { computed } from 'vue'
import { PhPlus, PhTrash } from '@phosphor-icons/vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { useCalendarStore } from '@/stores/calendar'
import { useNPCStore } from '@/stores/npcs'
import { useFactionStore } from '@/stores/factions'
import { useWorldStore } from '@/stores/world'
import { useQuestsStore } from '@/stores/quests'
import { useTopicsStore } from '@/stores/topics'
import { createDefaultCalendarEvent } from '@/utils/defaults'
import type { WorldDate, CalendarEvent } from '@/types'

const props = defineProps<{ date: WorldDate }>()

const calendarStore = useCalendarStore()
const npcStore = useNPCStore()
const factionStore = useFactionStore()
const worldStore = useWorldStore()
const questsStore = useQuestsStore()
const topicsStore = useTopicsStore()

const EVENT_TYPES: CalendarEvent['type'][] = ['holiday', 'historical', 'session', 'planned', 'deadline', 'custom']

function sameDay(a: WorldDate, b: WorldDate) {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

const eventsOnDay = computed(() => Object.values(calendarStore.items).filter((e) => sameDay(e.worldDate, props.date)))
const questDeadlinesOnDay = computed(() =>
  Object.values(questsStore.items).filter((q) => q.deadline && sameDay(q.deadline, props.date)),
)
const topicDeadlinesOnDay = computed(() =>
  Object.values(topicsStore.items).filter((t) => t.deadline && sameDay(t.deadline, props.date)),
)

// Linked entities can point at any of these entity kinds — same combined
// options approach as TopicDetail.vue.
const linkedOptions = computed(() => [
  ...Object.values(npcStore.items).map((n) => ({ id: n.id, label: `${n.name} (NPC)` })),
  ...Object.values(factionStore.items).map((f) => ({ id: f.id, label: `${f.name} (Faction)` })),
  ...Object.values(worldStore.items).map((l) => ({ id: l.id, label: `${l.name} (Landmark)` })),
  ...Object.values(questsStore.items).map((q) => ({ id: q.id, label: `${q.title} (Quest)` })),
])

function addEvent() {
  calendarStore.add(createDefaultCalendarEvent({ name: 'New Event', worldDate: { ...props.date } }))
}
function removeEvent(id: string) {
  calendarStore.remove(id)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="questDeadlinesOnDay.length || topicDeadlinesOnDay.length" class="flex flex-wrap gap-2">
      <span
        v-for="q in questDeadlinesOnDay"
        :key="q.id"
        class="rounded-full border border-crimson/40 px-2 py-0.5 text-xs text-crimson"
      >
        Quest due: {{ q.title }}
      </span>
      <span
        v-for="t in topicDeadlinesOnDay"
        :key="t.id"
        class="rounded-full border border-crimson/40 px-2 py-0.5 text-xs text-crimson"
      >
        Topic due: {{ t.title }}
      </span>
    </div>

    <div class="flex items-center justify-between">
      <p class="font-display text-lg text-gold">Events</p>
      <button type="button" class="tap-target text-gold hover:text-gold-dim" @click="addEvent">
        <PhPlus :size="16" />
      </button>
    </div>

    <p v-if="eventsOnDay.length === 0" class="text-sm text-ink">No events on this day.</p>

    <div v-for="event in eventsOnDay" :key="event.id" class="flex flex-col gap-2 rounded-md border border-border p-3">
      <div class="flex items-center justify-between gap-2">
        <input
          v-model="event.name"
          placeholder="Event name"
          class="flex-1 bg-transparent text-sm text-parchment outline-none"
        />
        <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeEvent(event.id)">
          <PhTrash :size="14" />
        </button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <select v-model="event.type" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment">
          <option v-for="t in EVENT_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
        <label class="flex items-center gap-1 text-xs text-ink">
          <input type="checkbox" v-model="event.isRecurring" class="h-4 w-4 accent-gold" /> Recurring
        </label>
        <label class="flex items-center gap-1 text-xs text-ink">
          <input type="checkbox" v-model="event.isSecret" class="h-4 w-4 accent-gold" /> Secret
        </label>
      </div>
      <textarea
        v-model="event.description"
        rows="2"
        placeholder="Description…"
        class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
      />
      <EntityLinkList v-model="event.linkedEntityIds" :options="linkedOptions" />
    </div>
  </div>
</template>
