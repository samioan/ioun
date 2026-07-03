import { ref } from 'vue'

// Per-component drag state — NOT a singleton (unlike useSidePanel/useSessionMode).
// Drag state is per-board UI state; calling this fresh inside each board
// keeps the Beats board and Quests board from leaking state into each other.
export function useDragAndDrop() {
  const draggedId = ref<string | null>(null)
  const dragOverKey = ref<string | null>(null)

  function onDragStart(event: DragEvent, id: string) {
    draggedId.value = id
    // Required or Firefox refuses to start the drag at all; we don't read
    // this back, draggedId is the source of truth in onDrop.
    event.dataTransfer?.setData('text/plain', id)
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
  }

  function onDragOver(event: DragEvent, key: string) {
    // Mandatory — omit this and `drop` never fires. Only touches this
    // transient ref, never store state, so hovering doesn't churn
    // usePersistence's deep-watch+debounce.
    event.preventDefault()
    dragOverKey.value = key
  }

  function onDrop(event: DragEvent, handler: (draggedId: string) => void) {
    event.preventDefault()
    if (draggedId.value) handler(draggedId.value)
    dragOverKey.value = null
  }

  function onDragEnd() {
    draggedId.value = null
    dragOverKey.value = null
  }

  return { draggedId, dragOverKey, onDragStart, onDragOver, onDrop, onDragEnd }
}
