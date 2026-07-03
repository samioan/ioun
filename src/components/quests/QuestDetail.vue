<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { PhLock, PhPlus, PhTrash, PhWarning } from '@phosphor-icons/vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { useNPCStore } from '@/stores/npcs'
import { useFactionStore } from '@/stores/factions'
import { useWorldStore } from '@/stores/world'
import { usePlayerStore } from '@/stores/players'
import { useQuestsStore } from '@/stores/quests'
import { useTopicsStore } from '@/stores/topics'
import { useCampaignStore } from '@/stores/campaign'
import { compareWorldDate } from '@/utils/worldDate'
import { newId } from '@/utils/id'
import type { Quest, QuestReward } from '@/types'

const props = defineProps<{ quest: Quest }>()

const npcStore = useNPCStore()
const factionStore = useFactionStore()
const worldStore = useWorldStore()
const playerStore = usePlayerStore()
const questsStore = useQuestsStore()
const topicsStore = useTopicsStore()
const campaignStore = useCampaignStore()

const TYPES: Quest['type'][] = ['main', 'side', 'personal', 'faction', 'bounty', 'exploration', 'custom']
const STATUSES: Quest['status'][] = ['available', 'active', 'completed', 'failed', 'abandoned']
const PRIORITIES: Quest['priority'][] = ['low', 'medium', 'high', 'urgent']
const REWARD_TYPES: QuestReward['type'][] = ['gold', 'item', 'xp', 'reputation', 'information', 'favor', 'custom']

const npcOptions = computed(() => Object.values(npcStore.items).map((n) => ({ id: n.id, label: n.name })))
const factionOptions = computed(() => Object.values(factionStore.items).map((f) => ({ id: f.id, label: f.name })))
const landmarkOptions = computed(() => Object.values(worldStore.items).map((l) => ({ id: l.id, label: l.name })))
const questOptions = computed(() =>
  Object.values(questsStore.items)
    .filter((q) => q.id !== props.quest.id)
    .map((q) => ({ id: q.id, label: q.title })),
)
const topicOptions = computed(() => Object.values(topicsStore.items).map((t) => ({ id: t.id, label: t.title })))

const giverNpcLink = computed<string[]>({
  get: () => (props.quest.giverNpcId ? [props.quest.giverNpcId] : []),
  set: (v) => {
    props.quest.giverNpcId = v[0]
  },
})
const giverFactionLink = computed<string[]>({
  get: () => (props.quest.giverFactionId ? [props.quest.giverFactionId] : []),
  set: (v) => {
    props.quest.giverFactionId = v[0]
  },
})
const followUpLink = computed<string[]>({
  get: () => (props.quest.followUpQuestId ? [props.quest.followUpQuestId] : []),
  set: (v) => {
    props.quest.followUpQuestId = v[0]
  },
})

function addObjective() {
  props.quest.objectives.push({
    id: newId(),
    description: '',
    isComplete: false,
    isOptional: false,
    isSecret: false,
    linkedEntityIds: [],
  })
}
function removeObjective(id: string) {
  const index = props.quest.objectives.findIndex((o) => o.id === id)
  if (index !== -1) props.quest.objectives.splice(index, 1)
}

function addReward() {
  props.quest.rewards.push({ type: 'xp', description: '', isAwarded: false })
}
function removeReward(index: number) {
  props.quest.rewards.splice(index, 1)
}

function updateDeadline(field: 'year' | 'month' | 'day', value: string) {
  const num = Number(value)
  if (Number.isNaN(num)) return
  if (!props.quest.deadline) props.quest.deadline = { year: 1, month: 1, day: 1 }
  props.quest.deadline[field] = num
}
function clearDeadline() {
  props.quest.deadline = undefined
}

const isOverdue = computed(() => {
  if (!props.quest.deadline) return false
  const campaign = campaignStore.getActive()
  if (!campaign) return false
  return compareWorldDate(props.quest.deadline, campaign.currentWorldDate) <= 0
})

// Quick Complete surfaces the XP mini-form inline (same amount+reason
// pattern as AwardXPDialog) rather than a separate modal.
const showXpForm = ref(false)
const xpDraft = reactive({ amount: '', reason: '' })

function quickComplete() {
  props.quest.status = 'completed'
  showXpForm.value = true
}

