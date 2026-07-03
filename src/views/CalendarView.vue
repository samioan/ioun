<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhCalendarBlank, PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useCalendarStore } from '@/stores/calendar'
import { useQuestsStore } from '@/stores/quests'
import { useTopicsStore } from '@/stores/topics'
import { useSidePanel } from '@/composables/useSidePanel'
import { useWorldDate } from '@/composables/useWorldDate'
import { formatWorldDate, compareWorldDate } from '@/utils/worldDate'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import CalendarGrid from '@/components/calendar/CalendarGrid.vue'
import TimelineStrip from '@/components/calendar/TimelineStrip.vue'
import DayDetailPanel from '@/components/calendar/DayDetailPanel.vue'
import type { TimelineEntry } from '@/components/calendar/TimelineStrip.vue'
import type { WorldDate } from '@/types'

const campaignStore = useCampaignStore()
const calendarStore = useCalendarStore()
const questsStore = useQuestsStore()
const topicsStore = useTopicsStore()
const sidePanel = useSidePanel()
const { advance } = useWorldDate()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

const campaign = computed(() => campaignStore.getActive())
const calendar = computed(() => campaign.value?.calendarSystem)

// Browsing other months never mutates the campaign's real currentWorldDate.
const viewedMonth = ref<{ year: number; month: number } | null>(
  campaign.value ? { year: campaign.value.currentWorldDate.year, month: campaign.value.currentWorldDate.month } : null,
)

const view = ref<'grid' | 'timeline'>('grid')

function shiftMonth(delta: number) {
  if (!viewedMonth.value || !calendar.value) return
  const monthsPerYear = calendar.value.monthsPerYear || 12
  let month = viewedMonth.value.month + delta
  let year = viewedMonth.value.year
  while (month > monthsPerYear) {
    month -= monthsPerYear
    year += 1
  }
  while (month < 1) {
    month += monthsPerYear
    year -= 1
  }
  viewedMonth.value = { year, month }
}

function jumpToday() {
  if (campaign.value) {
    viewedMonth.value = { year: campaign.value.currentWorldDate.year, month: campaign.value.currentWorldDate.month }
  }
}

const todayDay = computed(() => {
  if (!campaign.value || !viewedMonth.value) return null
  const cw = campaign.value.currentWorldDate
  return cw.year === viewedMonth.value.year && cw.month === viewedMonth.value.month ? cw.day : null
})

const eventsInMonth = computed(() =>
  viewedMonth.value
    ? Object.values(calendarStore.items).filter(
        (e) => e.worldDate.year === viewedMonth.value!.year && e.worldDate.month === viewedMonth.value!.month,
      )
    : [],
)
const questDeadlinesInMonth = computed(() =>
  viewedMonth.value
    ? Object.values(questsStore.items).filter(
        (q) => q.deadline && q.deadline.year === viewedMonth.value!.year && q.deadline.month === viewedMonth.value!.month,
      )
    : [],
)
const topicDeadlinesInMonth = computed(() =>
  viewedMonth.value
    ? Object.values(topicsStore.items).filter(
        (t) => t.deadline && t.deadline.year === viewedMonth.value!.year && t.deadline.month === viewedMonth.value!.month,
      )
    : [],
)

const markerCounts = computed(() => {
  const counts: Record<number, number> = {}
  for (const e of eventsInMonth.value) counts[e.worldDate.day] = (counts[e.worldDate.day] ?? 0) + 1
  return counts
})
const deadlineDays = computed(() => {
  const days = new Set<number>()
  for (const q of questDeadlinesInMonth.value) days.add(q.deadline!.day)
  for (const t of topicDeadlinesInMonth.value) days.add(t.deadline!.day)
  return days
})

function openDayPanel(date: WorldDate) {
  sidePanel.push({
    title: calendar.value ? formatWorldDate(date, calendar.value) : `${date.year}/${date.month}/${date.day}`,
    component: DayDetailPanel,
    props: { date },
  })
}

function openDay(day: number) {
  if (!viewedMonth.value) return
  openDayPanel({ year: viewedMonth.value.year, month: viewedMonth.value.month, day })
}

const timelineEntries = computed<TimelineEntry[]>(() => {
  const entries: TimelineEntry[] = [
    ...Object.values(calendarStore.items).map((e) => ({
      id: e.id,
      label: e.name || 'Untitled Event',
      date: e.worldDate,
      kind: 'event' as const,
      isSecret: e.isSecret,
    })),
    ...Object.values(questsStore.items)
      .filter((q) => q.deadline)
      .map((q) => ({ id: q.id, label: q.title || 'Untitled Quest', date: q.deadline as WorldDate, kind: 'quest-deadline' as const })),
    ...Object.values(topicsStore.items)
      .filter((t) => t.deadline)
      .map((t) => ({ id: t.id, label: t.title || 'Untitled Topic', date: t.deadline as WorldDate, kind: 'topic-deadline' as const })),
  ]
  return entries.sort((a, b) => compareWorldDate(a.date, b.date))
})

function selectTimelineEvent(id: string) {
  const event = calendarStore.getById(id)
  if (event) openDayPanel(event.worldDate)
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhCalendarBlank :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start tracking the calendar.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Calendar & Timeline">
      <template #actions>
        <button
          type="button"
          class="tap-target rounded-full border px-3 py-1 text-xs"
          :class="view === 'grid' ? 'border-gold text-gold' : 'border-border text-ink hover:text-parchment'"
          @click="view = 'grid'"
        >
          Grid
        </button>
        <button
          type="button"
          class="tap-target rounded-full border px-3 py-1 text-xs"
          :class="view === 'timeline' ? 'border-gold text-gold' : 'border-border text-ink hover:text-parchment'"
          @click="view = 'timeline'"
        >
          Timeline
        </button>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-3">
      <div class="flex items-center gap-2">
        <button type="button" class="tap-target text-ink hover:text-gold" @click="shiftMonth(-1)">
          <PhCaretLeft :size="18" />
        </button>
        <p class="font-display text-parchment">
          {{ calendar?.months[(viewedMonth?.month ?? 1) - 1]?.name ?? `Month ${viewedMonth?.month}` }} — Year
          {{ viewedMonth?.year }}
        </p>
        <button type="button" class="tap-target text-ink hover:text-gold" @click="shiftMonth(1)">
          <PhCaretRight :size="18" />
        </button>
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="jumpToday">
          Today
        </button>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-ink">
          Now: {{ campaign ? formatWorldDate(campaign.currentWorldDate, campaign.calendarSystem) : '' }}
        </span>
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="advance(1, 'day')">
          +1 Day
        </button>
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="advance(1, 'week')">
          +1 Week
        </button>
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="advance(1, 'month')">
          +1 Month
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-4">
      <CalendarGrid
        v-if="view === 'grid' && calendar && viewedMonth"
        :calendar="calendar"
        :viewed-month="viewedMonth"
        :marker-counts="markerCounts"
        :deadline-days="deadlineDays"
        :today-day="todayDay"
        @select-day="openDay"
      />
      <TimelineStrip
        v-else-if="view === 'timeline' && calendar"
        :entries="timelineEntries"
        :calendar="calendar"
        @select-event="selectTimelineEvent"
      />
    </div>
  </div>
</template>
