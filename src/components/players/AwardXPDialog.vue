<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { PhX } from '@phosphor-icons/vue'
import { newId } from '@/utils/id'
import type { Player } from '@/types'

const props = defineProps<{ visible: boolean; players: Player[] }>()
const emit = defineEmits<{ 'update:visible': [boolean] }>()

const amount = ref('')
const reason = ref('')

function close() {
  emit('update:visible', false)
}

function award() {
  const num = Number(amount.value)
  if (Number.isNaN(num) || num === 0) return
  for (const player of props.players) {
    player.experiencePoints += num
    player.xpLog.push({ id: newId(), amount: num, reason: reason.value.trim(), timestamp: new Date().toISOString() })
  }
  amount.value = ''
  reason.value = ''
  close()
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :show-header="false"
    class="w-full max-w-md"
    @update:visible="close"
  >
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <h2 class="font-display text-lg text-gold">Award XP to All</h2>
      <button type="button" class="tap-target text-ink hover:text-gold" @click="close">
        <PhX :size="18" />
      </button>
    </div>
    <div class="flex flex-col gap-3 p-4">
      <div>
        <label class="mb-1 block text-xs text-ink">Amount</label>
        <InputText v-model="amount" type="number" placeholder="250" />
      </div>
      <div>
        <label class="mb-1 block text-xs text-ink">Reason (optional)</label>
        <InputText v-model="reason" placeholder="Defeated the goblin ambush" />
      </div>
      <Button label="Award" @click="award" />
    </div>
  </Dialog>
</template>
