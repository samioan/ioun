<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { PhTrash, PhPlus } from '@phosphor-icons/vue'

const props = defineProps<{
  draft: { players: { name: string; playerName: string }[] }
}>()

function addRow() {
  props.draft.players.push({ name: '', playerName: '' })
}

function removeRow(index: number) {
  props.draft.players.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-ink">Add your party. You can add full character sheets later.</p>

    <div v-for="(row, index) in props.draft.players" :key="index" class="flex items-center gap-2">
      <InputText v-model="row.playerName" placeholder="Player name" class="flex-1" />
      <InputText v-model="row.name" placeholder="Character name" class="flex-1" />
      <button
        type="button"
        class="tap-target flex items-center justify-center text-ink hover:text-crimson"
        @click="removeRow(index)"
      >
        <PhTrash :size="18" />
      </button>
    </div>

    <button
      type="button"
      class="tap-target flex items-center gap-2 self-start text-sm text-gold hover:text-gold-dim"
      @click="addRow"
    >
      <PhPlus :size="16" /> Add player
    </button>
  </div>
</template>
