<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { PhLightbulb } from '@phosphor-icons/vue'
import { useTopicsStore } from '@/stores/topics'

const topicsStore = useTopicsStore()
const urgentTopics = computed(() =>
  Object.values(topicsStore.items).filter((topic) => topic.priority === 'urgent' && topic.status !== 'resolved'),
)
</script>

<template>
  <section class="border-b border-border px-6 py-4">
    <h2 class="mb-3 font-display text-lg text-gold">Urgent Topics</h2>
    <div v-if="urgentTopics.length === 0" class="flex flex-col items-center gap-3 py-6 text-center">
      <PhLightbulb :size="32" class="text-ink" />
      <p class="text-sm text-ink">No urgent threads right now.</p>
      <RouterLink to="/topics" class="tap-target text-sm text-gold underline">Topics & Hooks</RouterLink>
    </div>
    <div v-else class="flex flex-col gap-2">
      <RouterLink
        v-for="topic in urgentTopics"
        :key="topic.id"
        to="/topics"
        class="rounded-md border-l-2 border-crimson bg-slate px-3 py-2 hover:brightness-110"
      >
        <p class="text-parchment">{{ topic.title }}</p>
      </RouterLink>
    </div>
  </section>
</template>
