<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '@/types'

const props = defineProps<{ player: Player }>()

const entries = computed(() => [...props.player.xpLog].reverse())
</script>

<template>
  <div class="flex flex-col gap-2">
    <p v-if="entries.length === 0" class="text-sm text-ink">No XP awarded yet.</p>
    <div
      v-for="entry in entries"
      :key="entry.id"
      class="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
    >
      <span class="text-parchment">{{ entry.reason || 'XP awarded' }}</span>
      <span class="font-mono text-gold">+{{ entry.amount }}</span>
    </div>
  </div>
</template>
