<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'
import { useTipsStore } from '@/stores/tips'

const props = defineProps<{ tipKey: string; message?: string }>()
const { isDismissed, dismiss } = useTipsStore()
</script>

<template>
  <div
    v-if="!isDismissed(props.tipKey)"
    class="flex items-start gap-3 rounded-md border border-gold-dim bg-slate px-4 py-3"
  >
    <slot name="icon" />
    <div class="flex-1 text-sm text-parchment">
      <slot>{{ props.message }}</slot>
    </div>
    <button
      type="button"
      class="tap-target flex items-center justify-center text-ink hover:text-gold"
      @click="dismiss(props.tipKey)"
    >
      <PhX :size="16" />
    </button>
  </div>
</template>
