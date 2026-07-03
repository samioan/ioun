<script setup lang="ts">
import { computed } from 'vue'
import { useCampaignStore } from '@/stores/campaign'
import { formatWorldDate } from '@/utils/worldDate'
import type { CampaignTopic } from '@/types'

const props = defineProps<{ topic: CampaignTopic }>()
defineEmits<{ select: [] }>()

const campaignStore = useCampaignStore()

const PRIORITY_COLOR: Record<CampaignTopic['priority'], string> = {
  low: 'text-ink',
  medium: 'text-parchment',
  high: 'text-gold',
  urgent: 'text-crimson',
}

const STATUS_LABEL: Record<CampaignTopic['status'], string> = {
  open: 'Open',
  ongoing: 'Ongoing',
  resolved: 'Resolved',
  'red-herring': 'Red Herring',
  dormant: 'Dormant',
}

const deadlineLabel = computed(() => {
  if (!props.topic.deadline) return undefined
  const campaign = campaignStore.getActive()
  if (!campaign) return undefined
  return formatWorldDate(props.topic.deadline, campaign.calendarSystem)
})
</script>

<template>
  <div
    class="cursor-pointer rounded-md border bg-slate p-3 hover:border-gold"
    :class="topic.priority === 'urgent' ? 'animate-pulse border-crimson' : 'border-border'"
    @click="$emit('select')"
  >
    <div class="flex items-center justify-between gap-2">
      <p class="truncate text-sm text-parchment">{{ topic.title || 'Untitled Topic' }}</p>
      <span class="shrink-0 text-xs font-semibold" :class="PRIORITY_COLOR[topic.priority]">{{ topic.priority }}</span>
    </div>
    <div class="mt-2 flex items-center gap-2 text-xs text-ink">
      <span class="rounded-full border border-border px-2 py-0.5">{{ STATUS_LABEL[topic.status] }}</span>
      <span v-if="!topic.revealedToPlayers" class="rounded-full border border-border px-2 py-0.5">DM only</span>
    </div>
    <p v-if="deadlineLabel" class="mt-2 text-xs text-ink">Due {{ deadlineLabel }}</p>
  </div>
</template>