function awardXp() {
  const amount = Number(xpDraft.amount)
  if (Number.isNaN(amount) || amount === 0) return
  for (const player of Object.values(playerStore.items)) {
    player.experiencePoints += amount
    player.xpLog.push({
      id: newId(),
      amount,
      reason: xpDraft.reason.trim() || `Quest: ${props.quest.title}`,
      timestamp: new Date().toISOString(),
    })
  }
  for (const reward of props.quest.rewards) {
    if (reward.type === 'xp') reward.isAwarded = true
  }
  xpDraft.amount = ''
  xpDraft.reason = ''
  showXpForm.value = false
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div>
      <input
        v-model="quest.title"
        placeholder="Quest Title"
        class="w-full bg-transparent font-display text-xl text-gold outline-none"
      />
      <div class="mt-2 flex flex-wrap gap-2">
        <select v-model="quest.type" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment">
          <option v-for="t in TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="quest.status" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment">
          <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
        </select>
        <select v-model="quest.priority" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment">
          <option v-for="p in PRIORITIES" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
    </div>

    <label class="flex items-center gap-2 text-xs text-ink">
      <input type="checkbox" v-model="quest.isSecret" class="h-4 w-4 accent-gold" /> Secret (hidden from players)
    </label>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Description</label>
      <textarea
        v-model="quest.description"
        rows="3"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div>
      <label class="mb-1 flex items-center gap-1 text-xs uppercase tracking-wide text-ink">
        <PhLock :size="12" /> DM Notes
      </label>
      <textarea
        v-model="quest.dmNotes"
        rows="3"
        class="w-full rounded-md border border-crimson/40 bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-crimson"
      />
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Giver (NPC)</p>
        <EntityLinkList v-model="giverNpcLink" :options="npcOptions" :max="1" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Giver (Faction)</p>
        <EntityLinkList v-model="giverFactionLink" :options="factionOptions" :max="1" />
      </div>
    </div>

    <div>
      <p class="mb-2 text-xs uppercase tracking-wide text-ink">Objectives</p>
      <div v-for="objective in quest.objectives" :key="objective.id" class="mb-1 flex items-center gap-2">
        <input type="checkbox" v-model="objective.isComplete" class="h-4 w-4 shrink-0 accent-gold" />
        <input
          v-model="objective.description"
          placeholder="Objective…"
          class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
        />
        <PhLock v-if="objective.isSecret" :size="12" class="shrink-0 text-ink" />
        <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeObjective(objective.id)">
          <PhTrash :size="14" />
        </button>
      </div>
      <button
        type="button"
        class="tap-target flex items-center gap-2 text-sm text-gold hover:text-gold-dim"
        @click="addObjective"
      >
        <PhPlus :size="14" /> Add objective
      </button>
    </div>

    <div>
      <p class="mb-2 text-xs uppercase tracking-wide text-ink">Rewards</p>
      <div v-for="(reward, index) in quest.rewards" :key="index" class="mb-1 flex items-center gap-2">
        <select v-model="reward.type" class="shrink-0 rounded-md border border-border bg-slate px-1 py-1 text-xs text-ink">
          <option v-for="t in REWARD_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
        <input
          v-model="reward.description"
          placeholder="Reward…"
          class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
        />
        <label class="flex shrink-0 items-center gap-1 text-xs text-ink">
          <input type="checkbox" v-model="reward.isAwarded" class="h-4 w-4 accent-emerald" /> Awarded
        </label>
        <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeReward(index)">
          <PhTrash :size="14" />
        </button>
      </div>
      <button
        type="button"
        class="tap-target flex items-center gap-2 text-sm text-gold hover:text-gold-dim"
        @click="addReward"
      >
        <PhPlus :size="14" /> Add reward
      </button>
    </div>

    <div>
      <p class="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-ink">
        Deadline
        <PhWarning v-if="isOverdue" size="12" class="text-crimson" />
        <span v-if="isOverdue" class="text-crimson">overdue</span>
      </p>
      <div class="flex items-center gap-2">
        <input
          type="number"
          placeholder="Year"
          :value="quest.deadline?.year ?? ''"
          class="w-20 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          @change="updateDeadline('year', ($event.target as HTMLInputElement).value)"
        />
        <input
          type="number"
          placeholder="Month"
          :value="quest.deadline?.month ?? ''"
          class="w-20 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          @change="updateDeadline('month', ($event.target as HTMLInputElement).value)"
        />
        <input
          type="number"
          placeholder="Day"
          :value="quest.deadline?.day ?? ''"
          class="w-20 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          @change="updateDeadline('day', ($event.target as HTMLInputElement).value)"
        />
        <button v-if="quest.deadline" type="button" class="tap-target text-xs text-ink hover:text-crimson" @click="clearDeadline">
          Clear
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Linked NPCs</p>
        <EntityLinkList v-model="quest.linkedNpcIds" :options="npcOptions" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Linked Landmarks</p>
        <EntityLinkList v-model="quest.linkedLandmarkIds" :options="landmarkOptions" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Linked Topics</p>
        <EntityLinkList v-model="quest.linkedTopicIds" :options="topicOptions" />
      </div>
    </div>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Follow-up Quest</p>
      <EntityLinkList v-model="followUpLink" :options="questOptions" :max="1" />
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Consequences</label>
      <textarea
        v-model="quest.consequences"
        rows="2"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <Button v-if="quest.status !== 'completed'" label="Quick Complete" @click="quickComplete" />

    <div v-if="showXpForm" class="flex flex-col gap-2 rounded-md border border-gold-dim bg-slate p-3">
      <p class="text-sm text-gold">Award XP to all players</p>
      <InputText v-model="xpDraft.amount" type="number" placeholder="250" />
      <InputText v-model="xpDraft.reason" placeholder="Reason (optional)" />
      <Button label="Award" @click="awardXp" />
    </div>
  </div>
</template>
