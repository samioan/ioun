<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import { useCommandPalette } from '@/composables/useCommandPalette'

const { isOpen, close } = useCommandPalette()
</script>

<template>
  <Dialog
    :visible="isOpen"
    modal
    :draggable="false"
    :show-header="false"
    class="w-full max-w-lg"
    @update:visible="(visible: boolean) => !visible && close()"
  >
    <div class="flex items-center gap-2 border-b border-border px-3 py-3">
      <PhMagnifyingGlass :size="18" class="text-ink" />
      <input
        type="text"
        placeholder="Search campaign…"
        class="w-full bg-transparent text-parchment outline-none placeholder:text-ink"
        autofocus
      />
    </div>
    <p class="p-4 text-sm text-ink">Entity search comes online once your campaign has data.</p>
  </Dialog>
</template>
