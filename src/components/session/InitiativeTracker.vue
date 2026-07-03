<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import { PhPlus } from '@phosphor-icons/vue'
import { usePlayerStore } from '@/stores/players'
import { useEnemyStore } from '@/stores/enemies'
import { useSidePanel } from '@/composables/useSidePanel'
import { ensureActiveEncounter, resortInitiative } from '@/utils/combat'
import InitiativeEntryRow from './InitiativeEntryRow.vue'
import InitiativeEntryDetail from './InitiativeEntryDetail.vue'
import AddCombatantDialog from './AddCombatantDialog.vue'
import type { Session, InitiativeEntry, CombatEncounter } from '@/types'

const props = defineProps<{ session: Session }>()

const playerStore = usePlayerStore()
const enemyStore = useEnemyStore()
const sidePanel = useSidePanel()

const showAddEnemy = ref(false)

const encounter = ref<CombatEncounter>(ensureActiveEncounter(props.session))

onMounted(() => {
  encounter.value = ensureActiveEncounter(props.session)
})

const currentEntry = computed(() => encounter.value.initiativeOrder[encounter.value.currentTurnIndex])

function resolveName(entry: InitiativeEntry): string {
  if (entry.entityType === 'player') return playerStore.getById(entry.entityId)?.name ?? 'Unknown Player'
  if (entry.entityType === 'enemy') return enemyStore.getById(entry.entityId)?.name ?? 'Unknown Enemy'
  return 'Unknown NPC'
}

function resort() {
  resortInitiative(encounter.value)
}

function nextTurn() {
  const order = encounter.value.initiativeOrder
  if (order.length === 0) return
  order[encounter.value.currentTurnIndex].hasActed = true
  const next = encounter.value.currentTurnIndex + 1
  if (next >= order.length) {
    encounter.value.currentTurnIndex = 0
    encounter.value.round += 1
    order.forEach((entry) => (entry.hasActed = false))
  } else {
    encounter.value.currentTurnIndex = next
  }
}

function prevTurn() {
  const order = encounter.value.initiativeOrder
  if (order.length === 0) return
  encounter.value.currentTurnIndex =
    encounter.value.currentTurnIndex === 0 ? order.length - 1 : encounter.value.currentTurnIndex - 1
}

function endCombat() {
  encounter.value.status = 'completed'
  encounter.value = ensureActiveEncounter(props.session)
}

const availablePlayers = computed(() =>
  props.session.attendingPlayerIds
    .map((id) => playerStore.getById(id))
    .filter(
      (p): p is NonNullable<typeof p> =>
        !!p && !encounter.value.initiativeOrder.some((e) => e.entityType === 'player' && e.entityId === p.id),
    ),
)

function addAttendingPlayer(playerId: string) {
  const player = playerStore.getById(playerId)
  if (!player) return
  const entry: InitiativeEntry = {
    entityId: player.id,
    entityType: 'player',
    initiative: 10,
    hasActed: false,
    conditions: [...player.conditions],
    healthCurrent: player.health.current,
    healthMax: player.health.max,
    healthTemp: player.health.temp,
    derivedStats: player.derivedStats,
    isHidden: false,
    actionPools: {},
    notes: '',
  }
  encounter.value.initiativeOrder.push(entry)
  resort()
}

function onPlayerSelect(event: Event) {
  const select = event.target as HTMLSelectElement
  if (select.value) addAttendingPlayer(select.value)
  select.value = ''
}

function addEnemyEntry(entry: InitiativeEntry) {
  encounter.value.initiativeOrder.push(entry)
  resort()
}

