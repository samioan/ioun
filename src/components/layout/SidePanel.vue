<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { PhX, PhCaretLeft } from '@phosphor-icons/vue'
import { useSidePanel } from '@/composables/useSidePanel'

const { isOpen, current, canGoBack, back, close } = useSidePanel()

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) close()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Transition name="side-panel">
    <aside
      v-if="isOpen"
      class="fixed right-0 top-0 z-40 h-full w-full border-l border-border bg-slate shadow-2xl sm:w-[400px]"
    >
      <div class="flex items-center gap-2 border-b border-border px-4 py-3">
        <button
          v-if="canGoBack"
          type="button"
          class="tap-target flex items-center justify-center text-ink hover:text-gold"
          @click="back"
        >
          <PhCaretLeft :size="20" />
        </button>
        <h2 class="flex-1 truncate font-display text-lg text-gold">{{ current?.title }}</h2>
        <button
          type="button"
          class="tap-target flex items-center justify-center text-ink hover:text-gold"
          @click="close"
        >
          <PhX :size="20" />
        </button>
      </div>
      <div class="overflow-y-auto p-4">
        <component :is="current?.component" v-if="current?.component" v-bind="current?.props" />
        <p v-else class="text-ink">Nothing to show.</p>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.side-panel-enter-active,
.side-panel-leave-active {
  transition: transform 0.25s ease-out;
}
.side-panel-enter-from,
.side-panel-leave-to {
  transform: translateX(100%);
}
</style>
