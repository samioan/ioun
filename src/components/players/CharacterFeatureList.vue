<script setup lang="ts">
import { PhPlus, PhTrash } from '@phosphor-icons/vue'
import { newId } from '@/utils/id'
import type { Player } from '@/types'

const props = defineProps<{ player: Player }>()

function addFeature() {
  props.player.features.push({ id: newId(), name: 'New Feature', source: '', description: '' })
}

function removeFeature(id: string) {
  const index = props.player.features.findIndex((f) => f.id === id)
  if (index !== -1) props.player.features.splice(index, 1)
}

function addUses(featureId: string) {
  const feature = props.player.features.find((f) => f.id === featureId)
  if (feature) feature.uses = { current: 1, max: 1, rechargeOn: '' }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="feature in player.features"
      :key="feature.id"
      class="flex flex-col gap-1 rounded-md border border-border px-3 py-2"
    >
      <div class="flex items-center gap-2">
        <input
          v-model="feature.name"
          class="flex-1 bg-transparent text-sm font-semibold text-parchment outline-none"
          placeholder="Feature name"
        />
        <input v-model="feature.source" class="w-32 bg-transparent text-xs text-ink outline-none" placeholder="Source" />
        <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeFeature(feature.id)">
          <PhTrash :size="16" />
        </button>
      </div>
      <textarea
        v-model="feature.description"
        rows="2"
        class="w-full rounded-md border border-border bg-obsidian px-2 py-1 text-sm text-parchment outline-none"
        placeholder="Description"
      />
      <div v-if="feature.uses" class="flex items-center gap-2 text-xs text-ink">
        <span>Uses:</span>
        <input
          type="number"
          v-model.number="feature.uses.current"
          class="w-12 rounded border border-border bg-obsidian text-center font-mono text-parchment outline-none"
        />
        <span>/</span>
        <input
          type="number"
          v-model.number="feature.uses.max"
          class="w-12 rounded border border-border bg-obsidian text-center font-mono text-parchment outline-none"
        />
        <input
          v-model="feature.uses.rechargeOn"
          placeholder="recharge on…"
          class="w-28 rounded border border-border bg-obsidian px-1 text-parchment outline-none"
        />
      </div>
      <button v-else type="button" class="self-start text-xs text-gold hover:text-gold-dim" @click="addUses(feature.id)">
        + Add limited use
      </button>
    </div>
    <button
      type="button"
      class="tap-target flex items-center gap-2 self-start text-sm text-gold hover:text-gold-dim"
      @click="addFeature"
    >
      <PhPlus :size="14" /> Add Feature
    </button>
  </div>
</template>
