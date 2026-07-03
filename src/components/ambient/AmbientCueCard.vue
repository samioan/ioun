<script setup lang="ts">
import { PhArrowSquareOut } from '@phosphor-icons/vue'
import type { AmbientCue } from '@/types'

const props = defineProps<{ cue: AmbientCue }>()
defineEmits<{ select: [] }>()

const TYPE_LABEL: Record<AmbientCue['type'], string> = {
  music: 'Music',
  ambience: 'Ambience',
  sfx: 'SFX',
}

function openCue(event: MouseEvent) {
  event.stopPropagation()
  if (props.cue.url.trim()) window.open(props.cue.url, '_blank', 'noopener')
}
</script>

<template>
  <div class="cursor-pointer rounded-md border border-border bg-slate p-3 hover:border-gold" @click="$emit('select')">
    <div class="flex items-center justify-between gap-2">
      <p class="truncate text-sm text-parchment">{{ cue.name || 'Untitled Cue' }}</p>
      <button
        type="button"
        class="tap-target shrink-0 text-ink hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="!cue.url.trim()"
        title="Open in new tab"
        @click="openCue"
      >
        <PhArrowSquareOut :size="16" />
      </button>
    </div>
    <div class="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-ink">
      <span class="rounded-full border border-border px-2 py-0.5">{{ TYPE_LABEL[cue.type] }}</span>
      <span v-for="tag in cue.tags" :key="tag" class="rounded-full border border-gold-dim px-2 py-0.5 text-gold">
        {{ tag }}
      </span>
    </div>
  </div>
</template>
