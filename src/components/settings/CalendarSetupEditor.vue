<script setup lang="ts">
import { PhPlus, PhTrash } from '@phosphor-icons/vue'
import type { Campaign } from '@/types'

const props = defineProps<{ campaign: Campaign }>()

// monthsPerYear/daysPerWeek are derived from the actual list lengths on
// every change rather than being independently editable numbers, so they
// can never drift out of sync with `months`/`weekDayNames`.
function addMonth() {
  props.campaign.calendarSystem.months.push({ name: `Month ${props.campaign.calendarSystem.months.length + 1}`, days: 30 })
  props.campaign.calendarSystem.monthsPerYear = props.campaign.calendarSystem.months.length
}
function removeMonth(index: number) {
  props.campaign.calendarSystem.months.splice(index, 1)
  props.campaign.calendarSystem.monthsPerYear = props.campaign.calendarSystem.months.length
}

function addWeekDay() {
  props.campaign.calendarSystem.weekDayNames.push(`Day ${props.campaign.calendarSystem.weekDayNames.length + 1}`)
  props.campaign.calendarSystem.daysPerWeek = props.campaign.calendarSystem.weekDayNames.length
}
function removeWeekDay(index: number) {
  props.campaign.calendarSystem.weekDayNames.splice(index, 1)
  props.campaign.calendarSystem.daysPerWeek = props.campaign.calendarSystem.weekDayNames.length
}
</script>

<template>
  <section class="border-b border-border px-6 py-4">
    <p class="mb-1 font-display text-lg text-gold">Calendar Setup</p>
    <p class="mb-4 text-xs text-ink">{{ campaign.calendarSystem.months.length }} months a year, {{ campaign.calendarSystem.weekDayNames.length }}-day weeks.</p>

    <div class="mb-4">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-sm font-semibold text-parchment">Months</p>
        <button type="button" class="tap-target text-gold hover:text-gold-dim" @click="addMonth">
          <PhPlus :size="14" />
        </button>
      </div>
      <div v-for="(month, index) in campaign.calendarSystem.months" :key="index" class="mb-2 flex items-center gap-2">
        <input v-model="month.name" placeholder="Month name" class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        <input v-model.number="month.days" type="number" min="1" class="w-16 shrink-0 rounded-md border border-border bg-slate px-2 py-1 text-center text-xs text-parchment outline-none" />
        <span class="shrink-0 text-xs text-ink">days</span>
        <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeMonth(index)">
          <PhTrash :size="12" />
        </button>
      </div>
    </div>

    <div class="mb-4">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-sm font-semibold text-parchment">Weekday Names</p>
        <button type="button" class="tap-target text-gold hover:text-gold-dim" @click="addWeekDay">
          <PhPlus :size="14" />
        </button>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div
          v-for="(_day, index) in campaign.calendarSystem.weekDayNames"
          :key="index"
          class="flex items-center gap-1 rounded-full border border-border bg-slate px-2 py-0.5 text-xs text-parchment"
        >
          <input v-model="campaign.calendarSystem.weekDayNames[index]" class="w-16 bg-transparent outline-none" />
          <button type="button" class="text-ink hover:text-crimson" @click="removeWeekDay(index)">
            <PhTrash :size="10" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm text-ink">Hours per day</label>
      <input v-model.number="campaign.calendarSystem.hoursPerDay" type="number" min="1" class="w-16 rounded-md border border-border bg-slate px-2 py-1 text-center text-xs text-parchment outline-none" />
    </div>
  </section>
</template>
