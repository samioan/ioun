<script setup lang="ts">
import { computed, ref } from 'vue'
import { PhPlayCircle } from '@phosphor-icons/vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { useSessionStore } from '@/stores/session'
import { usePlayerStore } from '@/stores/players'

const sessionStore = useSessionStore()
const playerStore = usePlayerStore()

const sessions = computed(() => [...Object.values(sessionStore.items)].sort((a, b) => b.number - a.number))
const expandedId = ref<string | null>(null)

function toggle(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

function attendeeNames(ids: string[]): string {
  return ids.map((id) => playerStore.getById(id)?.name ?? 'Unknown').join(', ') || '—'
}
</script>

<template>
  <div>
    <PageHeader title="Session History" />
    <div v-if="sessions.length === 0" class="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <PhPlayCircle :size="40" class="text-ink" />
      <p class="text-ink">No sessions logged yet. Begin one from the Session page.</p>
    </div>
    <div v-else class="flex flex-col gap-3 p-6">
      <div v-for="session in sessions" :key="session.id" class="rounded-md border border-border bg-obsidian p-4">
        <button type="button" class="flex w-full items-center justify-between text-left" @click="toggle(session.id)">
          <div>
            <p class="font-display text-lg text-parchment">
              Session {{ session.number }}<span v-if="session.title"> — {{ session.title }}</span>
            </p>
            <p class="text-xs text-ink">
              {{ session.date }} · Attending: {{ attendeeNames(session.attendingPlayerIds) }}
            </p>
          </div>
          <span class="font-mono text-xs text-gold">{{ expandedId === session.id ? '▲' : '▼' }}</span>
        </button>
        <p class="mt-2 text-sm text-ink">{{ session.summary || 'No summary written.' }}</p>
        <div v-if="expandedId === session.id" class="mt-3 border-t border-border pt-3">
          <p class="text-xs uppercase tracking-wide text-ink">Player Recap</p>
          <p class="whitespace-pre-line text-sm text-parchment">{{ session.recap || 'No recap written.' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
