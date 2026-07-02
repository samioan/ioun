import { reactive, toRefs } from 'vue'

// Module-level (singleton): "is a session currently active" is global app
// state, not per-component. Drives the "Back to Session" banner and the
// sidebar's play-mode collapse.
const state = reactive<{ isPlaying: boolean; activeSessionId: string | null }>({
  isPlaying: false,
  activeSessionId: null,
})

export function useSessionMode() {
  function enterPlayMode(sessionId: string) {
    state.isPlaying = true
    state.activeSessionId = sessionId
  }

  function exitPlayMode() {
    state.isPlaying = false
    state.activeSessionId = null
  }

  return { ...toRefs(state), enterPlayMode, exitPlayMode }
}
