<script setup lang="ts">
import { computed } from 'vue'
import type { CalendarSystem } from '@/types'

const props = defineProps<{
  calendar: CalendarSystem
  viewedMonth: { year: number; month: number }
  markerCounts: Record<number, number>
  deadlineDays: Set<number>
  todayDay: number | null
}>()
const emit = defineEmits<{ 'select-day': [number] }>()

// No "which weekday is day 1" anchor field exists on CalendarMonth, so days
// wrap sequentially into rows of daysPerWeek rather than aligning to a true
// weekday-of-week offset.
const monthLength = computed(() => props.calendar.months[props.viewedMonth.month - 1]?.days ?? 30)
const days = computed(() => Array.from({ length: monthLength.value }, (_, i) => i + 1))
</script>

<template>
  <div class="grid gap-2" :style="{ gridTemplateColumns: `repeat(${calendar.daysPerWeek || 7}, minmax(0, 1fr))` }">
    <button
      v-for="day in days"
      :key="day"
      type="button"
      class="tap-target flex flex-col items-center gap-1 rounded-md border p-2 text-sm"
      :class="day === todayDay ? 'border-gold text-gold' : 'border-border text-parchment hover:border-gold-dim'"
      @click="emit('select-day', day)"
    >
      <span>{{ day }}</span>
      <span v-if="deadlineDays.has(day)" class="h-1.5 w-1.5 rounded-full bg-crimson" />
      <span v-else-if="markerCounts[day]" class="h-1.5 w-1.5 rounded-full bg-gold" />
      <span v-else class="h-1.5 w-1.5" />
    </button>
  </div>
</template>
