<script setup lang="ts">
import Button from 'primevue/button'
import { useSessionMode } from '@/composables/useSessionMode'

const { isPlaying } = useSessionMode()

function rollD20() {
  // TODO(feature-phase): wire to useDiceStore / real notation parser
}
</script>

<template>
  <footer
    class="flex h-14 items-center justify-between border-t border-border bg-obsidian px-4 transition-shadow duration-200 sm:h-14"
    :class="{ 'shadow-[0_0_16px_rgba(201,150,42,0.35)]': isPlaying }"
  >
    <div class="flex items-center gap-3 text-sm text-ink">
      <span class="font-mono text-parchment">00:00</span>
      <span v-if="!isPlaying">No active session</span>
    </div>
    <div class="hidden font-mono text-sm text-parchment sm:block">Last roll: —</div>
    <Button label="Roll d20" class="tap-target-lg" @click="rollD20" />
  </footer>
</template>
