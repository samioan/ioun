<script setup lang="ts">
import { PhTrash } from '@phosphor-icons/vue'
import { useMapsStore } from '@/stores/maps'
import { useSidePanel } from '@/composables/useSidePanel'
import type { WorldMap } from '@/types'

const props = defineProps<{ map: WorldMap }>()
const emit = defineEmits<{ remove: [] }>()

const mapsStore = useMapsStore()
const sidePanel = useSidePanel()

function remove() {
  if (window.confirm('Remove this map and all its pins? This cannot be undone.')) {
    mapsStore.remove(props.map.id)
    emit('remove')
    sidePanel.close()
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-start justify-between gap-3">
      <input
        v-model="map.name"
        placeholder="Map Name"
        class="w-full bg-transparent font-display text-xl text-gold outline-none"
      />
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="remove">
        <PhTrash :size="18" />
      </button>
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Image URL</label>
      <input
        v-model="map.imageUrl"
        placeholder="https://…"
        class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Notes</label>
      <textarea
        v-model="map.notes"
        rows="3"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>
  </div>
</template>
