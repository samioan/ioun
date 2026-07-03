<script setup lang="ts">
import { ref, computed } from 'vue'
import { PhPlus, PhX, PhMagnifyingGlass } from '@phosphor-icons/vue'

export interface EntityLinkOption {
  id: string
  label: string
}

// Generic "pick entities from another store, show as removable chips, add
// more" picker. Never imports a Pinia store itself — callers pre-resolve
// `options` from whichever store, keeping this reusable across NPCs,
// Factions, Landmarks, and Player relationships.
const props = defineProps<{ modelValue: string[]; options: EntityLinkOption[]; max?: number }>()
const emit = defineEmits<{ 'update:modelValue': [string[]]; add: [string]; remove: [string] }>()

const pickerOpen = ref(false)
const search = ref('')

const linked = computed(() =>
  props.modelValue.map((id) => props.options.find((o) => o.id === id)).filter((o): o is EntityLinkOption => !!o),
)

const available = computed(() => {
  const query = search.value.trim().toLowerCase()
  return props.options
    .filter((o) => !props.modelValue.includes(o.id))
    .filter((o) => !query || o.label.toLowerCase().includes(query))
    .sort((a, b) => a.label.localeCompare(b.label))
})

const atMax = computed(() => props.max !== undefined && props.modelValue.length >= props.max)

function add(id: string) {
  emit('update:modelValue', [...props.modelValue, id])
  emit('add', id)
  search.value = ''
  pickerOpen.value = false
}

function remove(id: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((v) => v !== id),
  )
  emit('remove', id)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <span
      v-for="entity in linked"
      :key="entity.id"
      class="flex items-center gap-1 rounded-full border border-border bg-slate px-2 py-0.5 text-xs text-parchment"
    >
      {{ entity.label }}
      <!-- No tap-target here: its 44px min-size blows out this tight chip,
           pushing a large empty gap to the right of the visible icon. -->
      <button type="button" class="text-ink hover:text-crimson" @click="remove(entity.id)">
        <PhX :size="12" />
      </button>
    </span>

    <div v-if="!atMax" class="relative">
      <button
        type="button"
        class="tap-target flex items-center justify-center rounded-full border border-border text-ink hover:border-gold hover:text-gold"
        @click="pickerOpen = !pickerOpen"
      >
        <PhPlus :size="14" />
      </button>
      <div
        v-if="pickerOpen"
        class="absolute left-0 top-full z-10 mt-1 w-56 rounded-md border border-border bg-obsidian p-1 shadow-xl"
      >
        <div class="flex items-center gap-1.5 border-b border-border px-2 py-1.5">
          <PhMagnifyingGlass :size="14" class="text-ink" />
          <input
            v-model="search"
            type="text"
            placeholder="Search…"
            class="w-full bg-transparent text-sm text-parchment outline-none placeholder:text-ink"
            autofocus
          />
        </div>
        <div class="max-h-48 overflow-y-auto">
          <p v-if="available.length === 0" class="px-2 py-1 text-xs text-ink">No matches.</p>
          <button
            v-for="entity in available"
            :key="entity.id"
            type="button"
            class="tap-target block w-full rounded-md px-2 py-1 text-left text-sm text-parchment hover:bg-slate"
            @click="add(entity.id)"
          >
            {{ entity.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
