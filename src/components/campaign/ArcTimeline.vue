<script setup lang="ts">
import { computed } from 'vue'
import { PhTrash, PhPlus, PhDotsSixVertical } from '@phosphor-icons/vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useNPCStore } from '@/stores/npcs'
import { newId } from '@/utils/id'
import StoryBeatCard from './StoryBeatCard.vue'
import type { CampaignArc } from '@/types'

const props = defineProps<{ arc: CampaignArc; beatLookup: (id?: string) => string | undefined }>()
const emit = defineEmits<{ remove: [] }>()

const npcStore = useNPCStore()
const npcOptions = computed(() => Object.values(npcStore.items).map((n) => ({ id: n.id, label: n.name })))

const antagonistLink = computed<string[]>({
  get: () => (props.arc.antagonistId ? [props.arc.antagonistId] : []),
  set: (v) => {
    props.arc.antagonistId = v[0]
  },
})

const ARC_STATUSES: CampaignArc['status'][] = ['upcoming', 'active', 'completed']
const sortedBeats = computed(() => [...props.arc.beats].sort((a, b) => a.order - b.order))

const { draggedId, dragOverKey, onDragStart, onDragOver, onDrop, onDragEnd } = useDragAndDrop()

// onDrop's handler always receives the DRAGGED (source) id — the target
// must be captured via closure from the template (matching BeatKanban's
// `column` and QuestBoard's `column` closures), not threaded through the
// handler's own parameter.
function reorderTo(draggedBeatId: string, targetBeatId: string) {
  if (!draggedBeatId || draggedBeatId === targetBeatId) return
  const from = props.arc.beats.findIndex((b) => b.id === draggedBeatId)
  const to = props.arc.beats.findIndex((b) => b.id === targetBeatId)
  if (from === -1 || to === -1) return
  const [moved] = props.arc.beats.splice(from, 1)
  props.arc.beats.splice(to, 0, moved)
  props.arc.beats.forEach((beat, i) => (beat.order = i))
}

function addBeat() {
  props.arc.beats.push({
    id: newId(),
    arcId: props.arc.id,
    order: props.arc.beats.length,
    title: 'New Beat',
    description: '',
    status: 'upcoming',
    type: 'main',
    linkedSessionIds: [],
    linkedEntityIds: [],
    secrets: '',
    foreshadowing: '',
  })
}

function removeBeat(id: string) {
  const index = props.arc.beats.findIndex((b) => b.id === id)
  if (index !== -1) props.arc.beats.splice(index, 1)
}
</script>

<template>
  <section class="rounded-md border border-border p-4">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1">
        <input
          v-model="arc.name"
          placeholder="Arc Name"
          class="w-full bg-transparent font-display text-2xl text-gold outline-none"
        />
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <select v-model="arc.status" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment">
            <option v-for="s in ARC_STATUSES" :key="s" :value="s">{{ s }}</option>
          </select>
          <input
            v-model="arc.theme"
            placeholder="Theme"
            class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none"
          />
          <div class="flex items-center gap-1 text-xs text-ink">
            Antagonist:
            <EntityLinkList v-model="antagonistLink" :options="npcOptions" :max="1" />
          </div>
        </div>
      </div>
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="emit('remove')">
        <PhTrash :size="18" />
      </button>
    </div>

    <textarea
      v-model="arc.summary"
      rows="2"
      placeholder="Summary…"
      class="mt-3 w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
    />

    <div class="mt-4 flex flex-col gap-2">
      <div
        v-for="beat in sortedBeats"
        :key="beat.id"
        draggable="true"
        class="flex items-start gap-2 rounded-md transition-opacity"
        :class="[draggedId === beat.id ? 'opacity-40' : '', dragOverKey === beat.id ? 'ring-2 ring-gold' : '']"
        @dragstart="onDragStart($event, beat.id)"
        @dragover="onDragOver($event, beat.id)"
        @drop="onDrop($event, (draggedBeatId) => reorderTo(draggedBeatId, beat.id))"
        @dragend="onDragEnd"
      >
        <!--
          Dedicated drag handle: the card body is full of inputs/textareas,
          and a mousedown that starts on editable content is hijacked by the
          browser for text selection/caret placement instead of initiating
          the ancestor's native drag — dragging only works reliably from a
          non-editable handle like this one.
        -->
        <div class="tap-target flex shrink-0 cursor-grab items-center justify-center pt-3 text-ink hover:text-gold">
          <PhDotsSixVertical :size="16" />
        </div>
        <StoryBeatCard class="flex-1" :beat="beat" :beat-lookup="beatLookup" @remove="removeBeat(beat.id)" />
      </div>
      <p v-if="sortedBeats.length === 0" class="text-sm text-ink">No beats yet.</p>
      <button
        type="button"
        class="tap-target flex items-center gap-2 self-start text-sm text-gold hover:text-gold-dim"
        @click="addBeat"
      >
        <PhPlus :size="14" /> Add Beat
      </button>
    </div>
  </section>
</template>
