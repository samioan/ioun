<script setup lang="ts">
import { computed } from 'vue'
import type { MapPin } from '@/types'

const props = defineProps<{ pin: MapPin; isSelected: boolean }>()
defineEmits<{ pointerdown: [PointerEvent]; select: [] }>()

const dotClass = computed(() => {
  if (props.isSelected) return 'bg-gold ring-2 ring-gold ring-offset-2 ring-offset-void'
  return props.pin.isRevealed ? 'bg-gold-dim' : 'bg-ink'
})
</script>

<template>
  <div
    class="absolute flex -translate-x-1/2 -translate-y-full cursor-grab select-none flex-col items-center gap-0.5 touch-none"
    :style="{ left: `${pin.x}%`, top: `${pin.y}%` }"
    @pointerdown="$emit('pointerdown', $event)"
    @click="$emit('select')"
  >
    <span
      class="whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[10px] shadow-lg"
      :class="pin.isRevealed ? 'border-border bg-obsidian text-parchment' : 'border-dashed border-ink bg-obsidian/70 text-ink'"
    >
      {{ pin.label || 'Unnamed Pin' }}
    </span>
    <span class="h-3 w-3 rounded-full border-2 border-obsidian" :class="dotClass" />
  </div>
</template>
