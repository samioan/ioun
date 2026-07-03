<script setup lang="ts">
import { ref, computed } from 'vue'
import { PhDotsThreeVertical, PhUserCircle, PhSkull } from '@phosphor-icons/vue'
import HPBar from '@/components/shared/HPBar.vue'
import ConditionPicker from '@/components/shared/ConditionPicker.vue'
import type { InitiativeEntry } from '@/types'

const props = defineProps<{ entry: InitiativeEntry; name: string; isActive: boolean }>()
const emit = defineEmits<{
  'update:hp': [number]
  'update:conditions': [string[]]
  viewDetail: []
  duplicate: []
  remove: []
}>()

const menuOpen = ref(false)
const isDown = computed(() => props.entry.healthCurrent <= 0)
const primaryDerived = computed(() => props.entry.derivedStats[0])

function selectViewDetail() {
  emit('viewDetail')
  menuOpen.value = false
}

function selectDuplicate() {
  emit('duplicate')
  menuOpen.value = false
}

function selectRemove() {
  emit('remove')
  menuOpen.value = false
}
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-3 rounded-md border-l-2 px-3 py-2"
    :class="[isActive ? 'border-gold bg-slate' : 'border-transparent', isDown ? 'bg-crimson/10' : '']"
  >
    <component :is="entry.entityType === 'enemy' ? PhSkull : PhUserCircle" :size="24" class="shrink-0 text-ink" />
    <button
      type="button"
      class="min-w-0 flex-1 truncate text-left text-sm text-parchment hover:text-gold"
      @click="emit('viewDetail')"
    >
      {{ name }}
      <span v-if="isDown" class="ml-1 rounded-full bg-crimson px-1.5 py-0.5 text-[10px] uppercase text-parchment">
        Down
      </span>
    </button>
    <span v-if="primaryDerived" class="font-mono text-xs text-ink">{{ primaryDerived.label }} {{ primaryDerived.value }}</span>
    <HPBar
      :current="entry.healthCurrent"
      :max="entry.healthMax"
      :temp="entry.healthTemp"
      @update:current="(v) => emit('update:hp', v)"
    />
    <ConditionPicker :model-value="entry.conditions" @update:model-value="(v) => emit('update:conditions', v)" />
    <div class="relative">
      <button
        type="button"
        class="tap-target flex items-center justify-center text-ink hover:text-gold"
        @click="menuOpen = !menuOpen"
      >
        <PhDotsThreeVertical :size="18" />
      </button>
      <div
        v-if="menuOpen"
        class="absolute right-0 top-full z-10 mt-1 w-40 rounded-md border border-border bg-obsidian p-1 shadow-xl"
      >
        <button
          type="button"
          class="tap-target block w-full rounded-md px-2 py-1 text-left text-sm text-parchment hover:bg-slate"
          @click="selectViewDetail"
        >
          View Detail
        </button>
        <button
          v-if="entry.entityType === 'enemy'"
          type="button"
          class="tap-target block w-full rounded-md px-2 py-1 text-left text-sm text-parchment hover:bg-slate"
          @click="selectDuplicate"
        >
          Duplicate
        </button>
        <button
          type="button"
          class="tap-target block w-full rounded-md px-2 py-1 text-left text-sm text-crimson hover:bg-slate"
          @click="selectRemove"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
