<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { PhBookOpen } from '@phosphor-icons/vue'
import { useStoryStore } from '@/stores/story'

const storyStore = useStoryStore()
const activeArc = computed(() => Object.values(storyStore.items).find((arc) => arc.status === 'active'))
const sortedBeats = computed(() => [...(activeArc.value?.beats ?? [])].sort((a, b) => a.order - b.order))
const activeBeat = computed(() => sortedBeats.value.find((beat) => beat.status === 'active'))
const nextBeat = computed(() => {
  if (activeBeat.value) {
    return sortedBeats.value.find((beat) => beat.order > activeBeat.value!.order && beat.status === 'upcoming')
  }
  return sortedBeats.value.find((beat) => beat.status === 'upcoming')
})
</script>

<template>
  <section class="border-b border-border px-6 py-4">
    <h2 class="mb-3 font-display text-lg text-gold">Story</h2>
    <div v-if="!activeArc" class="flex flex-col items-center gap-3 py-6 text-center">
      <PhBookOpen :size="32" class="text-ink" />
      <p class="text-sm text-ink">No active story arc yet. Outline one to track beats here.</p>
      <RouterLink to="/campaign" class="tap-target text-sm text-gold underline">Campaign Arc</RouterLink>
    </div>
    <RouterLink v-else to="/campaign" class="block rounded-md border border-border px-3 py-2 hover:bg-slate">
      <p class="text-xs uppercase tracking-wide text-ink">{{ activeArc.name }}</p>
      <p class="text-parchment">{{ activeBeat?.title ?? 'No active beat set' }}</p>
      <p v-if="nextBeat" class="mt-1 text-xs text-ink">Next: {{ nextBeat.title }}</p>
    </RouterLink>
  </section>
</template>
