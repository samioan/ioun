<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { PhTrash, PhUserCircle } from '@phosphor-icons/vue'
import HPBar from '@/components/shared/HPBar.vue'
import ConditionPicker from '@/components/shared/ConditionPicker.vue'
import type { Player } from '@/types'

const props = defineProps<{ player: Player }>()
const emit = defineEmits<{ remove: [] }>()

const firstDerived = computed(() => props.player.derivedStats[0])

function updateHP(value: number) {
  props.player.health.current = value
}

function updateConditions(conditions: string[]) {
  props.player.conditions = conditions
}
</script>

<template>
  <div class="flex flex-col gap-3 rounded-md border border-border bg-obsidian p-4">
    <div class="flex items-start justify-between gap-2">
      <RouterLink :to="`/players/${player.id}`" class="flex items-center gap-3 hover:text-gold">
        <PhUserCircle :size="36" class="text-ink" />
        <div>
          <p class="font-display text-lg text-parchment">{{ player.name || 'Unnamed' }}</p>
          <p class="text-xs text-ink">
            {{ player.characterClass || 'No class' }}
            <span v-if="player.progressionValue">· Lv {{ player.progressionValue }}</span>
          </p>
        </div>
      </RouterLink>
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="emit('remove')">
        <PhTrash :size="16" />
      </button>
    </div>

    <HPBar
      :current="player.health.current"
      :max="player.health.max"
      :temp="player.health.temp"
      @update:current="updateHP"
    />

    <div v-if="firstDerived" class="text-xs text-ink">
      {{ firstDerived.label }}: <span class="text-parchment">{{ firstDerived.value }}</span>
    </div>

    <ConditionPicker :model-value="player.conditions" @update:model-value="updateConditions" />
  </div>
</template>
