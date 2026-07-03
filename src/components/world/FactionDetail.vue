<script setup lang="ts">
import { computed } from 'vue'
import { PhTrash } from '@phosphor-icons/vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { useNPCStore } from '@/stores/npcs'
import { useFactionStore } from '@/stores/factions'
import { usePlayerStore } from '@/stores/players'
import type { Faction } from '@/types'

type PlayerRelationship = Faction['playerRelationship'][string]

const props = defineProps<{ faction: Faction }>()
const emit = defineEmits<{ remove: [] }>()

const npcStore = useNPCStore()
const factionStore = useFactionStore()
const playerStore = usePlayerStore()

const TEXT_FIELDS = ['goals', 'methods', 'secrets'] as const
const RELATIONSHIP_LEVELS: PlayerRelationship[] = ['allied', 'friendly', 'neutral', 'hostile', 'enemy']

const npcOptions = computed(() => Object.values(npcStore.items).map((n) => ({ id: n.id, label: n.name })))
const otherFactionOptions = computed(() =>
  Object.values(factionStore.items)
    .filter((f) => f.id !== props.faction.id)
    .map((f) => ({ id: f.id, label: f.name })),
)

const players = computed(() => Object.values(playerStore.items))

function getReputation(playerId: string): number {
  return props.faction.reputationScore[playerId] ?? 0
}
function setReputation(playerId: string, value: number) {
  props.faction.reputationScore[playerId] = value
}
function getRelationship(playerId: string): PlayerRelationship {
  return props.faction.playerRelationship[playerId] ?? 'neutral'
}
function setRelationship(playerId: string, value: PlayerRelationship) {
  props.faction.playerRelationship[playerId] = value
}
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1">
        <input
          v-model="faction.name"
          placeholder="Faction Name"
          class="w-full bg-transparent font-display text-2xl text-gold outline-none"
        />
        <div class="mt-2 grid grid-cols-2 gap-2">
          <input
            v-model="faction.type"
            placeholder="Type"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <input
            v-model="faction.alignment"
            placeholder="Alignment"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
        </div>
      </div>
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="emit('remove')">
        <PhTrash :size="18" />
      </button>
    </div>

    <label class="flex items-center gap-2 text-sm text-ink">
      <input type="checkbox" v-model="faction.isSecret" class="h-4 w-4 accent-gold" /> Secret faction (hidden from
      players)
    </label>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Description</label>
      <textarea
        v-model="faction.description"
        rows="2"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="field in TEXT_FIELDS" :key="field">
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">{{ field }}</label>
        <textarea
          v-model="faction[field]"
          rows="3"
          class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Members</p>
        <EntityLinkList v-model="faction.memberIds" :options="npcOptions" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Leaders</p>
        <EntityLinkList v-model="faction.leaderIds" :options="npcOptions" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Allied Factions</p>
        <EntityLinkList v-model="faction.alliedFactionIds" :options="otherFactionOptions" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Enemy Factions</p>
        <EntityLinkList v-model="faction.enemyFactionIds" :options="otherFactionOptions" />
      </div>
    </div>

    <div>
      <p class="mb-2 font-display text-lg text-gold">Player Standing</p>
      <p v-if="players.length === 0" class="text-sm text-ink">No players yet.</p>
      <div v-for="player in players" :key="player.id" class="mb-2 flex items-center gap-3">
        <span class="w-24 shrink-0 truncate text-sm text-parchment">{{ player.name }}</span>
        <select
          :value="getRelationship(player.id)"
          class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-ink"
          @change="setRelationship(player.id, ($event.target as HTMLSelectElement).value as PlayerRelationship)"
        >
          <option v-for="level in RELATIONSHIP_LEVELS" :key="level" :value="level">{{ level }}</option>
        </select>
        <input
          type="number"
          :value="getReputation(player.id)"
          class="w-20 rounded-md border border-border bg-obsidian px-2 py-1 text-center font-mono text-xs text-parchment outline-none"
          @change="setReputation(player.id, Number(($event.target as HTMLInputElement).value))"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Notoriety</label>
        <input
          type="number"
          v-model.number="faction.notoriety"
          class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Resources</label>
        <input
          v-model="faction.resources"
          class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none"
        />
      </div>
    </div>
  </div>
</template>
