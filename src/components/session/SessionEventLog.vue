<script setup lang="ts">
import { reactive, computed } from 'vue'
import { PhPlus } from '@phosphor-icons/vue'
import { newId } from '@/utils/id'
import type { Session, SessionEvent } from '@/types'

const props = defineProps<{ session: Session }>()

const EVENT_TYPES: SessionEvent['type'][] = [
  'story',
  'combat',
  'discovery',
  'decision',
  'death',
  'levelup',
  'loot',
  'npc_interaction',
  'travel',
  'rest',
  'custom',
]
const IMPORTANCE_LEVELS: SessionEvent['importance'][] = ['minor', 'major', 'pivotal']

const draft = reactive<{ title: string; type: SessionEvent['type']; importance: SessionEvent['importance'] }>({
  title: '',
  type: 'story',
  importance: 'minor',
})

const events = computed(() => [...props.session.events].reverse())

function addEvent() {
  if (!draft.title.trim()) return
  props.session.events.push({
    id: newId(),
    timestamp: new Date().toISOString(),
    type: draft.type,
    title: draft.title.trim(),
    description: '',
    linkedEntityIds: [],
    importance: draft.importance,
  })
  draft.title = ''
}
</script>

<template>
  <div class="flex flex-col gap-2 border-t border-border p-3">
    <p class="text-xs uppercase tracking-wide text-ink">Events</p>
    <div class="flex items-center gap-2">
      <input
        v-model="draft.title"
        placeholder="Log an event…"
        class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
        @keydown.enter="addEvent"
      />
      <select v-model="draft.type" class="shrink-0 rounded-md border border-border bg-slate px-1 py-1 text-xs text-ink">
        <option v-for="t in EVENT_TYPES" :key="t" :value="t">{{ t }}</option>
      </select>
      <select v-model="draft.importance" class="shrink-0 rounded-md border border-border bg-slate px-1 py-1 text-xs text-ink">
        <option v-for="i in IMPORTANCE_LEVELS" :key="i" :value="i">{{ i }}</option>
      </select>
      <button type="button" class="tap-target shrink-0 text-gold hover:text-gold-dim" @click="addEvent">
        <PhPlus :size="16" />
      </button>
    </div>
    <p v-if="events.length === 0" class="text-xs text-ink">No events logged yet.</p>
    <div v-for="event in events" :key="event.id" class="flex items-center justify-between text-xs">
      <span class="text-parchment">{{ event.title }}</span>
      <span class="text-ink">{{ event.type }} · {{ event.importance }}</span>
    </div>
  </div>
</template>
