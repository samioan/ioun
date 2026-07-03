<script setup lang="ts">
import { PhSkull } from '@phosphor-icons/vue'
import type { BestiaryEntry } from '@/types'

defineProps<{ entry: BestiaryEntry; isSelected: boolean }>()
const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <button
    type="button"
    class="tap-target flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left"
    :class="isSelected ? 'border-gold bg-slate' : 'border-transparent hover:bg-slate'"
    @click="emit('select')"
  >
    <PhSkull :size="16" class="shrink-0 text-ink" />
    <span class="min-w-0 flex-1 truncate text-sm text-parchment">{{ entry.name || 'Unnamed Creature' }}</span>
    <span v-if="entry.threatRating" class="shrink-0 text-xs text-ink">CR {{ entry.threatRating }}</span>
  </button>
</template>
