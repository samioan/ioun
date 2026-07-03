<script setup lang="ts">
import { PhPlus, PhTrash } from '@phosphor-icons/vue'
import { newId } from '@/utils/id'
import type { Player } from '@/types'

const props = defineProps<{ player: Player }>()

function addPool() {
  props.player.resourcePools.push({ id: newId(), name: 'New Pool', current: 0, max: 0 })
}

function removePool(id: string) {
  const index = props.player.resourcePools.findIndex((p) => p.id === id)
  if (index !== -1) props.player.resourcePools.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="pool in player.resourcePools"
      :key="pool.id"
      class="flex items-center gap-2 rounded-md border border-border px-3 py-2"
    >
      <input v-model="pool.name" class="flex-1 bg-transparent text-sm text-parchment outline-none" />
      <input
        type="number"
        v-model.number="pool.current"
        class="w-16 rounded-md border border-border bg-obsidian text-center font-mono text-sm text-parchment outline-none"
      />
      <span class="text-ink">/</span>
      <input
        type="number"
        v-model.number="pool.max"
        class="w-16 rounded-md border border-border bg-obsidian text-center font-mono text-sm text-parchment outline-none"
      />
      <input
        v-model="pool.rechargeOn"
        placeholder="recharge on…"
        class="w-28 rounded-md border border-border bg-obsidian px-2 py-1 text-xs text-ink outline-none"
      />
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="removePool(pool.id)">
        <PhTrash :size="16" />
      </button>
    </div>
    <button
      type="button"
      class="tap-target flex items-center gap-2 self-start text-sm text-gold hover:text-gold-dim"
      @click="addPool"
    >
      <PhPlus :size="14" /> Add Pool
    </button>
  </div>
</template>
