<script setup lang="ts">
import { ref } from 'vue'
import { PhCaretDown, PhCaretUp } from '@phosphor-icons/vue'
import { useSystemDefinition } from '@/composables/useSystemDefinition'

const { system, getRestTypes } = useSystemDefinition()
const open = ref(false)
</script>

<template>
  <div v-if="system" class="border-b border-border px-6 py-4">
    <button type="button" class="flex w-full items-center justify-between text-left" @click="open = !open">
      <p class="font-display text-lg text-gold">System Reference — {{ system.name }}</p>
      <component :is="open ? PhCaretUp : PhCaretDown" :size="18" class="text-ink" />
    </button>
    <div v-if="open" class="mt-3 flex flex-col gap-4">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Conditions</p>
        <p v-if="system.conditions.length === 0" class="text-xs text-ink">No conditions defined for this system.</p>
        <div v-else class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div
            v-for="condition in system.conditions"
            :key="condition.key"
            class="rounded-md border border-border bg-slate p-2"
          >
            <p class="text-sm font-semibold text-parchment">{{ condition.label }}</p>
            <p class="text-xs text-ink">{{ condition.description }}</p>
          </div>
        </div>
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Resting</p>
        <p v-if="getRestTypes().length === 0" class="text-xs text-ink">No rest types defined for this system.</p>
        <div v-else class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div
            v-for="rest in getRestTypes()"
            :key="rest.key"
            class="rounded-md border border-border bg-slate p-2"
          >
            <p class="text-sm font-semibold text-parchment">
              {{ rest.label }} <span class="text-xs text-ink">({{ rest.durationHint }})</span>
            </p>
            <p class="text-xs text-ink">{{ rest.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
