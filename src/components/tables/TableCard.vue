<script setup lang="ts">
import type { RandomTable } from '@/types'

defineProps<{ table: RandomTable }>()
defineEmits<{ select: [] }>()
</script>

<template>
  <div class="cursor-pointer rounded-md border border-border bg-slate p-3 hover:border-gold" @click="$emit('select')">
    <div class="flex items-center justify-between gap-2">
      <p class="truncate text-sm text-parchment">{{ table.name || 'Untitled Table' }}</p>
      <span class="shrink-0 rounded-full border border-gold-dim px-2 py-0.5 font-mono text-xs text-gold">
        {{ table.diceNotation }}
      </span>
    </div>
    <div class="mt-2 flex items-center gap-2 text-xs text-ink">
      <span v-if="table.category" class="rounded-full border border-border px-2 py-0.5">{{ table.category }}</span>
      <span>{{ table.entries.length }} entries</span>
    </div>
  </div>
</template>
