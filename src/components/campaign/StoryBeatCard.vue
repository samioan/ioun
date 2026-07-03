<script setup lang="ts">
import { computed } from 'vue'
import { PhLock, PhTrash } from '@phosphor-icons/vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { useSessionStore } from '@/stores/session'
import type { StoryBeat } from '@/types'

const props = defineProps<{ beat: StoryBeat; beatLookup: (id?: string) => string | undefined }>()
const emit = defineEmits<{ remove: [] }>()

const sessionStore = useSessionStore()
const sessionOptions = computed(() =>
  Object.values(sessionStore.items).map((s) => ({
    id: s.id,
    label: `Session ${s.number}${s.title ? ' — ' + s.title : ''}`,
  })),
)

const STATUSES: StoryBeat['status'][] = ['upcoming', 'active', 'completed', 'abandoned', 'skipped']
const TYPES: StoryBeat['type'][] = ['main', 'side', 'character', 'world', 'interlude']

function addOutcome() {
  if (!props.beat.alternateOutcomes) props.beat.alternateOutcomes = []
  props.beat.alternateOutcomes.push('')
}
function removeOutcome(index: number) {
  props.beat.alternateOutcomes?.splice(index, 1)
}
</script>

<template>
  <div class="rounded-md border border-border bg-obsidian p-3">
    <div class="flex items-start justify-between gap-2">
      <input
        v-model="beat.title"
        placeholder="Beat title"
        class="flex-1 bg-transparent font-display text-lg text-parchment outline-none"
      />
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="emit('remove')">
        <PhTrash :size="16" />
      </button>
    </div>

    <div class="mt-2 flex flex-wrap gap-2">
      <select v-model="beat.status" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment">
        <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="beat.type" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment">
        <option v-for="t in TYPES" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>

    <textarea
      v-model="beat.description"
      rows="2"
      placeholder="What happens…"
      class="mt-2 w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
    />
    <textarea
      v-model="beat.foreshadowing"
      rows="1"
      placeholder="Foreshadowing…"
      class="mt-2 w-full rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none focus:border-gold"
    />
    <div class="mt-2 flex items-start gap-1 text-xs text-ink">
      <PhLock :size="12" class="mt-1.5 shrink-0" />
      <textarea
        v-model="beat.secrets"
        rows="1"
        placeholder="DM secrets…"
        class="w-full rounded-md border border-crimson/40 bg-slate px-2 py-1 text-xs text-parchment outline-none focus:border-crimson"
      />
    </div>

    <div class="mt-2">
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Linked Sessions</p>
      <EntityLinkList v-model="beat.linkedSessionIds" :options="sessionOptions" />
    </div>

    <div v-if="beat.callbackTo || beat.foreshadowedIn?.length" class="mt-2 text-xs text-ink">
      <span v-if="beat.callbackTo">Pays off: {{ beatLookup(beat.callbackTo) ?? 'Unknown beat' }}</span>
      <span v-if="beat.foreshadowedIn?.length" class="ml-2">
        Seeded in: {{ beat.foreshadowedIn.map((id) => beatLookup(id) ?? 'Unknown').join(', ') }}
      </span>
    </div>

    <div class="mt-2">
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">What If (alternate outcomes)</p>
      <div v-for="(_outcome, index) in beat.alternateOutcomes" :key="index" class="mb-1 flex items-center gap-2">
        <input
          v-model="beat.alternateOutcomes![index]"
          class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none"
        />
        <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeOutcome(index)">
          <PhTrash :size="12" />
        </button>
      </div>
      <button type="button" class="text-xs text-gold hover:text-gold-dim" @click="addOutcome">+ Add outcome</button>
    </div>
  </div>
</template>
