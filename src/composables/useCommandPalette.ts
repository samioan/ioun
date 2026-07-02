import { reactive, toRefs } from 'vue'

// Module-level (singleton): one command palette overlay for the whole app.
const state = reactive({ isOpen: false })

export function useCommandPalette() {
  function open() {
    state.isOpen = true
  }

  function close() {
    state.isOpen = false
  }

  function toggle() {
    state.isOpen = !state.isOpen
  }

  return { ...toRefs(state), open, close, toggle }
}
