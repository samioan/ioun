<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const props = defineProps<{ current: number; max: number; temp?: number }>()
const emit = defineEmits<{ 'update:current': [number] }>()

const editing = ref(false)
const inputValue = ref('')
const inputRef = ref<HTMLInputElement>()

const percent = computed(() => {
  if (props.max <= 0) return 0
  return Math.max(0, Math.min(100, (props.current / props.max) * 100))
})

const color = computed(() => {
  if (percent.value > 50) return 'bg-emerald'
  if (percent.value > 25) return 'bg-gold'
  return 'bg-crimson'
})

function startEdit() {
  inputValue.value = ''
  editing.value = true
  nextTick(() => inputRef.value?.focus())
}

// Shorthand: "-15" damage, "+8" heal, "=30" or a bare number both set
// absolute. Clamps to [0, max] — no system-definition signal exists to
// support overheal or negative-HP-as-death-tracking, so this is a
// documented simplification, not an oversight.
function commit() {
  const raw = inputValue.value.trim()
  editing.value = false
  // Clear immediately: Enter triggers this, then the input's blur (fired as
  // Vue removes it from the DOM on the next tick) triggers this again —
  // without clearing, the second call would re-apply the same delta twice.
  inputValue.value = ''
  if (!raw) return
  let result: number
  if (raw.startsWith('+')) result = props.current + Number(raw.slice(1))
  else if (raw.startsWith('-')) result = props.current - Number(raw.slice(1))
  else if (raw.startsWith('=')) result = Number(raw.slice(1))
  else result = Number(raw)
  if (Number.isNaN(result)) return
  emit('update:current', Math.max(0, Math.min(props.max, result)))
}

function cancel() {
  editing.value = false
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="h-2 flex-1 overflow-hidden rounded-full bg-obsidian">
      <div class="h-full transition-all duration-300" :class="color" :style="{ width: percent + '%' }" />
    </div>
    <input
      v-if="editing"
      ref="inputRef"
      v-model="inputValue"
      type="text"
      class="tap-target w-20 rounded-md border border-gold bg-slate px-2 py-1 font-mono text-xs text-parchment outline-none"
      placeholder="-15, +8, =30"
      @keydown.enter="commit"
      @keydown.escape="cancel"
      @blur="commit"
    />
    <button v-else type="button" class="tap-target font-mono text-xs text-ink hover:text-gold" @click="startEdit">
      {{ current }}/{{ max }}<span v-if="temp">&nbsp;(+{{ temp }})</span>
    </button>
  </div>
</template>
