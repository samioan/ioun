<script setup lang="ts">
import type { Session } from '@/types'

defineProps<{ session: Session }>()
</script>

<template>
  <div class="flex h-full flex-col p-4">
    <h2 class="mb-2 font-display text-lg text-gold">Session Notes</h2>
    <textarea
      v-model="session.notes"
      class="flex-1 resize-none rounded-md border border-border bg-slate p-3 text-sm text-parchment outline-none focus:border-gold"
      placeholder="Take notes as you play…"
    />
  </div>
</template>
