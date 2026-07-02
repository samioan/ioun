<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useSessionMode } from '@/composables/useSessionMode'

const route = useRoute()
const { isPlaying } = useSessionMode()

const show = computed(() => isPlaying.value && route.path !== '/session')
</script>

<template>
  <div v-if="show" class="flex items-center justify-between bg-gold-dim px-4 py-2 text-sm text-parchment">
    <span>A session is in progress.</span>
    <RouterLink to="/session" class="tap-target font-semibold text-gold underline">Back to Session</RouterLink>
  </div>
</template>
