<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { PhX } from '@phosphor-icons/vue'
import { useSystemDefinition } from '@/composables/useSystemDefinition'
import type { Player } from '@/types'

const props = defineProps<{ visible: boolean; players: Player[] }>()
const emit = defineEmits<{ 'update:visible': [boolean] }>()

const { getRestTypes } = useSystemDefinition()

// One generic mechanism for every configured rest type: full HP restore +
// recharge anything whose rechargeOn matches this rest type's key. No
// hit-dice-spend granularity, no 5e-specific "short heals less" distinction
// — no data-model field encodes rest potency, so this applies uniformly.
function applyRest(restKey: string) {
  for (const player of props.players) {
    player.health.current = player.health.max
    for (const pool of player.resourcePools) {
      if (pool.rechargeOn === restKey) pool.current = pool.max
    }
    for (const feature of player.features) {
      if (feature.uses && feature.uses.rechargeOn === restKey) feature.uses.current = feature.uses.max
    }
    for (const tracker of player.trackers) {
      if (tracker.rechargeOn === restKey) tracker.current = tracker.max
    }
  }
  close()
}

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
    class="w-full max-w-md"
    @update:visible="close"
  >
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <h2 class="font-display text-lg text-gold">Rest</h2>
      <button type="button" class="tap-target text-ink hover:text-gold" @click="close">
        <PhX :size="18" />
      </button>
    </div>
    <div class="flex flex-col gap-2 p-4">
      <p v-if="getRestTypes().length === 0" class="text-sm text-ink">
        This system has no rest types configured yet.
      </p>
      <button
        v-for="rest in getRestTypes()"
        :key="rest.key"
        type="button"
        class="tap-target rounded-md border border-border px-3 py-2 text-left hover:border-gold hover:bg-slate"
        @click="applyRest(rest.key)"
      >
        <p class="text-parchment">{{ rest.label }}</p>
        <p class="text-xs text-ink">{{ rest.description }} · {{ rest.durationHint }}</p>
      </button>
    </div>
  </Dialog>
</template>
