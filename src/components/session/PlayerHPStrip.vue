<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { usePlayerStore } from '@/stores/players'
import HPBar from '@/components/shared/HPBar.vue'
import ConditionPicker from '@/components/shared/ConditionPicker.vue'

const playerStore = usePlayerStore()
const players = computed(() => Object.values(playerStore.items))

function updateHp(id: string, value: number) {
  const p = playerStore.getById(id)
  if (p) p.health.current = value
}

function updateConditions(id: string, conditions: string[]) {
  const p = playerStore.getById(id)
  if (p) p.conditions = conditions
}
</script>

<template>
  <div class="flex items-center gap-3 overflow-x-auto border-t border-border bg-obsidian px-4 py-2">
    <div
      v-for="player in players"
      :key="player.id"
      class="flex shrink-0 items-center gap-2 rounded-md border px-2 py-1"
      :class="player.health.current <= 0 ? 'border-crimson' : 'border-border'"
    >
      <RouterLink :to="`/players/${player.id}`" class="text-xs text-parchment hover:text-gold">
        {{ player.name }}
      </RouterLink>
      <HPBar
        :current="player.health.current"
        :max="player.health.max"
        :temp="player.health.temp"
        @update:current="(v) => updateHp(player.id, v)"
      />
      <ConditionPicker :model-value="player.conditions" @update:model-value="(v) => updateConditions(player.id, v)" />
    </div>
    <p v-if="players.length === 0" class="text-sm text-ink">No players yet.</p>
  </div>
</template>
