<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'
import type { CalendarSystem, WorldDate } from '@/types'

const props = withDefaults(defineProps<{ modelValue?: WorldDate; calendar: CalendarSystem; clearable?: boolean }>(), {
  clearable: true,
})
const emit = defineEmits<{ 'update:modelValue': [WorldDate | undefined] }>()

function setField(field: 'year' | 'month' | 'day', value: string) {
  const num = Number(value)
  if (Number.isNaN(num)) return
  const base = props.modelValue ?? { year: 1, month: 1, day: 1 }
  const next: WorldDate = { ...base, [field]: num }
  next.month = Math.min(Math.max(1, next.month), props.calendar.monthsPerYear || 12)
  next.day = Math.max(1, next.day)
  emit('update:modelValue', next)
}

function clear() {
  emit('update:modelValue', undefined)
}
</script>

<template>
  <div v-if="!modelValue" class="flex items-center gap-2">
    <button
      type="button"
      class="tap-target text-xs text-gold hover:text-gold-dim"
      @click="emit('update:modelValue', { year: 1, month: 1, day: 1 })"
    >
      + Set date
    </button>
  </div>
  <div v-else class="flex items-center gap-2">
    <input
      type="number"
      :value="modelValue.year"
      min="1"
      class="w-16 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
      @input="setField('year', ($event.target as HTMLInputElement).value)"
    />
    <span class="text-ink">/</span>
    <input
      type="number"
      :value="modelValue.month"
      min="1"
      :max="calendar.monthsPerYear"
      class="w-14 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
      @input="setField('month', ($event.target as HTMLInputElement).value)"
    />
    <span class="text-ink">/</span>
    <input
      type="number"
      :value="modelValue.day"
      min="1"
      class="w-14 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
      @input="setField('day', ($event.target as HTMLInputElement).value)"
    />
    <button v-if="clearable" type="button" class="tap-target text-ink hover:text-crimson" @click="clear">
      <PhX :size="14" />
    </button>
  </div>
</template>
