<script setup lang="ts">
import { computed } from 'vue'
import { PhTrash } from '@phosphor-icons/vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import WorldDateEditor from '@/components/shared/WorldDateEditor.vue'
import { useNPCStore } from '@/stores/npcs'
import { useFactionStore } from '@/stores/factions'
import { useWorldStore } from '@/stores/world'
import { useQuestsStore } from '@/stores/quests'
import { useCampaignStore } from '@/stores/campaign'
import { useTopicsStore } from '@/stores/topics'
import { useSidePanel } from '@/composables/useSidePanel'
import type { CampaignTopic } from '@/types'

const props = defineProps<{ topic: CampaignTopic }>()

const npcStore = useNPCStore()
const factionStore = useFactionStore()
const worldStore = useWorldStore()
const questsStore = useQuestsStore()
const campaignStore = useCampaignStore()
const topicsStore = useTopicsStore()
const sidePanel = useSidePanel()

const CATEGORIES: CampaignTopic['category'][] = [
  'prophecy',
  'mystery',
  'rumor',
  'quest',
  'secret',
  'lore',
  'hook',
  'threat',
  'promise',
  'bounty',
  'contract',
]
const STATUSES: CampaignTopic['status'][] = ['open', 'ongoing', 'resolved', 'red-herring', 'dormant']
const PRIORITIES: CampaignTopic['priority'][] = ['low', 'medium', 'high', 'urgent']

const calendar = computed(() => campaignStore.getActive()?.calendarSystem)

// Linked entities can point at any of these entity kinds — combine into one
// flat option list, same approach NPCDetail.vue uses for relationshipMap.
const linkedOptions = computed(() => [
  ...Object.values(npcStore.items).map((n) => ({ id: n.id, label: `${n.name} (NPC)` })),
  ...Object.values(factionStore.items).map((f) => ({ id: f.id, label: `${f.name} (Faction)` })),
  ...Object.values(worldStore.items).map((l) => ({ id: l.id, label: `${l.name} (Landmark)` })),
  ...Object.values(questsStore.items).map((q) => ({ id: q.id, label: `${q.title} (Quest)` })),
])

function remove() {
  if (window.confirm('Remove this topic? This cannot be undone.')) {
    topicsStore.remove(props.topic.id)
    sidePanel.close()
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-start justify-between gap-3">
      <input
        v-model="topic.title"
        placeholder="Topic Title"
        class="w-full bg-transparent font-display text-xl text-gold outline-none"
      />
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="remove">
        <PhTrash :size="18" />
      </button>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <select v-model="topic.category" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment">
        <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="topic.status" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment">
        <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="topic.priority" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment">
        <option v-for="p in PRIORITIES" :key="p" :value="p">{{ p }}</option>
      </select>
      <label class="flex items-center gap-1 text-sm text-ink">
        <input type="checkbox" v-model="topic.revealedToPlayers" class="h-4 w-4 accent-gold" /> Revealed
      </label>
    </div>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Deadline</p>
      <WorldDateEditor v-if="calendar" v-model="topic.deadline" :calendar="calendar" />
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Description</label>
      <textarea
        v-model="topic.description"
        rows="3"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">DM Notes</label>
      <textarea
        v-model="topic.dmNotes"
        rows="3"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Reward</label>
      <input
        v-model="topic.reward"
        placeholder="What's gained by resolving this…"
        class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Consequences (if ignored)</label>
      <textarea
        v-model="topic.consequences"
        rows="2"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Linked Entities</p>
      <EntityLinkList v-model="topic.linkedEntityIds" :options="linkedOptions" />
    </div>
  </div>
</template>
