<script setup lang="ts">
import { computed } from 'vue'
import { PhTrash } from '@phosphor-icons/vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { useNPCStore } from '@/stores/npcs'
import { useFactionStore } from '@/stores/factions'
import { useWorldStore } from '@/stores/world'
import { useQuestsStore } from '@/stores/quests'
import { useTopicsStore } from '@/stores/topics'
import { useHandoutsStore } from '@/stores/handouts'
import { useSidePanel } from '@/composables/useSidePanel'
import { useSessionMode } from '@/composables/useSessionMode'
import type { Handout } from '@/types'

const props = defineProps<{ handout: Handout }>()

const npcStore = useNPCStore()
const factionStore = useFactionStore()
const worldStore = useWorldStore()
const questsStore = useQuestsStore()
const topicsStore = useTopicsStore()
const handoutsStore = useHandoutsStore()
const sidePanel = useSidePanel()
const { activeSessionId } = useSessionMode()

const TYPES: Handout['type'][] = ['letter', 'map', 'journal', 'poster', 'riddle', 'code', 'prophecy', 'image', 'other']

// Same combined-options approach TopicDetail.vue uses, extended with Topics
// itself since that feature exists now too.
const linkedOptions = computed(() => [
  ...Object.values(npcStore.items).map((n) => ({ id: n.id, label: `${n.name} (NPC)` })),
  ...Object.values(factionStore.items).map((f) => ({ id: f.id, label: `${f.name} (Faction)` })),
  ...Object.values(worldStore.items).map((l) => ({ id: l.id, label: `${l.name} (Landmark)` })),
  ...Object.values(questsStore.items).map((q) => ({ id: q.id, label: `${q.title} (Quest)` })),
  ...Object.values(topicsStore.items).map((t) => ({ id: t.id, label: `${t.title} (Topic)` })),
])

// Only stamps revealedSessionId on the false->true transition, and only
// when a session is actually live — toggling off doesn't clear it, since
// it records "most recently revealed in session X", not current visibility.
function onRevealToggle(value: boolean) {
  props.handout.isRevealed = value
  if (value && activeSessionId.value) {
    props.handout.revealedSessionId = activeSessionId.value
  }
}

function remove() {
  if (window.confirm('Remove this handout? This cannot be undone.')) {
    handoutsStore.remove(props.handout.id)
    sidePanel.close()
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-start justify-between gap-3">
      <input
        v-model="handout.name"
        placeholder="Handout Name"
        class="w-full bg-transparent font-display text-xl text-gold outline-none"
      />
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="remove">
        <PhTrash :size="18" />
      </button>
    </div>

    <div class="flex items-center gap-3">
      <select v-model="handout.type" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment">
        <option v-for="t in TYPES" :key="t" :value="t">{{ t }}</option>
      </select>
      <label class="flex items-center gap-1 text-sm text-ink">
        <input
          type="checkbox"
          :checked="handout.isRevealed"
          class="h-4 w-4 accent-gold"
          @change="onRevealToggle(($event.target as HTMLInputElement).checked)"
        />
        Revealed to players
      </label>
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">
        {{ handout.type === 'image' ? 'Image URL' : 'Content (markdown)' }}
      </label>
      <textarea
        v-model="handout.content"
        rows="6"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
      <img
        v-if="handout.type === 'image' && handout.content"
        :src="handout.content"
        class="mt-2 max-h-48 rounded-md border border-border object-contain"
        alt=""
      />
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Notes (DM only)</label>
      <textarea
        v-model="handout.notes"
        rows="3"
        class="w-full rounded-md border border-crimson/40 bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-crimson"
      />
    </div>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Linked Entities</p>
      <EntityLinkList v-model="handout.linkedEntityIds" :options="linkedOptions" />
    </div>
  </div>
</template>
