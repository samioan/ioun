<script setup lang="ts">
import { computed, reactive } from 'vue'
import { PhPlus, PhTrash, PhX } from '@phosphor-icons/vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { useFactionStore } from '@/stores/factions'
import { useWorldStore } from '@/stores/world'
import { useNPCStore } from '@/stores/npcs'
import { newId } from '@/utils/id'
import type { NPC, ConversationEntry } from '@/types'

const props = defineProps<{ npc: NPC }>()
const emit = defineEmits<{ remove: [] }>()

const factionStore = useFactionStore()
const worldStore = useWorldStore()
const npcStore = useNPCStore()

const NARRATIVE_FIELDS = ['description', 'appearance', 'personality', 'motivation'] as const
const DISPOSITIONS: NPC['disposition'][] = ['friendly', 'neutral', 'hostile', 'unknown']
const IMPORTANCE_LEVELS: NPC['importanceLevel'][] = ['minor', 'supporting', 'major', 'key']
const CONVO_IMPORTANCE: ConversationEntry['importance'][] = ['low', 'medium', 'high', 'critical']

const factionOptions = computed(() => Object.values(factionStore.items).map((f) => ({ id: f.id, label: f.name })))
const landmarkOptions = computed(() => Object.values(worldStore.items).map((l) => ({ id: l.id, label: l.name })))
const npcOptions = computed(() =>
  Object.values(npcStore.items)
    .filter((n) => n.id !== props.npc.id)
    .map((n) => ({ id: n.id, label: n.name })),
)
const relationshipOptions = computed(() => [...npcOptions.value, ...factionOptions.value])

const factionLink = computed<string[]>({
  get: () => (props.npc.factionId ? [props.npc.factionId] : []),
  set: (v) => {
    props.npc.factionId = v[0]
  },
})
const locationLink = computed<string[]>({
  get: () => (props.npc.locationId ? [props.npc.locationId] : []),
  set: (v) => {
    props.npc.locationId = v[0]
  },
})

const relationshipIds = computed(() => Object.keys(props.npc.relationshipMap))

function relationshipLabel(id: string): string {
  return relationshipOptions.value.find((o) => o.id === id)?.label ?? 'Unknown'
}

function addRelationship(id: string) {
  props.npc.relationshipMap[id] = ''
}

function removeRelationship(id: string) {
  delete props.npc.relationshipMap[id]
}

function addAlias() {
  props.npc.aliases.push('')
}
function removeAlias(index: number) {
  props.npc.aliases.splice(index, 1)
}

function addTag() {
  props.npc.tags.push('')
}
function removeTag(index: number) {
  props.npc.tags.splice(index, 1)
}

const convoDraft = reactive<{ summary: string; importance: ConversationEntry['importance'] }>({
  summary: '',
  importance: 'low',
})

const conversations = computed(() => [...props.npc.conversationLog].reverse())

function addConversation() {
  if (!convoDraft.summary.trim()) return
  props.npc.conversationLog.push({
    id: newId(),
    sessionId: '',
    timestamp: new Date().toISOString(),
    summary: convoDraft.summary.trim(),
    participants: [],
    importance: convoDraft.importance,
    openThreads: [],
  })
  convoDraft.summary = ''
}

function removeConversation(id: string) {
  const index = props.npc.conversationLog.findIndex((c) => c.id === id)
  if (index !== -1) props.npc.conversationLog.splice(index, 1)
}

