<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { PhTrash, PhDoorOpen } from '@phosphor-icons/vue'
import { useWorldStore } from '@/stores/world'
import type { Dungeon } from '@/types'

const props = defineProps<{ dungeon: Dungeon }>()
const emit = defineEmits<{ remove: [] }>()

const worldStore = useWorldStore()

const linkedLandmark = computed(() =>
  props.dungeon.linkedLandmarkId ? worldStore.getById(props.dungeon.linkedLandmarkId) : undefined,
)

const exploredCount = computed(() => props.dungeon.rooms.filter((r) => r.isExplored).length)
const roomCount = computed(() => props.dungeon.rooms.length)
const progress = computed(() => (roomCount.value === 0 ? 0 : Math.round((exploredCount.value / roomCount.value) * 100)))
</script>

<template>
  <div class="flex flex-col gap-3 rounded-md border border-border bg-obsidian p-4">
    <div class="flex items-start justify-between gap-2">
      <RouterLink :to="`/dungeons/${dungeon.id}`" class="flex items-center gap-3 hover:text-gold">
        <PhDoorOpen :size="32" class="text-ink" />
        <div>
          <p class="font-display text-lg text-parchment">{{ dungeon.name || 'Unnamed Dungeon' }}</p>
          <p class="text-xs text-ink">
            {{ dungeon.type }}
            <span v-if="dungeon.isCompleted" class="text-gold">· Cleared</span>
          </p>
        </div>
      </RouterLink>
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="emit('remove')">
        <PhTrash :size="16" />
      </button>
    </div>

    <div>
      <p class="mb-1 text-xs text-ink">{{ exploredCount }}/{{ roomCount }} rooms explored</p>
      <div class="h-1.5 overflow-hidden rounded-full bg-slate">
        <div class="h-full bg-gold" :style="{ width: progress + '%' }" />
      </div>
    </div>

    <p v-if="linkedLandmark" class="text-xs text-ink">At {{ linkedLandmark.name }}</p>
  </div>
</template>
