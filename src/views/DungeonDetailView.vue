<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Button from 'primevue/button'
import { PhCaretLeft } from '@phosphor-icons/vue'
import { useDungeonStore } from '@/stores/dungeons'
import { useBestiaryStore } from '@/stores/bestiary'
import { useEnemyStore } from '@/stores/enemies'
import { useSessionStore } from '@/stores/session'
import { useSessionMode } from '@/composables/useSessionMode'
import { cloneBestiaryEntryToEnemy } from '@/utils/bestiary'
import { ensureActiveEncounter, buildEnemyInitiativeEntry, resortInitiative } from '@/utils/combat'
import { createDefaultDungeonRoom } from '@/utils/defaults'
import { newId } from '@/utils/id'
import PageHeader from '@/components/layout/PageHeader.vue'
import RoomGraph from '@/components/dungeons/RoomGraph.vue'
import RoomDetail from '@/components/dungeons/RoomDetail.vue'

const route = useRoute()
const dungeonStore = useDungeonStore()
const bestiaryStore = useBestiaryStore()
const enemyStore = useEnemyStore()
const sessionStore = useSessionStore()
const { isPlaying, activeSessionId } = useSessionMode()

const dungeon = computed(() => dungeonStore.getById(String(route.params.id)))

const selected = ref<{ type: 'room' | 'connection'; id: string } | null>(null)

const roomCount = computed(() => dungeon.value?.rooms.length ?? 0)
const exploredCount = computed(() => dungeon.value?.rooms.filter((r) => r.isExplored).length ?? 0)
const progress = computed(() => (roomCount.value === 0 ? 0 : Math.round((exploredCount.value / roomCount.value) * 100)))

function addRoom() {
  if (!dungeon.value) return
  const index = dungeon.value.rooms.length
  const room = {
    id: newId(),
    ...createDefaultDungeonRoom({
      dungeonId: dungeon.value.id,
      number: index + 1,
      x: (index % 4) * 140 + 80,
      y: Math.floor(index / 4) * 140 + 80,
    }),
  }
  dungeon.value.rooms.push(room)
  selected.value = { type: 'room', id: room.id }
}

const canRunDungeon = computed(() => isPlaying.value && !!activeSessionId.value)

// Same spawn pipeline as RoomDetail.vue's "Launch to Session" per-encounter
// button, applied across every unused encounter in the whole dungeon.
function runDungeon() {
  if (!dungeon.value || !canRunDungeon.value || !activeSessionId.value) return
  const session = sessionStore.getById(activeSessionId.value)
  if (!session) return
  const combatEncounter = ensureActiveEncounter(session)
  for (const room of dungeon.value.rooms) {
    for (const encounter of room.encounters) {
      if (encounter.isUsed) continue
      for (const line of encounter.enemies) {
        const template = bestiaryStore.getById(line.templateId)
        if (!template) continue
        for (let i = 0; i < line.count; i++) {
          const enemy = enemyStore.add(cloneBestiaryEntryToEnemy(template))
          combatEncounter.initiativeOrder.push(buildEnemyInitiativeEntry(enemy))
        }
      }
      encounter.isUsed = true
    }
  }
  resortInitiative(combatEncounter)
}
</script>

<template>
  <div v-if="!dungeon" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <p class="text-ink">Dungeon not found.</p>
    <RouterLink to="/dungeons" class="text-sm text-gold underline">Back to Dungeon Planner</RouterLink>
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader :title="dungeon.name || 'Unnamed Dungeon'">
      <template #actions>
        <RouterLink to="/dungeons" class="tap-target flex items-center gap-1 text-sm text-ink hover:text-gold">
          <PhCaretLeft :size="16" /> All Dungeons
        </RouterLink>
        <Button
          label="Run this Dungeon"
          class="!bg-transparent !text-gold hover:!text-gold-dim"
          :disabled="!canRunDungeon"
          :title="canRunDungeon ? '' : 'Begin a session to run this dungeon'"
          @click="runDungeon"
        />
        <Button label="Add Room" @click="addRoom" />
      </template>
    </PageHeader>

    <div class="flex items-center gap-3 border-b border-border px-6 py-2 text-xs text-ink">
      <input v-model="dungeon.name" placeholder="Dungeon Name" class="bg-transparent font-display text-sm text-parchment outline-none" />
      <span>{{ exploredCount }}/{{ roomCount }} rooms explored</span>
      <div class="h-1.5 w-32 overflow-hidden rounded-full bg-slate">
        <div class="h-full bg-gold" :style="{ width: progress + '%' }" />
      </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <div class="flex-1 overflow-hidden">
        <RoomGraph
          :dungeon="dungeon"
          :selected="selected"
          @select-room="(id) => (selected = { type: 'room', id })"
          @select-connection="(id) => (selected = { type: 'connection', id })"
        />
      </div>
      <div class="w-[380px] shrink-0 border-l border-border">
        <RoomDetail :dungeon="dungeon" :selected="selected" @clear-selection="selected = null" />
      </div>
    </div>
  </div>
</template>
