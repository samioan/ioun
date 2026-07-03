<script setup lang="ts">
import { PhStar } from '@phosphor-icons/vue'
import type { RulesEntry } from '@/types'

const props = defineProps<{ entry: RulesEntry }>()
const emit = defineEmits<{ select: []; 'toggle-favorite': [] }>()

function onFavoriteClick(event: MouseEvent) {
  event.stopPropagation()
  emit('toggle-favorite')
}
</script>

<template>
  <div class="cursor-pointer rounded-md border border-border bg-slate p-3 hover:border-gold" @click="$emit('select')">
    <div class="flex items-center justify-between gap-2">
      <p class="truncate text-sm text-parchment">{{ entry.title || 'Untitled Rule' }}</p>
      <button type="button" class="tap-target shrink-0 text-ink hover:text-gold" @click="onFavoriteClick">
        <PhStar :size="16" :weight="entry.isFavorited ? 'fill' : 'regular'" :class="entry.isFavorited ? 'text-gold' : ''" />
      </button>
    </div>
    <div class="mt-2 flex items-center gap-2 text-xs text-ink">
      <span v-if="entry.category" class="rounded-full border border-border px-2 py-0.5">{{ entry.category }}</span>
      <span v-if="!entry.isCustom" class="rounded-full border border-border px-2 py-0.5">Sample</span>
    </div>
  </div>
</template>
