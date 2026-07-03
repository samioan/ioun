<script setup lang="ts">
import { computed } from 'vue'
import { PhPlus, PhTrash, PhPlayCircle } from '@phosphor-icons/vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { useWorldStore } from '@/stores/world'
import { useFactionStore } from '@/stores/factions'
import { useLootStore } from '@/stores/loot'
import { useNPCStore } from '@/stores/npcs'
import { useBestiaryStore } from '@/stores/bestiary'
import { useEnemyStore } from '@/stores/enemies'
import { useSessionStore } from '@/stores/session'
import { useSessionMode } from '@/composables/useSessionMode'
import { cloneBestiaryEntryToEnemy } from '@/utils/bestiary'
import { ensureActiveEncounter, buildEnemyInitiativeEntry, resortInitiative } from '@/utils/combat'
import { createDefaultDungeonTrap, createDefaultPreparedEncounter } from '@/utils/defaults'
import { newId } from '@/utils/id'
import type { Dungeon, DungeonRoom, PreparedEncounter } from '@/types'

const props = defineProps<{ dungeon: Dungeon; selected: { type: 'room' | 'connection'; id: string } | null }>()
const emit = defineEmits<{ 'clear-selection': [] }>()

const worldStore = useWorldStore()
const factionStore = useFactionStore()
const lootStore = useLootStore()
const npcStore = useNPCStore()
const bestiaryStore = useBestiaryStore()
const enemyStore = useEnemyStore()
const sessionStore = useSessionStore()
const { isPlaying, activeSessionId } = useSessionMode()

const ROOM_TYPES: DungeonRoom['type'][] = [
  'entrance',
  'corridor',
  'chamber',
  'boss',
  'trap',
  'puzzle',
  'rest',
  'secret',
  'exit',
  'custom',
]
const LIGHTING: DungeonRoom['lighting'][] = ['bright', 'dim', 'dark', 'magical']
const DIFFICULTIES: PreparedEncounter['difficulty'][] = ['trivial', 'easy', 'medium', 'hard', 'deadly', 'custom']
const CONNECTION_TYPES = [
  'door',
  'secret-door',
  'corridor',
  'stairs-up',
  'stairs-down',
  'ladder',
  'portal',
  'pit',
  'open',
] as const
const DUNGEON_TYPES: Dungeon['type'][] = [
  'dungeon',
  'cave',
  'ruins',
  'fortress',
  'tower',
  'sewer',
  'tomb',
  'planar',
  'custom',
]

const selectedRoom = computed(() =>
  props.selected?.type === 'room' ? props.dungeon.rooms.find((r) => r.id === props.selected!.id) : undefined,
)
const selectedConnection = computed(() =>
  props.selected?.type === 'connection'
    ? props.dungeon.connections.find((c) => c.id === props.selected!.id)
    : undefined,
)

const landmarkOptions = computed(() => Object.values(worldStore.items).map((l) => ({ id: l.id, label: l.name })))
const factionOptions = computed(() => Object.values(factionStore.items).map((f) => ({ id: f.id, label: f.name })))
const lootOptions = computed(() => Object.values(lootStore.items).map((i) => ({ id: i.id, label: i.name })))
const npcOptions = computed(() => Object.values(npcStore.items).map((n) => ({ id: n.id, label: n.name })))
const bestiaryEntries = computed(() =>
  Object.values(bestiaryStore.items).sort((a, b) => a.name.localeCompare(b.name)),
)

const linkedLandmark = computed<string[]>({
  get: () => (props.dungeon.linkedLandmarkId ? [props.dungeon.linkedLandmarkId] : []),
  set: (v) => {
    props.dungeon.linkedLandmarkId = v[0]
  },
})
const linkedFaction = computed<string[]>({
  get: () => (props.dungeon.factionId ? [props.dungeon.factionId] : []),
  set: (v) => {
    props.dungeon.factionId = v[0]
  },
})

function addTag() {
  props.dungeon.tags.push('')
}
function removeTag(index: number) {
  props.dungeon.tags.splice(index, 1)
}

function removeRoom() {
  const room = selectedRoom.value
  if (!room) return
  if (!window.confirm('Remove this room? Connections and traps tied to it will be removed too.')) return
  props.dungeon.connections = props.dungeon.connections.filter(
    (c) => c.fromRoomId !== room.id && c.toRoomId !== room.id,
  )
  props.dungeon.traps = props.dungeon.traps.filter((t) => t.roomId !== room.id)
  const index = props.dungeon.rooms.findIndex((r) => r.id === room.id)
  if (index !== -1) props.dungeon.rooms.splice(index, 1)
  emit('clear-selection')
}

