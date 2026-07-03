<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhMapTrifold } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useWorldStore } from '@/stores/world'
import { createDefaultLandmark } from '@/utils/defaults'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import LandmarkTree from '@/components/world/LandmarkTree.vue'
import LandmarkDetail from '@/components/world/LandmarkDetail.vue'
import type { Landmark } from '@/types'

const campaignStore = useCampaignStore()
const worldStore = useWorldStore()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

const selectedId = ref<string | null>(null)
const selected = computed(() => (selectedId.value ? worldStore.getById(selectedId.value) : undefined))

// Flattened depth-indented tree, guarded against cycles and dangling
// parentId pointers — usePersistence does a raw Object.assign on load with
// no schema validation, so hand-edited/imported JSON could already contain
// a cycle regardless of any UI-level prevention.
const treeNodes = computed(() => {
  const landmarks = Object.values(worldStore.items)
  const byId = new Map(landmarks.map((l) => [l.id, l]))
  const childrenOf = new Map<string | undefined, Landmark[]>()
  for (const landmark of landmarks) {
    const key = landmark.parentId && byId.has(landmark.parentId) ? landmark.parentId : undefined
    if (!childrenOf.has(key)) childrenOf.set(key, [])
    childrenOf.get(key)!.push(landmark)
  }
  for (const list of childrenOf.values()) list.sort((a, b) => a.name.localeCompare(b.name))

  const result: { landmark: Landmark; depth: number }[] = []
  const visited = new Set<string>()
  function visit(parentKey: string | undefined, depth: number) {
    for (const child of childrenOf.get(parentKey) ?? []) {
      if (visited.has(child.id)) continue
      visited.add(child.id)
      result.push({ landmark: child, depth })
      visit(child.id, depth + 1)
    }
  }
  visit(undefined, 0)
  return result
})

// A landmark can't be set as its own parent — deeper descendant-cycle
// prevention isn't built (documented gap); the walk-time guard above
// handles runtime safety regardless of what the UI allows.
const parentOptions = computed(() =>
  Object.values(worldStore.items)
    .filter((l) => l.id !== selectedId.value)
    .map((l) => ({ id: l.id, label: l.name })),
)

function addLandmark() {
  const landmark = worldStore.add(createDefaultLandmark({ name: 'New Landmark' }))
  selectedId.value = landmark.id
}

function removeLandmark(id: string) {
  if (window.confirm('Remove this landmark? This cannot be undone.')) {
    worldStore.remove(id)
    if (selectedId.value === id) selectedId.value = null
  }
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhMapTrifold :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start building your world.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="World">
      <template #actions>
        <Button label="Add Landmark" @click="addLandmark" />
      </template>
    </PageHeader>
    <div class="flex flex-1 overflow-hidden">
      <div class="h-full w-72 shrink-0 overflow-y-auto border-r border-border">
        <div v-if="treeNodes.length === 0" class="flex flex-col items-center gap-3 px-4 py-16 text-center">
          <PhMapTrifold :size="32" class="text-ink" />
          <p class="text-sm text-ink">No landmarks yet. Add your first location to start mapping the world.</p>
        </div>
        <LandmarkTree :nodes="treeNodes" :selected-id="selectedId" @select="selectedId = $event" />
      </div>
      <div class="flex-1 overflow-y-auto">
        <LandmarkDetail
          v-if="selected"
          :landmark="selected"
          :parent-options="parentOptions"
          @remove="removeLandmark(selected.id)"
        />
        <p v-else class="p-6 text-sm text-ink">Select a landmark to view details.</p>
      </div>
    </div>
  </div>
</template>
