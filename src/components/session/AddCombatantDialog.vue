<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { PhX, PhMagnifyingGlass } from '@phosphor-icons/vue'
import { useEnemyStore } from '@/stores/enemies'
import { useBestiaryStore } from '@/stores/bestiary'
import { createDefaultEnemy } from '@/utils/defaults'
import { cloneBestiaryEntryToEnemy } from '@/utils/bestiary'
import { buildEnemyInitiativeEntry } from '@/utils/combat'
import type { InitiativeEntry } from '@/types'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [boolean]; add: [InitiativeEntry] }>()

const enemyStore = useEnemyStore()
const bestiaryStore = useBestiaryStore()

const mode = ref<'bestiary' | 'custom'>('bestiary')
const search = ref('')

const filteredEntries = computed(() => {
  const query = search.value.trim().toLowerCase()
  return Object.values(bestiaryStore.items)
    .filter((e) => !query || e.name.toLowerCase().includes(query))
    .sort((a, b) => a.name.localeCompare(b.name))
})

const draft = reactive({
  name: '',
  hp: 10,
  ac: 10,
  initiative: 10,
})

function close() {
  emit('update:visible', false)
}

function addFromBestiary(entryId: string) {
  const entry = bestiaryStore.getById(entryId)
  if (!entry) return
  const enemy = enemyStore.add(cloneBestiaryEntryToEnemy(entry))
  emit('add', buildEnemyInitiativeEntry(enemy, draft.initiative))
  search.value = ''
  close()
}

function addCustom() {
  if (!draft.name.trim()) return
  const enemy = enemyStore.add(
    createDefaultEnemy({
      name: draft.name.trim(),
      health: { current: draft.hp, max: draft.hp },
      derivedStats: [{ key: 'ac', label: 'AC', value: draft.ac, isComputed: false }],
    }),
  )
  emit('add', buildEnemyInitiativeEntry(enemy, draft.initiative))
  draft.name = ''
  draft.hp = 10
  draft.ac = 10
  draft.initiative = 10
  close()
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :show-header="false"
    class="w-full max-w-md"
    @update:visible="close"
  >
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <h2 class="font-display text-lg text-gold">Add Enemy</h2>
      <button type="button" class="tap-target text-ink hover:text-gold" @click="close">
        <PhX :size="18" />
      </button>
    </div>
    <div class="flex flex-col gap-3 p-4">
      <div class="flex rounded-md border border-border">
        <button
          type="button"
          class="tap-target flex-1 rounded-l-md px-3 py-1.5 text-sm"
          :class="mode === 'bestiary' ? 'bg-slate text-gold' : 'text-ink'"
          @click="mode = 'bestiary'"
        >
          From Bestiary
        </button>
        <button
          type="button"
          class="tap-target flex-1 rounded-r-md px-3 py-1.5 text-sm"
          :class="mode === 'custom' ? 'bg-slate text-gold' : 'text-ink'"
          @click="mode = 'custom'"
        >
          Custom
        </button>
      </div>

      <div>
        <label class="mb-1 block text-xs text-ink">Initiative</label>
        <input
          v-model.number="draft.initiative"
          type="number"
          class="w-20 rounded-md border border-border bg-slate px-2 py-1 text-center font-mono text-parchment outline-none"
        />
      </div>

      <template v-if="mode === 'bestiary'">
        <div class="flex items-center gap-2 rounded-md border border-border bg-slate px-2 py-1.5">
          <PhMagnifyingGlass :size="14" class="text-ink" />
          <input
            v-model="search"
            placeholder="Search creatures…"
            class="w-full bg-transparent text-sm text-parchment outline-none"
          />
        </div>
        <div class="max-h-56 overflow-y-auto rounded-md border border-border">
          <p v-if="filteredEntries.length === 0" class="p-3 text-xs text-ink">
            No creatures found. Add some in the Bestiary first.
          </p>
          <button
            v-for="entry in filteredEntries"
            :key="entry.id"
            type="button"
            class="tap-target flex w-full items-center justify-between px-3 py-2 text-left text-sm text-parchment hover:bg-slate"
            @click="addFromBestiary(entry.id)"
          >
            <span>{{ entry.name }}</span>
            <span v-if="entry.threatRating" class="text-xs text-ink">CR {{ entry.threatRating }}</span>
          </button>
        </div>
      </template>

      <template v-else>
        <InputText v-model="draft.name" placeholder="Goblin Archer" autofocus />
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="mb-1 block text-xs text-ink">HP</label>
            <input
              v-model.number="draft.hp"
              type="number"
              class="w-full rounded-md border border-border bg-slate px-2 py-1 text-center font-mono text-parchment outline-none"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs text-ink">AC</label>
            <input
              v-model.number="draft.ac"
              type="number"
              class="w-full rounded-md border border-border bg-slate px-2 py-1 text-center font-mono text-parchment outline-none"
            />
          </div>
        </div>
        <Button label="Add to Combat" @click="addCustom" />
      </template>
    </div>
  </Dialog>
</template>
