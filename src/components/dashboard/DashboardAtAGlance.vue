<script setup lang="ts">
import { computed } from 'vue'
import { useCampaignStore } from '@/stores/campaign'
import { usePlayerStore } from '@/stores/players'
import { useSessionStore } from '@/stores/session'
import { useStoryStore } from '@/stores/story'
import { useWorldDate } from '@/composables/useWorldDate'
import { formatWorldDate } from '@/utils/worldDate'

const campaignStore = useCampaignStore()
const playerStore = usePlayerStore()
const sessionStore = useSessionStore()
const storyStore = useStoryStore()
const { advance } = useWorldDate()

const campaign = computed(() => campaignStore.getActive())
const playerCount = computed(() => Object.keys(playerStore.items).length)
const sessionCount = computed(() => Object.keys(sessionStore.items).length)
const activeArc = computed(() => Object.values(storyStore.items).find((arc) => arc.status === 'active'))
const worldDateLabel = computed(() =>
  campaign.value ? formatWorldDate(campaign.value.currentWorldDate, campaign.value.calendarSystem) : '',
)
</script>

<template>
  <div v-if="campaign" class="grid grid-cols-2 gap-4 border-b border-border px-6 py-4 sm:grid-cols-4">
    <div>
      <p class="text-xs uppercase tracking-wide text-ink">Players</p>
      <p class="font-mono text-lg text-parchment">{{ playerCount }}</p>
    </div>
    <div>
      <p class="text-xs uppercase tracking-wide text-ink">Sessions Run</p>
      <p class="font-mono text-lg text-parchment">{{ sessionCount }}</p>
    </div>
    <div>
      <p class="text-xs uppercase tracking-wide text-ink">Active Arc</p>
      <p class="truncate text-lg text-parchment">{{ activeArc?.name ?? '—' }}</p>
    </div>
    <div>
      <p class="text-xs uppercase tracking-wide text-ink">World Date</p>
      <p class="font-mono text-lg text-parchment">{{ worldDateLabel }}</p>
      <div class="mt-1 flex items-center gap-2">
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="advance(1, 'day')">
          +1 Day
        </button>
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="advance(1, 'week')">
          +1 Week
        </button>
      </div>
    </div>
  </div>
</template>
