<script setup lang="ts">
import { PhSword, PhShieldCheckered, PhGhost, PhLockKey, PhRocket, PhPuzzlePiece } from '@phosphor-icons/vue'
import { systemPresets } from '@/data/system-presets'

const props = defineProps<{ draft: { systemPresetId: string } }>()

const ICONS: Record<string, unknown> = {
  dnd5e: PhSword,
  pathfinder2e: PhShieldCheckered,
  coc7e: PhGhost,
  blades: PhLockKey,
  mothership: PhRocket,
  generic: PhPuzzlePiece,
}
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-ink">Don't worry — you can change or customise this any time.</p>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        v-for="preset in systemPresets"
        :key="preset.id"
        type="button"
        class="tap-target flex flex-col items-start gap-1 rounded-md border px-4 py-3 text-left transition-colors"
        :class="props.draft.systemPresetId === preset.id ? 'border-gold bg-slate' : 'border-border hover:bg-slate'"
        @click="props.draft.systemPresetId = preset.id"
      >
        <span class="flex items-center gap-2 font-display text-lg text-gold">
          <component :is="ICONS[preset.id]" :size="20" />
          {{ preset.name }}
        </span>
        <span class="text-sm text-ink">{{ preset.notes }}</span>
      </button>
    </div>
  </div>
</template>
