<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { PhX } from '@phosphor-icons/vue'

defineProps<{ visible: boolean; recap: string; sessionNumber: number }>()
const emit = defineEmits<{ 'update:visible': [boolean] }>()

function close() {
  emit('update:visible', false)
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :show-header="false"
    class="w-full max-w-lg"
    @update:visible="close"
  >
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <h2 class="font-display text-lg text-gold">Last Time — Session {{ sessionNumber }}</h2>
      <button type="button" class="tap-target text-ink hover:text-gold" @click="close">
        <PhX :size="18" />
      </button>
    </div>
    <div class="flex flex-col gap-3 p-4">
      <p class="whitespace-pre-line text-sm text-parchment">{{ recap }}</p>
      <Button label="Got it" @click="close" />
    </div>
  </Dialog>
</template>
