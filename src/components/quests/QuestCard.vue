<script setup lang="ts">
import { computed } from 'vue'
import { PhWarning } from '@phosphor-icons/vue'
import EntityChip from '@/components/shared/EntityChip.vue'
import { useNPCStore } from '@/stores/npcs'
import { useFactionStore } from '@/stores/factions'
import { useCampaignStore } from '@/stores/campaign'
import { compareWorldDate } from '@/utils/worldDate'
import type { Quest } from '@/types'

const props = defineProps<{ quest: Quest }>()
defineEmits<{ select: [] }>()

const npcStore = useNPCStore()
const factionStore = useFactionStore()
const campaignStore = useCampaignStore()

const giverLabel = computed(() => {
  if (props.quest.giverNpcId) return npcStore.getById(props.quest.giverNpcId)?.name
  if (props.quest.giverFactionId) return factionStore.getById(props.quest.giverFactionId)?.name
  return undefined
})

const progress = computed(() => {
  if (props.quest.objectives.length === 0) return 0
  return Math.round((props.quest.objectives.filter((o) => o.isComplete).length / props.quest.objectives.length) * 100)
})

const isOverdue = computed(() => {
  if (!props.quest.deadline) return false
  const campaign = campaignStore.getActive()
  if (!campaign) return false
  return compareWorldDate(props.quest.deadline, campaign.currentWorldDate) <= 0
})

const PRIORITY_COLOR: Record<Quest['priority'], string> = {
  low: 'text-ink',
  medium: 'text-parchment',
  high: 'text-gold',
  urgent: 'text-crimson',
}
</script>

<template>
  <div class="cursor-pointer rounded-md border border-border bg-slate p-3 hover:border-gold" @click="$emit('select')">
    <div class="flex items-center justify-between gap-2">
      <p class="truncate text-sm text-parchment">{{ quest.title || 'Untitled Quest' }}</p>
      <PhWarning v-if="isOverdue" :size="14" class="shrink-0 text-crimson" />
    </div>
    <div class="mt-1 flex items-center justify-between gap-2">
      <EntityChip v-if="giverLabel" :label="giverLabel" />
      <span class="text-xs font-semibold" :class="PRIORITY_COLOR[quest.priority]">{{ quest.priority }}</span>
    </div>
    <div v-if="quest.objectives.length" class="mt-2">
      <div class="h-1.5 overflow-hidden rounded-full bg-obsidian">
        <div class="h-full bg-gold" :style="{ width: progress + '%' }" />
      </div>
      <p class="mt-1 text-xs text-ink">
        {{ quest.objectives.filter((o) => o.isComplete).length }}/{{ quest.objectives.length }}
      </p>
    </div>
  </div>
</template>