function removeConnection() {
  const conn = selectedConnection.value
  if (!conn) return
  const index = props.dungeon.connections.findIndex((c) => c.id === conn.id)
  if (index !== -1) props.dungeon.connections.splice(index, 1)
  emit('clear-selection')
}

function addEncounter() {
  selectedRoom.value?.encounters.push({ id: newId(), ...createDefaultPreparedEncounter() })
}
function removeEncounter(id: string) {
  const room = selectedRoom.value
  if (!room) return
  const index = room.encounters.findIndex((e) => e.id === id)
  if (index !== -1) room.encounters.splice(index, 1)
}
function addEnemyLine(encounter: PreparedEncounter) {
  encounter.enemies.push({ templateId: '', count: 1, notes: '' })
}
function removeEnemyLine(encounter: PreparedEncounter, index: number) {
  encounter.enemies.splice(index, 1)
}

// Same clone -> spawn -> initiative-entry pipeline BestiaryView.vue's
// quickAddToEncounter() already uses — no new spawn logic, just looped
// per enemy line and multiplied by count.
const canLaunch = computed(() => isPlaying.value && !!activeSessionId.value)

function launchEncounter(encounter: PreparedEncounter) {
  if (!canLaunch.value || !activeSessionId.value) return
  const session = sessionStore.getById(activeSessionId.value)
  if (!session) return
  const combatEncounter = ensureActiveEncounter(session)
  for (const line of encounter.enemies) {
    const template = bestiaryStore.getById(line.templateId)
    if (!template) continue
    for (let i = 0; i < line.count; i++) {
      const enemy = enemyStore.add(cloneBestiaryEntryToEnemy(template))
      combatEncounter.initiativeOrder.push(buildEnemyInitiativeEntry(enemy))
    }
  }
  resortInitiative(combatEncounter)
  encounter.isUsed = true
}

const roomTraps = computed(() =>
  selectedRoom.value ? props.dungeon.traps.filter((t) => selectedRoom.value!.trapIds.includes(t.id)) : [],
)
function addTrap() {
  const room = selectedRoom.value
  if (!room) return
  const trap = { id: newId(), ...createDefaultDungeonTrap({ roomId: room.id }) }
  props.dungeon.traps.push(trap)
  room.trapIds.push(trap.id)
}
function removeTrap(id: string) {
  const room = selectedRoom.value
  if (!room) return
  const trapIndex = props.dungeon.traps.findIndex((t) => t.id === id)
  if (trapIndex !== -1) props.dungeon.traps.splice(trapIndex, 1)
  const idIndex = room.trapIds.indexOf(id)
  if (idIndex !== -1) room.trapIds.splice(idIndex, 1)
}
</script>

