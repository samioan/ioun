<script setup lang="ts">
import type { InitiativeEntry } from '@/types'

defineProps<{ entry: InitiativeEntry; name: string }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="font-display text-xl text-gold">{{ name }}</p>
    <p class="text-xs uppercase tracking-wide text-ink">{{ entry.entityType }}</p>

    <div class="flex items-center gap-3 text-sm">
      <span class="text-ink">HP</span>
      <span class="font-mono text-parchment">{{ entry.healthCurrent }}/{{ entry.healthMax }}</span>
    </div>

    <div v-if="entry.derivedStats.length" class="flex flex-wrap gap-2">
      <span
        v-for="stat in entry.derivedStats"
        :key="stat.key"
        class="rounded-md border border-border px-2 py-1 text-xs text-parchment"
      >
        {{ stat.label }}: {{ stat.value }}
      </span>
    </div>

    <div v-if="entry.conditions.length" class="flex flex-wrap gap-1">
      <span
        v-for="condition in entry.conditions"
        :key="condition"
        class="rounded-full border border-gold-dim bg-slate px-2 py-0.5 text-xs text-parchment"
      >
        {{ condition }}
      </span>
    </div>

    <div v-if="entry.ongoingEffect">
      <p class="text-xs uppercase tracking-wide text-ink">Ongoing Effect</p>
      <p class="text-sm text-parchment">{{ entry.ongoingEffect }}</p>
    </div>

    <div v-if="entry.notes">
      <p class="text-xs uppercase tracking-wide text-ink">Notes</p>
      <p class="text-sm text-parchment">{{ entry.notes }}</p>
    </div>
  </div>
</template>
