import { defineStore } from 'pinia'
import { ref } from 'vue'

// Sidebar collapse, screen-share/secrets toggle, etc. Deliberately NOT
// persisted — screen share mode always resets to the DM view on reload, and
// sidebar collapse is re-derived from viewport width + play mode anyway.
export const useUIStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const screenShareMode = ref(false)

  function toggleSidebarCollapsed() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function toggleScreenShareMode() {
    screenShareMode.value = !screenShareMode.value
  }

  function $reset() {
    sidebarCollapsed.value = false
    screenShareMode.value = false
  }

  return { sidebarCollapsed, screenShareMode, toggleSidebarCollapsed, toggleScreenShareMode, $reset }
})
