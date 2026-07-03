<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { PhPlayCircle } from '@phosphor-icons/vue'
import { useSessionStore } from '@/stores/session'

const sessionStore = useSessionStore()
const lastSession = computed(() => {
  const sessions = Object.values(sessionStore.items)
  if (sessions.length === 0) return undefined
  return sessions.reduce((latest, s) => (s.number > latest.number ? s : latest))
})
const showRecap = ref(false)
</script>

<template>
  <section class="border-b border-border px-6 py-4">
    <h2 class="mb-3 font-display text-lg text-gold">Last Session</h2>
    <div v-if="!lastSession" class="flex flex-col items-center gap-3 py-6 text-center">
      <PhPlayCircle :size="32" class="text-ink" />
      <p class="text-sm text-ink">Ready to play? Start a session to track initiative, rolls, and events.</p>
      <RouterLink to="/session" class="tap-target text-sm text-gold underline">Begin Session</RouterLink>
    </div>
    <div v-else class="flex flex-col gap-2">
      <p class="text-parchment">
        Session {{ lastSession.number }}<span v-if="lastSession.title"> — {{ lastSession.title }}</span>
      </p>
      <p class="text-sm text-ink">{{ lastSession.summary || 'No summary written yet.' }}</p>
      <div class="flex items-center gap-3">
        <button type="button" class="tap-target text-sm text-gold underline" @click="showRecap = !showRecap">
          {{ showRecap ? 'Hide recap' : 'Read recap' }}
        </button>
        <RouterLink to="/session/history" class="tap-target text-sm text-ink underline">Full history</RouterLink>
      </div>
      <p v-if="showRecap" class="rounded-md border border-border bg-obsidian p-3 text-sm text-parchment">
        {{ lastSession.recap || 'No recap written yet.' }}
      </p>
    </div>
  </section>
</template>
