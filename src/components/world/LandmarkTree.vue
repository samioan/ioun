<script setup lang="ts">
import { PhMapPin } from '@phosphor-icons/vue'
import type { Landmark } from '@/types'

defineProps<{ nodes: { landmark: Landmark; depth: number }[]; selectedId: string | null }>()
const emit = defineEmits<{ select: [string] }>()
</script>

<template>
  <div>
    <button
      v-for="node in nodes"
      :key="node.landmark.id"
      type="button"
      class="tap-target flex w-full items-center gap-2 border-l-2 py-2 pr-3 text-left"
      :class="node.landmark.id === selectedId ? 'border-gold bg-slate' : 'border-transparent hover:bg-slate'"
      :style="{ paddingLeft: `${12 + node.depth * 16}px` }"
      @click="emit('select', node.landmark.id)"
    >
      <PhMapPin :size="14" class="shrink-0 text-ink" />
      <span class="min-w-0 flex-1 truncate text-sm text-parchment">{{ node.landmark.name || 'Unnamed' }}</span>
      <span v-if="node.landmark.hasBeenVisited" class="shrink-0 text-xs text-emerald">✓</span>
    </button>
  </div>
</template>
