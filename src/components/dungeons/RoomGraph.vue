<script setup lang="ts">
import { computed, ref } from 'vue'
import { PhLink, PhDoorOpen } from '@phosphor-icons/vue'
import { createDefaultDungeonConnection } from '@/utils/defaults'
import { newId } from '@/utils/id'
import RoomNode from './RoomNode.vue'
import type { Dungeon, DungeonConnection } from '@/types'

const props = defineProps<{ dungeon: Dungeon; selected: { type: 'room' | 'connection'; id: string } | null }>()
const emit = defineEmits<{ 'select-room': [string]; 'select-connection': [string] }>()

const containerRef = ref<HTMLDivElement | null>(null)
const connectMode = ref(false)
const pendingSourceId = ref<string | null>(null)
const draggingId = ref<string | null>(null)
const dragOffset = ref({ x: 0, y: 0 })

// Room.x/y is the node's *center* (RoomNode.vue is translated -50%/-50%),
// so connection lines and drag math both use it as-is, no half-width offset.
const canvasSize = computed(() => {
  let maxX = 400
  let maxY = 300
  for (const room of props.dungeon.rooms) {
    maxX = Math.max(maxX, (room.x ?? 0) + 100)
    maxY = Math.max(maxY, (room.y ?? 0) + 100)
  }
  return { width: maxX, height: maxY }
})

function roomById(id: string) {
  return props.dungeon.rooms.find((r) => r.id === id)
}

function onNodePointerDown(event: PointerEvent, roomId: string) {
  if (connectMode.value) return
  const room = roomById(roomId)
  if (!room || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  draggingId.value = roomId
  dragOffset.value = {
    x: event.clientX - rect.left + containerRef.value.scrollLeft - (room.x ?? 0),
    y: event.clientY - rect.top + containerRef.value.scrollTop - (room.y ?? 0),
  }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(event: PointerEvent) {
  if (!draggingId.value || !containerRef.value) return
  const room = roomById(draggingId.value)
  if (!room) return
  const rect = containerRef.value.getBoundingClientRect()
  room.x = Math.max(60, event.clientX - rect.left + containerRef.value.scrollLeft - dragOffset.value.x)
  room.y = Math.max(60, event.clientY - rect.top + containerRef.value.scrollTop - dragOffset.value.y)
}

function onPointerUp() {
  draggingId.value = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

function onNodeSelect(roomId: string) {
  if (connectMode.value) {
    if (!pendingSourceId.value) {
      pendingSourceId.value = roomId
      return
    }
    if (pendingSourceId.value === roomId) {
      pendingSourceId.value = null
      return
    }
    const source = pendingSourceId.value
    const exists = props.dungeon.connections.some(
      (c) =>
        (c.fromRoomId === source && c.toRoomId === roomId) || (c.fromRoomId === roomId && c.toRoomId === source),
    )
    if (!exists) {
      props.dungeon.connections.push({
        id: newId(),
        ...createDefaultDungeonConnection({ fromRoomId: source, toRoomId: roomId }),
      })
    }
    pendingSourceId.value = null
    return
  }
  emit('select-room', roomId)
}

function toggleConnectMode() {
  connectMode.value = !connectMode.value
  pendingSourceId.value = null
}

function connectionPoints(connection: DungeonConnection) {
  const from = roomById(connection.fromRoomId)
  const to = roomById(connection.toRoomId)
  return { x1: from?.x ?? 0, y1: from?.y ?? 0, x2: to?.x ?? 0, y2: to?.y ?? 0 }
}
</script>

<template>
  <div class="relative flex h-full flex-col">
    <div class="flex items-center gap-2 border-b border-border px-3 py-2">
      <button
        type="button"
        class="tap-target flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
        :class="connectMode ? 'border-gold text-gold' : 'border-border text-ink hover:text-parchment'"
        @click="toggleConnectMode"
      >
        <PhLink :size="14" />
        {{ connectMode ? 'Connecting… click two rooms' : 'Connect Rooms' }}
      </button>
    </div>

    <div ref="containerRef" class="relative flex-1 overflow-auto bg-void/40">
      <div v-if="dungeon.rooms.length === 0" class="flex h-full flex-col items-center justify-center gap-2 text-center">
        <PhDoorOpen :size="32" class="text-ink" />
        <p class="text-sm text-ink">No rooms yet. Add the first one.</p>
      </div>
      <div v-else class="relative" :style="{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }">
        <svg class="pointer-events-none absolute inset-0" :width="canvasSize.width" :height="canvasSize.height">
          <line
            v-for="connection in dungeon.connections"
            :key="connection.id"
            v-bind="connectionPoints(connection)"
            class="pointer-events-auto cursor-pointer"
            :stroke="selected?.type === 'connection' && selected.id === connection.id ? '#d4af37' : '#4a4a5c'"
            stroke-width="2"
            :stroke-dasharray="connection.isSecret ? '5,5' : undefined"
            @click="emit('select-connection', connection.id)"
          />
        </svg>
        <RoomNode
          v-for="room in dungeon.rooms"
          :key="room.id"
          :room="room"
          :is-selected="selected?.type === 'room' && selected.id === room.id"
          :is-pending="pendingSourceId === room.id"
          @pointerdown="onNodePointerDown($event, room.id)"
          @select="onNodeSelect(room.id)"
        />
      </div>
    </div>
  </div>
</template>
