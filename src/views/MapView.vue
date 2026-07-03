<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import { PhMapPin } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useMapsStore } from '@/stores/maps'
import { useSidePanel } from '@/composables/useSidePanel'
import { createDefaultWorldMap } from '@/utils/defaults'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import MapCanvas from '@/components/world/MapCanvas.vue'
import MapPinDetail from '@/components/world/MapPinDetail.vue'
import WorldMapDetail from '@/components/world/WorldMapDetail.vue'

const campaignStore = useCampaignStore()
const mapsStore = useMapsStore()
const sidePanel = useSidePanel()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

const allMaps = computed(() => Object.values(mapsStore.items))
const selectedMapId = ref<string | null>(null)
const selectedMap = computed(() => (selectedMapId.value ? mapsStore.getById(selectedMapId.value) : undefined))
const selectedPinId = ref<string | null>(null)

// Keep a valid selection as maps are added/removed rather than silently
// pointing at a deleted map.
watch(
  allMaps,
  (maps) => {
    if (!selectedMapId.value && maps.length) selectedMapId.value = maps[0].id
    if (selectedMapId.value && !maps.some((m) => m.id === selectedMapId.value)) {
      selectedMapId.value = maps[0]?.id ?? null
    }
  },
  { immediate: true },
)

function addMap() {
  const map = mapsStore.add(createDefaultWorldMap({ name: 'New Map' }))
  selectedMapId.value = map.id
  sidePanel.push({ title: map.name, component: WorldMapDetail, props: { map } })
}

function editMap() {
  if (selectedMap.value) {
    sidePanel.push({ title: selectedMap.value.name || 'Map', component: WorldMapDetail, props: { map: selectedMap.value } })
  }
}

function selectPin(pinId: string) {
  if (!selectedMap.value) return
  const pin = selectedMap.value.pins.find((p) => p.id === pinId)
  if (!pin) return
  selectedPinId.value = pinId
  sidePanel.push({ title: pin.label || 'Pin', component: MapPinDetail, props: { map: selectedMap.value, pin } })
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhMapPin :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start mapping your world.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Interactive Map">
      <template #actions>
        <Button v-if="selectedMap" label="Edit Map" class="!bg-transparent !text-ink hover:!text-gold" @click="editMap" />
        <Button label="Add Map" @click="addMap" />
      </template>
    </PageHeader>

    <div v-if="allMaps.length === 0" class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <PhMapPin :size="32" class="text-ink" />
      <p class="text-sm text-ink">No maps yet. Add an overworld, region, or dungeon-floor map to place pins on.</p>
      <Button label="Add Map" @click="addMap" />
    </div>

    <template v-else>
      <div v-if="allMaps.length > 1" class="flex flex-wrap items-center gap-2 border-b border-border px-6 py-2">
        <button
          v-for="map in allMaps"
          :key="map.id"
          type="button"
          class="tap-target rounded-full border px-3 py-1 text-xs"
          :class="selectedMapId === map.id ? 'border-gold text-gold' : 'border-border text-ink hover:text-parchment'"
          @click="selectedMapId = map.id"
        >
          {{ map.name || 'Unnamed Map' }}
        </button>
      </div>

      <div class="flex-1 overflow-hidden">
        <MapCanvas
          v-if="selectedMap"
          :map="selectedMap"
          :selected-pin-id="selectedPinId"
          @select-pin="selectPin"
        />
      </div>
    </template>
  </div>
</template>
