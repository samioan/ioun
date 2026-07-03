<script setup lang="ts">
import type { DerivedStat } from '@/types'

defineProps<{ derivedStats: DerivedStat[] }>()
</script>

<template>
  <div v-if="derivedStats.length" class="flex flex-wrap gap-3">
    <div
      v-for="stat in derivedStats"
      :key="stat.key"
      class="flex flex-col items-center gap-1 rounded-md border border-border bg-slate px-3 py-2"
      :title="stat.formula"
    >
      <span class="text-xs uppercase tracking-wide text-ink">{{ stat.label }}</span>
      <input
        v-if="!stat.isComputed"
        v-model="stat.value"
        class="w-16 rounded-md border border-border bg-obsidian text-center font-mono text-sm text-parchment outline-none"
      />
      <span v-else class="font-mono text-lg text-gold">{{ stat.value }}</span>
    </div>
  </div>
</template>
