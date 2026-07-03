<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { PhCheckSquare } from '@phosphor-icons/vue'
import { useSessionStore } from '@/stores/session'

const sessionStore = useSessionStore()
const lastSession = computed(() => {
  const sessions = Object.values(sessionStore.items)
  if (sessions.length === 0) return undefined
  return sessions.reduce((latest, s) => (s.number > latest.number ? s : latest))
})

const items = computed(() =>
  (lastSession.value?.nextSessionPrep ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean),
)

// Local-only, non-persisted — the data model stores nextSessionPrep as a
// freetext string, not structured objective rows with per-item completion.
const checked = ref<Set<number>>(new Set())

function toggle(index: number) {
  if (checked.value.has(index)) checked.value.delete(index)
  else checked.value.add(index)
}
</script>

<template>
  <section class="border-b border-border px-6 py-4">
    <h2 class="mb-3 font-display text-lg text-gold">Next Session Prep</h2>
    <div v-if="items.length === 0" class="flex flex-col items-center gap-3 py-6 text-center">
      <PhCheckSquare :size="32" class="text-ink" />
      <p class="text-sm text-ink">Nothing prepped yet.</p>
      <RouterLink to="/session/history" class="tap-target text-sm text-gold underline">Session History</RouterLink>
    </div>
    <ul v-else class="flex flex-col gap-2">
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-2">
        <input
          type="checkbox"
          class="tap-target h-4 w-4 accent-gold"
          :checked="checked.has(index)"
          @change="toggle(index)"
        />
        <span class="text-sm" :class="checked.has(index) ? 'text-ink line-through' : 'text-parchment'">
          {{ item }}
        </span>
      </li>
    </ul>
  </section>
</template>
