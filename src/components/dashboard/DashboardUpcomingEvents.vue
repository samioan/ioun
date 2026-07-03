<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { PhCalendarBlank } from '@phosphor-icons/vue'
import { useCalendarStore } from '@/stores/calendar'
import { useCampaignStore } from '@/stores/campaign'
import { compareWorldDate, formatWorldDate } from '@/utils/worldDate'

const calendarStore = useCalendarStore()
const campaignStore = useCampaignStore()

const campaign = computed(() => campaignStore.getActive())

const upcoming = computed(() => {
  if (!campaign.value) return []
  const now = campaign.value.currentWorldDate
  return Object.values(calendarStore.items)
    .filter((event) => compareWorldDate(event.worldDate, now) >= 0)
    .sort((a, b) => compareWorldDate(a.worldDate, b.worldDate))
    .slice(0, 3)
})
</script>

<template>
  <section class="border-b border-border px-6 py-4">
    <h2 class="mb-3 font-display text-lg text-gold">Upcoming</h2>
    <div v-if="upcoming.length === 0" class="flex flex-col items-center gap-3 py-6 text-center">
      <PhCalendarBlank :size="32" class="text-ink" />
      <p class="text-sm text-ink">No upcoming events scheduled.</p>
      <RouterLink to="/calendar" class="tap-target text-sm text-gold underline">Calendar</RouterLink>
    </div>
    <div v-else class="flex flex-col gap-2">
      <RouterLink
        v-for="event in upcoming"
        :key="event.id"
        to="/calendar"
        class="flex items-center justify-between rounded-md border border-border px-3 py-2 hover:bg-slate"
      >
        <span class="text-parchment">{{ event.name }}</span>
        <span v-if="campaign" class="font-mono text-xs text-ink">
          {{ formatWorldDate(event.worldDate, campaign.calendarSystem) }}
        </span>
      </RouterLink>
    </div>
  </section>
</template>
