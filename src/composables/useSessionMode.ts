import { reactive, toRefs } from 'vue'

// Module-level (singleton): "is a session currently active" is global app
// state, not per-component. Drives the "Back to Session" banner and the
// sidebar's play-mode collapse. sessionStartedAt is ephemeral UI state (for
// SessionTimer) — not persisted, resets like the rest of this composable.
const state = reactive<{ isPlaying: boolean; activeSessionId: string | null; sessionStartedAt: number | null }>({
  isPlaying: false,
  activeSessionId: null,
  sessionStartedAt: null,
})

export function useSessionMode() {
  function enterPlayMode(sessionId: string) {
    state.isPlaying = true
    state.activeSessionId = sessionId
    state.sessionStartedAt = Date.now()
  }

  function exitPlayMode() {
    state.isPlaying = false
    state.activeSessionId = null
    state.sessionStartedAt = null
  }

  return { ...toRefs(state), enterPlayMode, exitPlayMode }
}