// Dual-write: keep this combat's snapshot AND the permanent Player/Enemy
// record in sync. Also re-syncs healthMax/healthTemp from the live source
// (not just healthCurrent) so the snapshot self-heals if max HP changed
// since this entry was added — otherwise HPBar's clamp bound could go
// stale and write a wrong absolute value into the permanent record.
function handleHpChange(entry: InitiativeEntry, value: number) {
  entry.healthCurrent = value
  if (entry.entityType === 'player') {
    const player = playerStore.getById(entry.entityId)
    if (player) {
      player.health.current = value
      entry.healthMax = player.health.max
      entry.healthTemp = player.health.temp
    }
  } else if (entry.entityType === 'enemy') {
    const enemy = enemyStore.getById(entry.entityId)
    if (enemy) {
      enemy.health.current = value
      entry.healthMax = enemy.health.max
    }
  }
}

function handleConditionsChange(entry: InitiativeEntry, conditions: string[]) {
  entry.conditions = conditions
  if (entry.entityType === 'player') {
    const player = playerStore.getById(entry.entityId)
    if (player) player.conditions = conditions
  } else if (entry.entityType === 'enemy') {
    const enemy = enemyStore.getById(entry.entityId)
    if (enemy) enemy.conditions = conditions
  }
}

function viewDetail(entry: InitiativeEntry) {
  const name = resolveName(entry)
  sidePanel.push({ title: name, component: InitiativeEntryDetail, props: { entry, name } })
}

// Duplicating a player doesn't make sense (same character can't act twice);
// the row hides this option for player entries. Duplicating an enemy clones
// a NEW Enemy record (not the same entityId) so each copy has independent
// HP — sharing entityId would make two "goblins" secretly share one health.
function duplicateEntry(entry: InitiativeEntry) {
  if (entry.entityType !== 'enemy') return
  const source = enemyStore.getById(entry.entityId)
  if (!source) return
  const clone = enemyStore.add({ ...source, name: `${source.name} (copy)` })
  const copy: InitiativeEntry = { ...entry, entityId: clone.id }
  encounter.value.initiativeOrder.push(copy)
  resort()
}

function removeEntry(entry: InitiativeEntry) {
  const index = encounter.value.initiativeOrder.indexOf(entry)
  if (index !== -1) {
    encounter.value.initiativeOrder.splice(index, 1)
    encounter.value.currentTurnIndex = Math.min(
      encounter.value.currentTurnIndex,
      Math.max(0, encounter.value.initiativeOrder.length - 1),
    )
  }
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2">
      <span class="font-mono text-sm text-parchment">Round {{ encounter.round }}</span>
      <div class="flex items-center gap-2">
        <Button label="← Prev Turn" class="!bg-transparent !text-ink hover:!text-gold" @click="prevTurn" />
        <Button label="Next Turn →" @click="nextTurn" />
      </div>
      <Button label="End Combat" class="!bg-transparent !text-crimson hover:!text-crimson" @click="endCombat" />
    </div>

    <div class="flex-1 overflow-y-auto p-2">
      <InitiativeEntryRow
        v-for="entry in encounter.initiativeOrder"
        :key="entry.entityId"
        :entry="entry"
        :name="resolveName(entry)"
        :is-active="entry === currentEntry"
        @update:hp="(v) => handleHpChange(entry, v)"
        @update:conditions="(v) => handleConditionsChange(entry, v)"
        @view-detail="viewDetail(entry)"
        @duplicate="duplicateEntry(entry)"
        @remove="removeEntry(entry)"
      />
      <p v-if="encounter.initiativeOrder.length === 0" class="p-4 text-center text-sm text-ink">
        No combatants yet.
      </p>
    </div>

    <div class="flex items-center gap-2 border-t border-border p-2">
      <select
        v-if="availablePlayers.length"
        class="tap-target rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment"
        @change="onPlayerSelect"
      >
        <option value="" disabled selected>+ Add player…</option>
        <option v-for="p in availablePlayers" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <button
        type="button"
        class="tap-target flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-ink hover:border-gold hover:text-gold"
        @click="showAddEnemy = true"
      >
        <PhPlus :size="14" /> Add Enemy
      </button>
    </div>

    <AddCombatantDialog v-model:visible="showAddEnemy" @add="addEnemyEntry" />
  </div>
</template>