<template>
  <div class="flex h-full flex-col gap-5 overflow-y-auto p-4">
    <!-- Room selected -->
    <template v-if="selectedRoom">
      <div class="flex items-start justify-between gap-2">
        <input
          v-model="selectedRoom.name"
          placeholder="Room Name"
          class="w-full bg-transparent font-display text-lg text-gold outline-none"
        />
        <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeRoom">
          <PhTrash :size="16" />
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <label class="flex items-center gap-1 text-xs text-ink">
          #
          <input
            v-model.number="selectedRoom.number"
            type="number"
            class="w-14 rounded-md border border-border bg-slate px-1 py-1 text-parchment outline-none"
          />
        </label>
        <select v-model="selectedRoom.type" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment">
          <option v-for="t in ROOM_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="selectedRoom.lighting" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment">
          <option v-for="l in LIGHTING" :key="l" :value="l">{{ l }}</option>
        </select>
        <input
          v-model="selectedRoom.dimensions"
          placeholder="20ft × 30ft"
          class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none"
        />
      </div>

      <div class="flex flex-wrap items-center gap-3 text-xs text-ink">
        <label class="flex items-center gap-1">
          <input type="checkbox" v-model="selectedRoom.isExplored" class="h-4 w-4 accent-gold" /> Explored
        </label>
        <label class="flex items-center gap-1">
          <input type="checkbox" v-model="selectedRoom.isSecret" class="h-4 w-4 accent-gold" /> Secret
        </label>
      </div>

      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Description (players see)</label>
        <textarea v-model="selectedRoom.description" rows="2" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
      </div>
      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">DM Notes</label>
        <textarea v-model="selectedRoom.dmNotes" rows="2" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
      </div>
      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Secret Info</label>
        <textarea v-model="selectedRoom.secretInfo" rows="2" class="w-full rounded-md border border-crimson/40 bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-crimson" />
      </div>
      <div v-if="selectedRoom.type === 'puzzle'">
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Puzzle</label>
        <textarea v-model="selectedRoom.puzzleDescription" rows="2" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
      </div>

      <div>
        <div class="mb-2 flex items-center justify-between">
          <p class="font-display text-sm text-gold">Encounters</p>
          <button type="button" class="tap-target text-gold hover:text-gold-dim" @click="addEncounter">
            <PhPlus :size="14" />
          </button>
        </div>
        <div
          v-for="encounter in selectedRoom.encounters"
          :key="encounter.id"
          class="mb-2 flex flex-col gap-2 rounded-md border border-border p-2"
          :class="encounter.isUsed ? 'opacity-60' : ''"
        >
          <div class="flex items-center gap-2">
            <input v-model="encounter.name" placeholder="Encounter name" class="flex-1 bg-transparent text-sm text-parchment outline-none" />
            <select v-model="encounter.difficulty" class="rounded-md border border-border bg-slate px-1 py-0.5 text-xs text-parchment">
              <option v-for="d in DIFFICULTIES" :key="d" :value="d">{{ d }}</option>
            </select>
            <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeEncounter(encounter.id)">
              <PhTrash :size="12" />
            </button>
          </div>
          <div v-for="(enemy, index) in encounter.enemies" :key="index" class="flex items-center gap-2">
            <select v-model="enemy.templateId" class="min-w-0 flex-1 rounded-md border border-border bg-slate px-1 py-0.5 text-xs text-parchment">
              <option value="">Pick creature…</option>
              <option v-for="entry in bestiaryEntries" :key="entry.id" :value="entry.id">{{ entry.name }}</option>
            </select>
            <input v-model.number="enemy.count" type="number" min="1" class="w-12 shrink-0 rounded-md border border-border bg-slate px-1 py-0.5 text-center text-xs text-parchment outline-none" />
            <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeEnemyLine(encounter, index)">
              <PhTrash :size="12" />
            </button>
          </div>
          <button type="button" class="tap-target self-start text-xs text-gold hover:text-gold-dim" @click="addEnemyLine(encounter)">
            + Add creature
          </button>
          <button
            v-if="!encounter.isUsed"
            type="button"
            class="tap-target flex items-center justify-center gap-1 rounded-md border border-gold-dim py-1 text-xs text-gold disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="!canLaunch"
            :title="canLaunch ? '' : 'Begin a session to launch encounters'"
            @click="launchEncounter(encounter)"
          >
            <PhPlayCircle :size="14" /> Launch to Session
          </button>
          <p v-else class="text-xs text-ink">Already launched.</p>
        </div>
      </div>

      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Loot</p>
        <EntityLinkList v-model="selectedRoom.lootIds" :options="lootOptions" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">NPCs</p>
        <EntityLinkList v-model="selectedRoom.npcIds" :options="npcOptions" />
      </div>

      <div>
        <div class="mb-2 flex items-center justify-between">
          <p class="font-display text-sm text-gold">Traps</p>
          <button type="button" class="tap-target text-gold hover:text-gold-dim" @click="addTrap">
            <PhPlus :size="14" />
          </button>
        </div>
        <p v-if="roomTraps.length === 0" class="text-xs text-ink">No traps in this room.</p>
        <div v-for="trap in roomTraps" :key="trap.id" class="mb-2 flex flex-col gap-2 rounded-md border border-border p-2">
          <div class="flex items-center gap-2">
            <input v-model="trap.name" placeholder="Trap name" class="min-w-0 flex-1 bg-transparent text-sm text-parchment outline-none" />
            <input v-model="trap.type" placeholder="Type" class="w-20 shrink-0 rounded-md border border-border bg-slate px-1 py-0.5 text-xs text-parchment outline-none" />
            <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeTrap(trap.id)">
              <PhTrash :size="12" />
            </button>
          </div>
          <textarea v-model="trap.description" rows="2" placeholder="Description…" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none focus:border-gold" />
          <textarea v-model="trap.triggerDescription" rows="1" placeholder="Trigger…" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none focus:border-gold" />
          <textarea v-model="trap.effect" rows="1" placeholder="Effect…" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none focus:border-gold" />
          <div class="grid grid-cols-3 gap-2 text-xs">
            <label class="flex items-center gap-1 text-ink">DC <input v-model.number="trap.saveDC" type="number" class="w-full rounded-md border border-border bg-slate px-1 py-0.5 text-parchment outline-none" /></label>
            <input v-model="trap.saveStat" placeholder="Save stat" class="rounded-md border border-border bg-slate px-1 py-0.5 text-parchment outline-none" />
            <input v-model="trap.damage" placeholder="Damage" class="rounded-md border border-border bg-slate px-1 py-0.5 text-parchment outline-none" />
            <label class="flex items-center gap-1 text-ink">Detect <input v-model.number="trap.detectDC" type="number" class="w-full rounded-md border border-border bg-slate px-1 py-0.5 text-parchment outline-none" /></label>
            <label class="flex items-center gap-1 text-ink">Disable <input v-model.number="trap.disableDC" type="number" class="w-full rounded-md border border-border bg-slate px-1 py-0.5 text-parchment outline-none" /></label>
            <label class="flex items-center gap-1 text-ink">Atk <input v-model.number="trap.attackBonus" type="number" class="w-full rounded-md border border-border bg-slate px-1 py-0.5 text-parchment outline-none" /></label>
          </div>
          <div class="flex items-center gap-3 text-xs text-ink">
            <label class="flex items-center gap-1"><input type="checkbox" v-model="trap.isTriggered" class="h-3.5 w-3.5 accent-gold" /> Triggered</label>
            <label class="flex items-center gap-1"><input type="checkbox" v-model="trap.isDisarmed" class="h-3.5 w-3.5 accent-gold" /> Disarmed</label>
          </div>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Notes</label>
        <textarea v-model="selectedRoom.notes" rows="2" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
      </div>
    </template>

    <!-- Connection selected -->
    <template v-else-if="selectedConnection">
      <div class="flex items-center justify-between">
        <p class="font-display text-lg text-gold">Connection</p>
        <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeConnection">
          <PhTrash :size="16" />
        </button>
      </div>
      <select v-model="selectedConnection.type" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment">
        <option v-for="t in CONNECTION_TYPES" :key="t" :value="t">{{ t }}</option>
      </select>
      <div class="flex flex-wrap items-center gap-3 text-xs text-ink">
        <label class="flex items-center gap-1"><input type="checkbox" v-model="selectedConnection.isLocked" class="h-4 w-4 accent-gold" /> Locked</label>
        <label v-if="selectedConnection.isLocked" class="flex items-center gap-1">
          DC <input v-model.number="selectedConnection.lockDC" type="number" class="w-14 rounded-md border border-border bg-slate px-1 py-0.5 text-parchment outline-none" />
        </label>
        <label class="flex items-center gap-1"><input type="checkbox" v-model="selectedConnection.isSecret" class="h-4 w-4 accent-gold" /> Secret</label>
        <label class="flex items-center gap-1"><input type="checkbox" v-model="selectedConnection.isDiscovered" class="h-4 w-4 accent-gold" /> Discovered</label>
      </div>
      <textarea v-model="selectedConnection.description" rows="2" placeholder="Description…" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
      <textarea v-model="selectedConnection.notes" rows="2" placeholder="Notes…" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
    </template>

    <!-- Dungeon-level info -->
    <template v-else>
      <p class="font-display text-lg text-gold">Dungeon Info</p>
      <select v-model="dungeon.type" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment">
        <option v-for="t in DUNGEON_TYPES" :key="t" :value="t">{{ t }}</option>
      </select>
      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Description</label>
        <textarea v-model="dungeon.description" rows="2" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
      </div>
      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Atmosphere</label>
        <textarea v-model="dungeon.atmosphere" rows="2" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
      </div>
      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">History</label>
        <textarea v-model="dungeon.history" rows="2" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
      </div>
      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Secret Info</label>
        <textarea v-model="dungeon.secretInfo" rows="2" class="w-full rounded-md border border-crimson/40 bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-crimson" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Linked Landmark</p>
        <EntityLinkList v-model="linkedLandmark" :options="landmarkOptions" :max="1" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Controlling Faction</p>
        <EntityLinkList v-model="linkedFaction" :options="factionOptions" :max="1" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Tags</p>
        <div class="flex flex-wrap items-center gap-2">
          <div v-for="(_tag, index) in dungeon.tags" :key="index" class="flex items-center gap-1 rounded-full border border-border bg-slate px-2 py-0.5 text-xs text-parchment">
            <input v-model="dungeon.tags[index]" class="w-16 bg-transparent outline-none" />
            <button type="button" class="text-ink hover:text-crimson" @click="removeTag(index)">
              <PhTrash :size="10" />
            </button>
          </div>
          <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="addTag">+ Add tag</button>
        </div>
      </div>
      <label class="flex items-center gap-1 text-sm text-ink">
        <input type="checkbox" v-model="dungeon.isCompleted" class="h-4 w-4 accent-gold" /> Cleared
      </label>
      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Notes</label>
        <textarea v-model="dungeon.notes" rows="2" class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
      </div>
    </template>
  </div>
</template>
