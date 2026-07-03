<script setup lang="ts">
import { computed } from 'vue'
import { PhTrash } from '@phosphor-icons/vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { useWorldStore } from '@/stores/world'
import { useAmbientStore } from '@/stores/ambient'
import { useSidePanel } from '@/composables/useSidePanel'
import type { AmbientCue } from '@/types'

const props = defineProps<{ cue: AmbientCue }>()

const worldStore = useWorldStore()
const ambientStore = useAmbientStore()
const sidePanel = useSidePanel()

const TYPES: AmbientCue['type'][] = ['music', 'ambience', 'sfx']

const landmarkOptions = computed(() => Object.values(worldStore.items).map((l) => ({ id: l.id, label: l.name })))

const linkedLandmark = computed<string[]>({
  get: () => (props.cue.linkedLandmarkId ? [props.cue.linkedLandmarkId] : []),
  set: (v) => {
    props.cue.linkedLandmarkId = v[0]
  },
})

function addTag() {
  props.cue.tags.push('')
}
function removeTag(index: number) {
  props.cue.tags.splice(index, 1)
}

function remove() {
  if (window.confirm('Remove this ambient cue? This cannot be undone.')) {
    ambientStore.remove(props.cue.id)
    sidePanel.close()
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-start justify-between gap-3">
      <input
        v-model="cue.name"
        placeholder="Cue Name"
        class="w-full bg-transparent font-display text-xl text-gold outline-none"
      />
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="remove">
        <PhTrash :size="18" />
      </button>
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">URL</label>
      <input
        v-model="cue.url"
        placeholder="https://open.spotify.com/…"
        class="w-full rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <select v-model="cue.type" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment">
      <option v-for="t in TYPES" :key="t" :value="t">{{ t }}</option>
    </select>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Mood Tags</p>
      <div class="flex flex-wrap items-center gap-2">
        <div
          v-for="(_tag, index) in cue.tags"
          :key="index"
          class="flex items-center gap-1 rounded-full border border-border bg-slate px-2 py-0.5 text-xs text-parchment"
        >
          <input v-model="cue.tags[index]" class="w-16 bg-transparent outline-none" />
          <button type="button" class="text-ink hover:text-crimson" @click="removeTag(index)">
            <PhTrash :size="10" />
          </button>
        </div>
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="addTag">
          + Add tag
        </button>
      </div>
    </div>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Linked Landmark</p>
      <EntityLinkList v-model="linkedLandmark" :options="landmarkOptions" :max="1" />
    </div>
  </div>
</template>
