<script setup lang="ts">
import { computed } from 'vue'
import { getSystemPreset } from '@/data/system-presets'

const props = defineProps<{
  draft: { name: string; systemPresetId: string; players: { name: string; playerName: string }[] }
}>()

const systemName = computed(() => getSystemPreset(props.draft.systemPresetId)?.name ?? 'Unknown')
</script>

<template>
  <div class="flex flex-col gap-4">
    <h3 class="font-display text-xl text-gold">Ready to begin</h3>
    <dl class="flex flex-col gap-2 text-sm">
      <div class="flex justify-between border-b border-border pb-2">
        <dt class="text-ink">Campaign</dt>
        <dd class="text-parchment">{{ props.draft.name || 'Untitled Campaign' }}</dd>
      </div>
      <div class="flex justify-between border-b border-border pb-2">
        <dt class="text-ink">System</dt>
        <dd class="text-parchment">{{ systemName }}</dd>
      </div>
      <div class="flex justify-between border-b border-border pb-2">
        <dt class="text-ink">Players</dt>
        <dd class="text-parchment">{{ props.draft.players.length }}</dd>
      </div>
    </dl>
  </div>
</template>
