<script setup lang="ts">
import { computed } from 'vue'
import { useSystemDefinition } from '@/composables/useSystemDefinition'
import type { Player } from '@/types'

const props = defineProps<{ player: Player }>()
const { system } = useSystemDefinition()

const total = computed(() => {
  if (!system.value) return 0
  return system.value.currency.reduce((sum, c) => sum + (props.player.currency[c.key] ?? 0) * c.conversionRate, 0)
})

const baseAbbreviation = computed(() => system.value?.currency[0]?.abbreviation ?? '')

function onInput(key: string, value: string) {
  const num = Number(value)
  if (!Number.isNaN(num)) props.player.currency[key] = num
}
</script>

<template>
  <div v-if="system && system.currency.length" class="flex flex-col gap-2">
    <div class="flex flex-wrap gap-3">
      <div v-for="denom in system.currency" :key="denom.key" class="flex flex-col items-center gap-1">
        <span class="text-xs uppercase tracking-wide text-ink">{{ denom.abbreviation }}</span>
        <input
          type="number"
          :value="player.currency[denom.key] ?? 0"
          class="tap-target w-20 rounded-md border border-border bg-obsidian text-center font-mono text-sm text-parchment outline-none focus:border-gold"
          @change="onInput(denom.key, ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <p class="text-xs text-ink">Total: {{ total.toFixed(2) }}{{ baseAbbreviation }} equivalent</p>
  </div>
  <p v-else class="text-sm text-ink">This system has no currency configured.</p>
</template>
