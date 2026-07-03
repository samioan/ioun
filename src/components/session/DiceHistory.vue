<script setup lang="ts">
import type { DiceRoll } from '@/types'

defineProps<{ rolls: DiceRoll[] }>()
</script>

<template>
  <div class="flex flex-col gap-1 border-t border-border pt-2">
    <p class="text-xs uppercase tracking-wide text-ink">Recent</p>
    <p v-if="rolls.length === 0" class="text-xs text-ink">No rolls yet.</p>
    <div
      v-for="r in rolls"
      :key="r.id"
      class="flex items-center justify-between font-mono text-xs"
      :class="r.isNatural20 ? 'text-gold' : r.isNatural1 ? 'text-crimson' : 'text-parchment'"
    >
      <span>{{ r.notation }} → {{ r.total }}</span>
      <span class="text-ink">{{ r.purpose || '—' }}</span>
    </div>
  </div>
</template>
