<script setup lang="ts">
import { ref } from 'vue'
import { PhMapPinLine, PhMagnifyingGlassPlus, PhMagnifyingGlassMinus, PhImage } from '@phosphor-icons/vue'
import { createDefaultMapPin } from '@/utils/defaults'
import { newId } from '@/utils/id'
import MapPinMarker from './MapPinMarker.vue'
import type { WorldMap } from '@/types'

const props = defineProps<{ map: WorldMap; selectedPinId: string | null }>()
const emit = defineEmits<{ 'select-pin': [string] }>()

const imageRef = ref<HTMLImageElement | null>(null)
const zoom = ref(1)
const placeMode = ref(false)
const draggingId = ref<string | null>(null)

function pinById(id: string) {
  return props.map.pins.find((p) => p.id === id)
}

// Positions are stored as 0-100 percentages of the image's own rendered
// bounding box — getBoundingClientRect() already reflects the post-zoom
// size, so this stays correct regardless of the current zoom level.
function percentFromEvent(event: { clientX: number; clientY: number }): { x: number; y: number } | null {
  if (!imageRef.value) return null
  const rect = imageRef.value.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return null
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  return { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) }
}

function onImageClick(event: MouseEvent) {
  if (!placeMode.value) return
  const pos = percentFromEvent(event)
  if (!pos) return
  const pin = { id: newId(), ...createDefaultMapPin({ label: 'New Pin', x: pos.x, y: pos.y }) }
  props.map.pins.push(pin)
  placeMode.value = false
  emit('select-pin', pin.id)
}

function onPinPointerDown(pinId: string) {
  if (placeMode.value) return
  draggingId.value = pinId
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(event: PointerEvent) {
  if (!draggingId.value) return
  const pin = pinById(draggingId.value)
  const pos = percentFromEvent(event)
  if (!pin || !pos) return
  pin.x = pos.x
  pin.y = pos.y
}

function onPointerUp() {
  draggingId.value = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

function onPinSelect(pinId: string) {
  if (placeMode.value) return
  emit('select-pin', pinId)
}

function zoomIn() {
  zoom.value = Math.min(3, Math.round((zoom.value + 0.25) * 100) / 100)
}
function zoomOut() {
  zoom.value = Math.max(0.5, Math.round((zoom.value - 0.25) * 100) / 100)
}
</script>

<template>
  <div class="relative flex h-full flex-col">
    <div class="flex items-center gap-2 border-b border-border px-3 py-2">
      <button
        type="button"
        class="tap-target flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
        :class="placeMode ? 'border-gold text-gold' : 'border-border text-ink hover:text-parchment'"
        @click="placeMode = !placeMode"
      >
        <PhMapPinLine :size="14" />
        {{ placeMode ? 'Click the map to place a pin…' : 'Place Pin' }}
      </button>
      <div class="ml-auto flex items-center gap-1">
        <button type="button" class="tap-target text-ink hover:text-gold" @click="zoomOut">
          <PhMagnifyingGlassMinus :size="16" />
        </button>
        <span class="w-10 text-center text-xs text-ink">{{ Math.round(zoom * 100) }}%</span>
        <button type="button" class="tap-target text-ink hover:text-gold" @click="zoomIn">
          <PhMagnifyingGlassPlus :size="16" />
        </button>
      </div>
    </div>

    <div class="relative flex-1 overflow-auto bg-void/40 p-8">
      <div v-if="!map.imageUrl" class="flex h-full flex-col items-center justify-center gap-2 text-center">
        <PhImage :size="32" class="text-ink" />
        <p class="text-sm text-ink">No map image set yet. Add one in the map's details.</p>
      </div>
      <div v-else class="relative inline-block origin-top-left" :style="{ transform: `scale(${zoom})` }">
        <img
          ref="imageRef"
          :src="map.imageUrl"
          class="block max-w-none select-none"
          :class="placeMode ? 'cursor-crosshair' : ''"
          alt=""
          @click="onImageClick"
        />
        <MapPinMarker
          v-for="pin in map.pins"
          :key="pin.id"
          :pin="pin"
          :is-selected="selectedPinId === pin.id"
          @pointerdown="onPinPointerDown(pin.id)"
          @select="onPinSelect(pin.id)"
        />
      </div>
    </div>
  </div>
</template>
