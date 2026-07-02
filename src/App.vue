<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import SessionPulseBar from '@/components/layout/SessionPulseBar.vue'
import SidePanel from '@/components/layout/SidePanel.vue'
import BackToSessionBanner from '@/components/layout/BackToSessionBanner.vue'
import CommandPalette from '@/components/shared/CommandPalette.vue'
import { useCommandPalette } from '@/composables/useCommandPalette'

const { toggle } = useCommandPalette()

onKeyStroke('k', (event) => {
  if (event.metaKey || event.ctrlKey) {
    event.preventDefault()
    toggle()
  }
})
</script>

<template>
  <div class="flex h-screen flex-col bg-void text-parchment">
    <div class="flex flex-1 overflow-hidden">
      <AppSidebar />
      <div class="flex flex-1 flex-col overflow-hidden">
        <BackToSessionBanner />
        <main class="flex-1 overflow-y-auto">
          <RouterView />
        </main>
      </div>
    </div>
    <SessionPulseBar />
    <SidePanel />
    <CommandPalette />
  </div>
</template>
