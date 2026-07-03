<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { usePlayerStore } from '@/stores/players'
import PageHeader from '@/components/layout/PageHeader.vue'
import PlayerSheet from '@/components/players/PlayerSheet.vue'

const route = useRoute()
const playerStore = usePlayerStore()

const player = computed(() => playerStore.getById(String(route.params.id)))
</script>

<template>
  <div v-if="player">
    <PageHeader :title="player.name || 'Unnamed Character'" />
    <PlayerSheet :player="player" />
  </div>
  <div v-else class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
    <p class="text-ink">This player couldn't be found.</p>
    <RouterLink to="/players" class="tap-target text-sm text-gold underline">Back to Players</RouterLink>
  </div>
</template>
