<script setup lang="ts">
import { useSystemDefinition } from '@/composables/useSystemDefinition'
import type { StatBlock } from '@/types'

const props = defineProps<{ stats: StatBlock }>()
const { system, evaluateModifier } = useSystemDefinition()

function statValue(key: string, minValue: number): number {
  const value = props.stats[key]
  return typeof value === 'number' ? value : minValue
}

function onInput(key: string, value: string) {
  const num = Number(value)
  if (!Number.isNaN(num)) props.stats[key] = num
}
</script>

<template>
  <div v-if="system && system.stats.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3">
    <div
      v-for="stat in system.stats"
      :key="stat.key"
      class="flex flex-col items-center gap-1 rounded-md border border-border bg-slate px-3 py-2"
    >
      <span class="text-xs uppercase tracking-wide text-ink">{{ stat.abbreviation || stat.label }}</span>
      <input
        type="number"
        :min="stat.minValue"
        :max="stat.maxValue"
        :value="statValue(stat.key, stat.minValue)"
        class="tap-target w-16 rounded-md border border-border bg-obsidian text-center font-mono text-lg text-parchment outline-none focus:border-gold"
        @change="onInput(stat.key, ($event.target as HTMLInputElement).value)"
      />
      <span v-if="stat.modifierFormula" class="font-mono text-xs text-gold">
        {{ evaluateModifier(statValue(stat.key, stat.minValue), stat.key) ?? '—' }}
      </span>
    </div>
  </div>
  <p v-else class="text-sm text-ink">No stats defined for this system yet.</p>
</template>
