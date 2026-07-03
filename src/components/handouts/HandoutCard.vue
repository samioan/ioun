<script setup lang="ts">
import type { Handout } from '@/types'

defineProps<{ handout: Handout }>()
defineEmits<{ select: [] }>()

const TYPE_LABEL: Record<Handout['type'], string> = {
  letter: 'Letter',
  map: 'Map',
  journal: 'Journal',
  poster: 'Poster',
  riddle: 'Riddle',
  code: 'Code',
  prophecy: 'Prophecy',
  image: 'Image',
  other: 'Other',
}
</script>

<template>
  <div class="cursor-pointer rounded-md border border-border bg-slate p-3 hover:border-gold" @click="$emit('select')">
    <div class="flex items-center justify-between gap-2">
      <p class="truncate text-sm text-parchment">{{ handout.name || 'Untitled Handout' }}</p>
    </div>
    <div class="mt-2 flex items-center gap-2 text-xs text-ink">
      <span class="rounded-full border border-border px-2 py-0.5">{{ TYPE_LABEL[handout.type] }}</span>
      <span
        class="rounded-full border px-2 py-0.5"
        :class="handout.isRevealed ? 'border-gold-dim text-gold' : 'border-border'"
      >
        {{ handout.isRevealed ? 'Revealed' : 'DM only' }}
      </span>
    </div>
  </div>
</template>
