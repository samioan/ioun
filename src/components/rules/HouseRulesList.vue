<script setup lang="ts">
import { PhPlus, PhTrash } from '@phosphor-icons/vue'
import { createDefaultHouseRule } from '@/utils/defaults'
import { newId } from '@/utils/id'
import type { Campaign } from '@/types'

const props = defineProps<{ campaign: Campaign }>()

function addRule() {
  props.campaign.houseRules.push({ id: newId(), ...createDefaultHouseRule() })
}
function removeRule(id: string) {
  const index = props.campaign.houseRules.findIndex((r) => r.id === id)
  if (index !== -1) props.campaign.houseRules.splice(index, 1)
}
</script>

<template>
  <div class="border-b border-border px-6 py-4">
    <div class="mb-2 flex items-center justify-between">
      <p class="font-display text-lg text-gold">House Rules</p>
      <button type="button" class="tap-target text-gold hover:text-gold-dim" @click="addRule">
        <PhPlus :size="16" />
      </button>
    </div>
    <p v-if="campaign.houseRules.length === 0" class="text-sm text-ink">
      No house rules yet — add the tweaks that make your table's game yours.
    </p>
    <div v-else class="flex flex-col gap-2">
      <div
        v-for="rule in campaign.houseRules"
        :key="rule.id"
        class="flex flex-col gap-2 rounded-md border border-border bg-slate p-3"
      >
        <div class="flex items-center gap-2">
          <input
            v-model="rule.title"
            placeholder="Rule title"
            class="flex-1 bg-transparent text-sm font-semibold text-parchment outline-none"
          />
          <label class="flex items-center gap-1 text-xs text-ink">
            <input type="checkbox" v-model="rule.isActive" class="h-4 w-4 accent-gold" /> Active
          </label>
          <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeRule(rule.id)">
            <PhTrash :size="14" />
          </button>
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model="rule.category"
            placeholder="Category"
            class="w-32 rounded-md border border-border bg-obsidian px-2 py-1 text-xs text-parchment outline-none"
          />
          <input
            v-model="rule.source"
            placeholder="Source (optional)"
            class="flex-1 rounded-md border border-border bg-obsidian px-2 py-1 text-xs text-parchment outline-none"
          />
        </div>
        <textarea
          v-model="rule.description"
          rows="2"
          placeholder="Description…"
          class="w-full rounded-md border border-border bg-obsidian px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
        />
      </div>
    </div>
  </div>
</template>