function addOpenThread(entryId: string) {
  const entry = props.npc.conversationLog.find((c) => c.id === entryId)
  if (entry) {
    if (!entry.openThreads) entry.openThreads = []
    entry.openThreads.push('')
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1">
        <input
          v-model="npc.name"
          placeholder="NPC Name"
          class="w-full bg-transparent font-display text-2xl text-gold outline-none"
        />
        <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <input
            v-model="npc.role"
            placeholder="Role"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <input
            v-model="npc.occupation"
            placeholder="Occupation"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <select v-model="npc.disposition" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment">
            <option v-for="d in DISPOSITIONS" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
      </div>
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="emit('remove')">
        <PhTrash :size="18" />
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-4 text-sm text-ink">
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="npc.isAlive" class="h-4 w-4 accent-gold" /> Alive
      </label>
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="npc.isRecurring" class="h-4 w-4 accent-gold" /> Recurring
      </label>
      <label class="flex items-center gap-2">
        Importance
        <select v-model="npc.importanceLevel" class="rounded-md border border-border bg-slate px-2 py-1 text-parchment">
          <option v-for="level in IMPORTANCE_LEVELS" :key="level" :value="level">{{ level }}</option>
        </select>
      </label>
    </div>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Aliases</p>
      <div v-for="(_alias, index) in npc.aliases" :key="index" class="mb-1 flex items-center gap-2">
        <input
          v-model="npc.aliases[index]"
          class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
        />
        <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeAlias(index)">
          <PhTrash :size="14" />
        </button>
      </div>
      <button type="button" class="tap-target text-sm text-gold hover:text-gold-dim" @click="addAlias">
        + Add alias
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Faction</p>
        <EntityLinkList v-model="factionLink" :options="factionOptions" :max="1" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Location</p>
        <EntityLinkList v-model="locationLink" :options="landmarkOptions" :max="1" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div v-for="field in NARRATIVE_FIELDS" :key="field">
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">{{ field }}</label>
        <textarea
          v-model="npc[field]"
          rows="3"
          class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
        />
      </div>
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Secret Info (DM only)</label>
      <textarea
        v-model="npc.secretInfo"
        rows="3"
        class="w-full rounded-md border border-crimson/40 bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-crimson"
      />
    </div>

    <div>
      <p class="mb-2 font-display text-lg text-gold">Conversation Log</p>
      <div class="mb-2 flex items-center gap-2">
        <input
          v-model="convoDraft.summary"
          placeholder="What was said…"
          class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          @keydown.enter="addConversation"
        />
        <select v-model="convoDraft.importance" class="shrink-0 rounded-md border border-border bg-slate px-2 py-1 text-xs text-ink">
          <option v-for="level in CONVO_IMPORTANCE" :key="level" :value="level">{{ level }}</option>
        </select>
        <button type="button" class="tap-target shrink-0 text-gold hover:text-gold-dim" @click="addConversation">
          <PhPlus :size="16" />
        </button>
      </div>
      <p v-if="conversations.length === 0" class="text-sm text-ink">No conversations logged yet.</p>
      <div v-for="entry in conversations" :key="entry.id" class="mb-2 rounded-md border border-border p-2">
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm text-parchment">{{ entry.summary }}</p>
          <button type="button" class="tap-target shrink-0 text-ink hover:text-crimson" @click="removeConversation(entry.id)">
            <PhTrash :size="14" />
          </button>
        </div>
        <p class="text-xs text-ink">{{ entry.importance }}</p>
        <div class="mt-1 flex flex-wrap items-center gap-1">
          <span
            v-for="(_thread, threadIndex) in entry.openThreads"
            :key="threadIndex"
            class="rounded-full border border-gold-dim px-2 py-0.5 text-xs text-parchment"
          >
            <input
              v-model="entry.openThreads![threadIndex]"
              class="w-24 bg-transparent outline-none"
              placeholder="open thread…"
            />
          </span>
          <button type="button" class="text-xs text-gold hover:text-gold-dim" @click="addOpenThread(entry.id)">
            + thread
          </button>
        </div>
      </div>
    </div>

    <div>
      <p class="mb-2 font-display text-lg text-gold">Relationships</p>
      <EntityLinkList
        :model-value="relationshipIds"
        :options="relationshipOptions"
        @add="addRelationship"
        @remove="removeRelationship"
      />
      <div v-if="relationshipIds.length" class="mt-2 flex flex-col gap-1">
        <div v-for="id in relationshipIds" :key="id" class="flex items-center gap-2">
          <span class="w-32 shrink-0 truncate text-xs text-ink">{{ relationshipLabel(id) }}</span>
          <input
            v-model="npc.relationshipMap[id]"
            placeholder="Relationship note…"
            class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
        </div>
      </div>
    </div>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Tags</p>
      <div class="flex flex-wrap items-center gap-2">
        <div
          v-for="(_tag, index) in npc.tags"
          :key="index"
          class="flex items-center gap-1 rounded-full border border-border bg-slate px-2 py-0.5 text-xs text-parchment"
        >
          <input v-model="npc.tags[index]" class="w-16 bg-transparent outline-none" />
          <button type="button" class="text-ink hover:text-crimson" @click="removeTag(index)">
            <PhX :size="10" />
          </button>
        </div>
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="addTag">
          + Add tag
        </button>
      </div>
    </div>
  </div>
</template>
