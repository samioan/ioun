<script setup lang="ts">
import { computed } from 'vue'
import type { DungeonRoom } from '@/types'

const props = defineProps<{ room: DungeonRoom; isSelected: boolean; isPending: boolean }>()
defineEmits<{ pointerdown: [PointerEvent]; select: [] }>()

const TYPE_ABBR: Record<DungeonRoom['type'], string> = {
  entrance: 'IN',
  corridor: 'COR',
  chamber: 'CH',
  boss: 'BOSS',
  trap: 'TRAP',
  puzzle: 'PZL',
  rest: 'REST',
  secret: 'SEC',
  exit: 'OUT',
  custom: '?',
}

const borderClass = computed(() => {
  if (props.isPending) return 'border-gold ring-2 ring-gold ring-offset-2 ring-offset-void'
  if (props.isSelected) return 'border-gold'
  if (props.room.type === 'boss') return 'border-crimson'
  return props.room.isExplored ? 'border-gold-dim' : 'border-border'
})
</script>

<template>
  <div
    class="absolute flex w-28 -translate-x-1/2 -translate-y-1/2 cursor-grab select-none flex-col items-center gap-0.5 rounded-md border-2 bg-obsidian px-2 py-1.5 text-center shadow-lg touch-none"
    :class="[borderClass, room.isSecret ? 'border-dashed' : '', room.isExplored ? 'text-parchment' : 'text-ink']"
    :style="{ left: `${room.x ?? 0}px`, top: `${room.y ?? 0}px` }"
    @pointerdown="$emit('pointerdown', $event)"
    @click="$emit('select')"
  >
    <span class="text-[10px] uppercase tracking-wide text-ink">{{ TYPE_ABBR[room.type] }} · #{{ room.number }}</span>
    <span class="truncate text-xs font-semibold">{{ room.name || 'Unnamed' }}</span>
  </div>
</template>
