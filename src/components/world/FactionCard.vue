<script setup lang="ts">
import { PhFlag } from '@phosphor-icons/vue'
import type { Faction } from '@/types'

defineProps<{ faction: Faction; isSelected: boolean }>()
const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <button
    type="button"
    class="tap-target flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left"
    :class="isSelected ? 'border-gold bg-slate' : 'border-transparent hover:bg-slate'"
    @click="emit('select')"
  >
    <PhFlag :size="16" class="shrink-0 text-ink" />
    <span class="min-w-0 flex-1 truncate text-sm text-parchment">{{ faction.name || 'Unnamed Faction' }}</span>
    <span v-if="faction.isSecret" class="shrink-0 text-xs text-crimson">secret</span>
  </button>
</template>
