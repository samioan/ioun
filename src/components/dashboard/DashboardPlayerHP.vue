<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { PhUsersThree, PhWarningCircle } from '@phosphor-icons/vue'
import { usePlayerStore } from '@/stores/players'

const playerStore = usePlayerStore()
const players = computed(() => Object.values(playerStore.items))

function hpPercent(current: number, max: number): number {
  if (max <= 0) return 0
  return Math.max(0, Math.min(100, (current / max) * 100))
}

function hpColor(percent: number): string {
  if (percent > 50) return 'bg-emerald'
  if (percent > 25) return 'bg-gold'
  return 'bg-crimson'
}
</script>

<template>
  <section class="border-b border-border px-6 py-4">
    <h2 class="mb-3 font-display text-lg text-gold">Party</h2>
    <div v-if="players.length === 0" class="flex flex-col items-center gap-3 py-6 text-center">
      <PhUsersThree :size="32" class="text-ink" />
      <p class="text-sm text-ink">Add your party. Track their HP, conditions, and story from one place.</p>
      <RouterLink to="/players" class="tap-target text-sm text-gold underline">Add Player</RouterLink>
    </div>
    <div v-else class="flex flex-col gap-2">
      <RouterLink
        v-for="player in players"
        :key="player.id"
        :to="`/players/${player.id}`"
        class="tap-target flex items-center gap-3 rounded-md border border-border px-3 py-2 hover:bg-slate"
      >
        <span class="w-32 truncate text-sm text-parchment">{{ player.name }}</span>
        <div class="h-2 flex-1 overflow-hidden rounded-full bg-obsidian">
          <div
            class="h-full transition-all duration-300"
            :class="hpColor(hpPercent(player.health.current, player.health.max))"
            :style="{ width: hpPercent(player.health.current, player.health.max) + '%' }"
          />
        </div>
        <span class="w-16 shrink-0 text-right font-mono text-xs text-ink">
          {{ player.health.current }}/{{ player.health.max }}
        </span>
        <PhWarningCircle v-if="player.conditions.length" :size="16" class="shrink-0 text-crimson" />
      </RouterLink>
    </div>
  </section>
</template>
