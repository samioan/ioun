<script setup lang="ts">
import { ref, computed } from 'vue'
import { PhPlus, PhX } from '@phosphor-icons/vue'
import { useSystemDefinition } from '@/composables/useSystemDefinition'

const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const { system, getConditionByKey } = useSystemDefinition()
const pickerOpen = ref(false)

const available = computed(() => (system.value?.conditions ?? []).filter((c) => !props.modelValue.includes(c.key)))

function add(key: string) {
  emit('update:modelValue', [...props.modelValue, key])
  pickerOpen.value = false
}

function remove(key: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((k) => k !== key),
  )
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <span
      v-for="key in modelValue"
      :key="key"
      :title="getConditionByKey(key)?.description"
      class="flex items-center gap-1 rounded-full border border-gold-dim bg-slate px-2 py-0.5 text-xs text-parchment"
    >
      {{ getConditionByKey(key)?.label ?? key }}
      <button type="button" class="text-ink hover:text-crimson" @click="remove(key)">
        <PhX :size="12" />
      </button>
    </span>

    <div class="relative">
      <button
        type="button"
        class="tap-target flex items-center justify-center rounded-full border border-border text-ink hover:border-gold hover:text-gold"
        @click="pickerOpen = !pickerOpen"
      >
        <PhPlus :size="14" />
      </button>
      <div
        v-if="pickerOpen"
        class="absolute left-0 top-full z-10 mt-1 max-h-48 w-48 overflow-y-auto rounded-md border border-border bg-obsidian p-1 shadow-xl"
      >
        <p v-if="available.length === 0" class="px-2 py-1 text-xs text-ink">No more conditions defined.</p>
        <button
          v-for="condition in available"
          :key="condition.key"
          type="button"
          class="tap-target block w-full rounded-md px-2 py-1 text-left text-sm text-parchment hover:bg-slate"
          @click="add(condition.key)"
        >
          {{ condition.label }}
        </button>
      </div>
    </div>
  </div>
</template>
