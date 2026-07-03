<script setup lang="ts">
import { PhTrash } from '@phosphor-icons/vue'
import { useRulesStore } from '@/stores/rules'
import { useSidePanel } from '@/composables/useSidePanel'
import type { RulesEntry } from '@/types'

const props = defineProps<{ entry: RulesEntry }>()

const rulesStore = useRulesStore()
const sidePanel = useSidePanel()

function remove() {
  if (window.confirm('Remove this rule entry? This cannot be undone.')) {
    rulesStore.remove(props.entry.id)
    sidePanel.close()
  }
}

function addTag() {
  props.entry.tags.push('')
}
function removeTag(index: number) {
  props.entry.tags.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-start justify-between gap-3">
      <input
        v-model="entry.title"
        placeholder="Rule Title"
        class="w-full bg-transparent font-display text-xl text-gold outline-none"
      />
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="remove">
        <PhTrash :size="18" />
      </button>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <input v-model="entry.category" placeholder="Category" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
      <input v-model="entry.system" placeholder="System (e.g. dnd5e)" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold" />
    </div>

    <div class="flex items-center gap-4 text-sm text-ink">
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="entry.isFavorited" class="h-4 w-4 accent-gold" /> Favorited
      </label>
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="entry.isCustom" class="h-4 w-4 accent-gold" /> Custom
      </label>
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Content (markdown)</label>
      <textarea
        v-model="entry.content"
        rows="8"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Tags</p>
      <div class="flex flex-wrap items-center gap-2">
        <div v-for="(_tag, index) in entry.tags" :key="index" class="flex items-center gap-1 rounded-full border border-border bg-slate px-2 py-0.5 text-xs text-parchment">
          <input v-model="entry.tags[index]" class="w-16 bg-transparent outline-none" />
          <button type="button" class="text-ink hover:text-crimson" @click="removeTag(index)">
            <PhTrash :size="10" />
          </button>
        </div>
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="addTag">+ Add tag</button>
      </div>
    </div>
  </div>
</template>
