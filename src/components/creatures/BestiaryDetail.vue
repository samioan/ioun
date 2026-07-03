<script setup lang="ts">
import { computed } from 'vue'
import { PhTrash, PhSword, PhX } from '@phosphor-icons/vue'
import DynamicStatBlock from '@/components/players/DynamicStatBlock.vue'
import DerivedStatDisplay from '@/components/players/DerivedStatDisplay.vue'
import EntityActionList from './EntityActionList.vue'
import { getXpForChallengeRating } from '@/utils/challengeRating'
import type { BestiaryEntry } from '@/types'

const props = defineProps<{ entry: BestiaryEntry; canQuickAdd?: boolean }>()
const emit = defineEmits<{ remove: []; quickAdd: [] }>()

const xpHint = computed(() => getXpForChallengeRating(props.entry.threatRating))

function addTag() {
  props.entry.tags.push('')
}
function removeTag(index: number) {
  props.entry.tags.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1">
        <input
          v-model="entry.name"
          placeholder="Creature Name"
          class="w-full bg-transparent font-display text-2xl text-gold outline-none"
        />
        <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <input
            v-model="entry.type"
            placeholder="Type"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <input
            v-model="entry.size"
            placeholder="Size"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <input
            v-model="entry.threatRating"
            placeholder="CR"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <input
            v-model="entry.source"
            placeholder="Source"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
        </div>
        <p v-if="xpHint" class="mt-1 text-xs text-ink">≈ {{ xpHint.toLocaleString() }} XP</p>
      </div>
      <div class="flex shrink-0 gap-2">
        <button
          type="button"
          :disabled="!canQuickAdd"
          :title="canQuickAdd ? 'Add to the active encounter' : 'Begin a session to enable this'"
          class="tap-target flex items-center gap-1 rounded-md border border-gold-dim px-2 py-1 text-xs text-gold hover:bg-slate disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          @click="emit('quickAdd')"
        >
          <PhSword :size="14" /> Add to Encounter
        </button>
        <button type="button" class="tap-target text-ink hover:text-crimson" @click="emit('remove')">
          <PhTrash :size="18" />
        </button>
      </div>
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Default HP</label>
      <input
        type="number"
        v-model.number="entry.defaultHealth"
        class="w-24 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
      />
    </div>

    <section>
      <h2 class="mb-3 font-display text-lg text-gold">Stats</h2>
      <DynamicStatBlock :stats="entry.stats" />
    </section>

    <section v-if="entry.derivedStats.length">
      <h2 class="mb-3 font-display text-lg text-gold">Derived Stats</h2>
      <DerivedStatDisplay :derived-stats="entry.derivedStats" />
    </section>

    <section>
      <h2 class="mb-3 font-display text-lg text-gold">Actions</h2>
      <EntityActionList :actions="entry.actions" />
    </section>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Lore</label>
      <textarea
        v-model="entry.lore"
        rows="3"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Tags</p>
      <div class="flex flex-wrap items-center gap-2">
        <div
          v-for="(_tag, index) in entry.tags"
          :key="index"
          class="flex items-center gap-1 rounded-full border border-border bg-slate px-2 py-0.5 text-xs text-parchment"
        >
          <input v-model="entry.tags[index]" class="w-16 bg-transparent outline-none" />
          <button type="button" class="text-ink hover:text-crimson" @click="removeTag(index)">
            <PhX :size="10" />
          </button>
        </div>
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="addTag">
          + Add tag
        </button>
      </div>
    </div>
  </div>
</template>
