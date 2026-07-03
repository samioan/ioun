<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { PhScroll } from '@phosphor-icons/vue'
import { useQuestsStore } from '@/stores/quests'
import type { Quest } from '@/types'

const questsStore = useQuestsStore()
const activeQuests = computed(() => Object.values(questsStore.items).filter((quest) => quest.status === 'active'))

function progress(quest: Quest): number {
  if (quest.objectives.length === 0) return 0
  return Math.round((quest.objectives.filter((o) => o.isComplete).length / quest.objectives.length) * 100)
}
</script>

<template>
  <section class="px-6 py-4">
    <h2 class="mb-3 font-display text-lg text-gold">Active Quests</h2>
    <div v-if="activeQuests.length === 0" class="flex flex-col items-center gap-3 py-6 text-center">
      <PhScroll :size="32" class="text-ink" />
      <p class="text-sm text-ink">No quests yet. Add the first job, bounty, or duty your party has taken on.</p>
      <RouterLink to="/quests" class="tap-target text-sm text-gold underline">Add Quest</RouterLink>
    </div>
    <div v-else class="flex flex-col gap-2">
      <RouterLink
        v-for="quest in activeQuests"
        :key="quest.id"
        to="/quests"
        class="rounded-md border border-border px-3 py-2 hover:bg-slate"
      >
        <div class="flex items-center justify-between">
          <span class="text-parchment">{{ quest.title }}</span>
          <span class="font-mono text-xs text-ink">
            {{ quest.objectives.filter((o) => o.isComplete).length }}/{{ quest.objectives.length }}
          </span>
        </div>
        <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-obsidian">
          <div class="h-full bg-gold" :style="{ width: progress(quest) + '%' }" />
        </div>
      </RouterLink>
    </div>
  </section>
</template>
