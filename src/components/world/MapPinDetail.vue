<script setup lang="ts">
import { computed } from 'vue'
import { PhTrash } from '@phosphor-icons/vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { useWorldStore } from '@/stores/world'
import { useSidePanel } from '@/composables/useSidePanel'
import LandmarkDetail from './LandmarkDetail.vue'
import type { WorldMap, MapPin } from '@/types'

const props = defineProps<{ map: WorldMap; pin: MapPin }>()

const worldStore = useWorldStore()
const sidePanel = useSidePanel()

const landmarkOptions = computed(() => Object.values(worldStore.items).map((l) => ({ id: l.id, label: l.name })))
const linkedLandmark = computed<string[]>({
  get: () => (props.pin.landmarkId ? [props.pin.landmarkId] : []),
  set: (v) => {
    props.pin.landmarkId = v[0]
  },
})

const linkedLandmarkRecord = computed(() =>
  props.pin.landmarkId ? worldStore.getById(props.pin.landmarkId) : undefined,
)
const parentOptions = computed(() =>
  Object.values(worldStore.items)
    .filter((l) => l.id !== props.pin.landmarkId)
    .map((l) => ({ id: l.id, label: l.name })),
)

function viewLandmark() {
  const landmark = linkedLandmarkRecord.value
  if (!landmark) return
  sidePanel.push({ title: landmark.name || 'Landmark', component: LandmarkDetail, props: { landmark, parentOptions: parentOptions.value } })
}

function remove() {
  if (window.confirm('Remove this pin? This cannot be undone.')) {
    const index = props.map.pins.findIndex((p) => p.id === props.pin.id)
    if (index !== -1) props.map.pins.splice(index, 1)
    sidePanel.close()
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-start justify-between gap-3">
      <input
        v-model="pin.label"
        placeholder="Pin Label"
        class="w-full bg-transparent font-display text-xl text-gold outline-none"
      />
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="remove">
        <PhTrash :size="18" />
      </button>
    </div>

    <label class="flex items-center gap-2 text-sm text-ink">
      <input type="checkbox" v-model="pin.isRevealed" class="h-4 w-4 accent-gold" /> Revealed to players
    </label>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Linked Landmark</p>
      <EntityLinkList v-model="linkedLandmark" :options="landmarkOptions" :max="1" />
      <button
        v-if="linkedLandmarkRecord"
        type="button"
        class="tap-target mt-2 text-xs text-gold hover:text-gold-dim"
        @click="viewLandmark"
      >
        View Landmark →
      </button>
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Notes</label>
      <textarea
        v-model="pin.notes"
        rows="3"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>
  </div>
</template>
