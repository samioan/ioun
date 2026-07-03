<script setup lang="ts">
import { computed, ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { PhX } from '@phosphor-icons/vue'
import { usePlayerStore } from '@/stores/players'
import { useLootStore } from '@/stores/loot'

const props = defineProps<{ visible: boolean; itemIds: string[] }>()
const emit = defineEmits<{ 'update:visible': [boolean]; done: [] }>()

const playerStore = usePlayerStore()
const lootStore = useLootStore()
const players = computed(() => Object.values(playerStore.items))
const chosenPlayerId = ref('')

function close() {
  emit('update:visible', false)
}

function award() {
  const holderId = chosenPlayerId.value || undefined
  for (const id of props.itemIds) {
    lootStore.update(id, { currentHolderId: holderId })
  }
  chosenPlayerId.value = ''
  emit('done')
  close()
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :show-header="false"
    class="w-full max-w-sm"
    @update:visible="close"
  >
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <h2 class="font-display text-lg text-gold">Award {{ itemIds.length }} Item(s)</h2>
      <button type="button" class="tap-target text-ink hover:text-gold" @click="close">
        <PhX :size="18" />
      </button>
    </div>
    <div class="flex flex-col gap-3 p-4">
      <select v-model="chosenPlayerId" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment">
        <option value="">Party Stash</option>
        <option v-for="p in players" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <Button label="Assign" @click="award" />
    </div>
  </Dialog>
</template>
