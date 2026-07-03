<script setup lang="ts">
import { PhPlus, PhTrash } from '@phosphor-icons/vue'
import type { EntityAction } from '@/types'

const props = defineProps<{ actions: EntityAction[] }>()

function addAction() {
  // tags is a REQUIRED field on EntityAction — always default it explicitly.
  props.actions.push({ name: '', category: 'Action', description: '', tags: [] })
}
function removeAction(index: number) {
  props.actions.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-for="(action, index) in actions" :key="index" class="rounded-md border border-border p-2">
      <div class="flex items-center gap-2">
        <input
          v-model="action.name"
          placeholder="Action name"
          class="flex-1 bg-transparent text-sm font-semibold text-parchment outline-none"
        />
        <input
          v-model="action.category"
          placeholder="Category"
          class="w-28 rounded-md border border-border bg-slate px-2 py-1 text-xs text-ink outline-none"
        />
        <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeAction(index)">
          <PhTrash :size="14" />
        </button>
      </div>
      <textarea
        v-model="action.description"
        rows="2"
        placeholder="What it does…"
        class="mt-1 w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
      />
      <div class="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <input
          v-model="action.damage"
          placeholder="Damage"
          class="rounded-md border border-border bg-obsidian px-2 py-1 text-xs text-parchment outline-none"
        />
        <input
          type="number"
          v-model.number="action.attackBonus"
          placeholder="Attack +"
          class="rounded-md border border-border bg-obsidian px-2 py-1 text-xs text-parchment outline-none"
        />
        <input
          v-model="action.saveStat"
          placeholder="Save stat"
          class="rounded-md border border-border bg-obsidian px-2 py-1 text-xs text-parchment outline-none"
        />
        <input
          type="number"
          v-model.number="action.saveDifficulty"
          placeholder="Save DC"
          class="rounded-md border border-border bg-obsidian px-2 py-1 text-xs text-parchment outline-none"
        />
      </div>
      <input
        v-model="action.recharge"
        placeholder="Recharge (e.g. Recharge 5–6)"
        class="mt-1 w-full rounded-md border border-border bg-obsidian px-2 py-1 text-xs text-parchment outline-none"
      />
    </div>
    <button
      type="button"
      class="tap-target flex items-center gap-2 self-start text-sm text-gold hover:text-gold-dim"
      @click="addAction"
    >
      <PhPlus :size="14" /> Add action
    </button>
  </div>
</template>
