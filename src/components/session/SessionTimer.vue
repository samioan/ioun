<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSessionMode } from '@/composables/useSessionMode'

const { sessionStartedAt } = useSessionMode()
const now = ref(Date.now())
let intervalId: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

const elapsed = computed(() => {
  if (!sessionStartedAt.value) return '00:00'
  const seconds = Math.max(0, Math.floor((now.value - sessionStartedAt.value) / 1000))
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${secs}`
})
</script>

<template>
  <span class="font-mono text-parchment">{{ elapsed }}</span>
</template>
