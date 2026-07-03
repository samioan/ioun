<script setup lang="ts">
import { reactive } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { PhX } from '@phosphor-icons/vue'
import { useSystemDefinition } from '@/composables/useSystemDefinition'
import { usePlayerStore } from '@/stores/players'
import { createDefaultPlayer } from '@/utils/defaults'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [boolean] }>()

const { system } = useSystemDefinition()
const playerStore = usePlayerStore()

const draft = reactive({
  name: '',
  playerName: '',
  ancestry: '',
  characterClass: '',
  background: '',
  healthMax: 10,
  stats: {} as Record<string, number>,
})

function close() {
  emit('update:visible', false)
}

function reset() {
  draft.name = ''
  draft.playerName = ''
  draft.ancestry = ''
  draft.characterClass = ''
  draft.background = ''
  draft.healthMax = 10
  draft.stats = {}
}

function save() {
  if (!draft.name.trim()) return
  playerStore.add(
    createDefaultPlayer({
      name: draft.name.trim(),
      playerName: draft.playerName.trim(),
      ancestry: draft.ancestry.trim(),
      characterClass: draft.characterClass.trim(),
      background: draft.background.trim(),
      health: { current: draft.healthMax, max: draft.healthMax, temp: 0 },
      stats: { ...draft.stats },
    }),
  )
  reset()
  close()
}

function onStatInput(key: string, value: string) {
  const num = Number(value)
  if (!Number.isNaN(num)) draft.stats[key] = num
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :show-header="false"
    class="w-full max-w-lg"
    @update:visible="close"
  >
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <h2 class="font-display text-lg text-gold">Add Player</h2>
      <button type="button" class="tap-target text-ink hover:text-gold" @click="close">
        <PhX :size="18" />
      </button>
    </div>
    <div class="flex max-h-[70vh] flex-col gap-3 overflow-y-auto p-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="mb-1 block text-xs text-ink">Character Name</label>
          <InputText v-model="draft.name" placeholder="Aria" autofocus />
        </div>
        <div>
          <label class="mb-1 block text-xs text-ink">Player Name</label>
          <InputText v-model="draft.playerName" placeholder="Alex" />
        </div>
        <div>
          <label class="mb-1 block text-xs text-ink">Ancestry</label>
          <InputText v-model="draft.ancestry" />
        </div>
        <div>
          <label class="mb-1 block text-xs text-ink">Class</label>
          <InputText v-model="draft.characterClass" />
        </div>
        <div class="col-span-2">
          <label class="mb-1 block text-xs text-ink">Background</label>
          <InputText v-model="draft.background" />
        </div>
        <div>
          <label class="mb-1 block text-xs text-ink">Max HP</label>
          <input
            v-model.number="draft.healthMax"
            type="number"
            class="tap-target w-full rounded-md border border-border bg-slate px-3 py-2 text-parchment outline-none focus:border-gold"
          />
        </div>
      </div>

      <div v-if="system && system.stats.length">
        <p class="mb-2 text-xs uppercase tracking-wide text-ink">Starting Stats</p>
        <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
          <div v-for="stat in system.stats" :key="stat.key" class="flex flex-col items-center gap-1">
            <span class="text-xs text-ink">{{ stat.abbreviation || stat.label }}</span>
            <input
              type="number"
              :min="stat.minValue"
              :max="stat.maxValue"
              :value="draft.stats[stat.key] ?? stat.minValue"
              class="tap-target w-14 rounded-md border border-border bg-obsidian text-center font-mono text-sm text-parchment outline-none focus:border-gold"
              @change="onStatInput(stat.key, ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>

      <Button label="Add Player" @click="save" />
    </div>
  </Dialog>
</template>
