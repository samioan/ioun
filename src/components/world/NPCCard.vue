<script setup lang="ts">
import type { NPC } from '@/types'

defineProps<{ npc: NPC; isSelected: boolean }>()
const emit = defineEmits<{ select: [] }>()

const DISPOSITION_COLOR: Record<NPC['disposition'], string> = {
  friendly: 'bg-emerald',
  neutral: 'bg-gold',
  hostile: 'bg-crimson',
  unknown: 'bg-ink',
}
</script>

<template>
  <button
    type="button"
    class="tap-target flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left"
    :class="isSelected ? 'border-gold bg-slate' : 'border-transparent hover:bg-slate'"
    @click="emit('select')"
  >
    <span class="h-2 w-2 shrink-0 rounded-full" :class="DISPOSITION_COLOR[npc.disposition]" />
    <span class="min-w-0 flex-1 truncate text-sm text-parchment">{{ npc.name || 'Unnamed NPC' }}</span>
    <span class="shrink-0 text-xs text-ink">{{ npc.role }}</span>
  </button>
</template>
