import { reactive, computed, type Component } from 'vue'

export interface PanelEntry {
  title: string
  component?: Component
  props?: Record<string, unknown>
}

// Module-level (singleton) state: the panel is a single global overlay, not
// a per-component instance, so every caller shares the same stack.
const state = reactive<{ stack: PanelEntry[] }>({ stack: [] })

export function useSidePanel() {
  const isOpen = computed(() => state.stack.length > 0)
  const current = computed<PanelEntry | null>(() => state.stack[state.stack.length - 1] ?? null)
  const canGoBack = computed(() => state.stack.length > 1)

  function push(entry: PanelEntry) {
    state.stack.push(entry)
  }

  function back() {
    if (state.stack.length > 1) state.stack.pop()
  }

  function close() {
    state.stack.length = 0
  }

  return { stack: state.stack, isOpen, current, canGoBack, push, back, close }
}
