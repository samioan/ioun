<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhUserCircle } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useNPCStore } from '@/stores/npcs'
import { createDefaultNPC } from '@/utils/defaults'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import NPCCard from '@/components/world/NPCCard.vue'
import NPCDetail from '@/components/world/NPCDetail.vue'

const campaignStore = useCampaignStore()
const npcStore = useNPCStore()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

const npcs = computed(() => Object.values(npcStore.items).sort((a, b) => a.name.localeCompare(b.name)))
const selectedId = ref<string | null>(null)
const selected = computed(() => (selectedId.value ? npcStore.getById(selectedId.value) : undefined))

function addNPC() {
  const npc = npcStore.add(createDefaultNPC({ name: 'New NPC' }))
  selectedId.value = npc.id
}

function removeNPC(id: string) {
  if (window.confirm('Remove this NPC? This cannot be undone.')) {
    npcStore.remove(id)
    if (selectedId.value === id) selectedId.value = null
  }
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhUserCircle :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start tracking NPCs.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="NPCs">
      <template #actions>
        <Button label="Add NPC" @click="addNPC" />
      </template>
    </PageHeader>
    <div class="flex flex-1 overflow-hidden">
      <div class="h-full w-72 shrink-0 overflow-y-auto border-r border-border">
        <div v-if="npcs.length === 0" class="flex flex-col items-center gap-3 px-4 py-16 text-center">
          <PhUserCircle :size="32" class="text-ink" />
          <p class="text-sm text-ink">The world is empty. Add the first face your players will meet.</p>
        </div>
        <NPCCard
          v-for="npc in npcs"
          :key="npc.id"
          :npc="npc"
          :is-selected="npc.id === selectedId"
          @select="selectedId = npc.id"
        />
      </div>
      <div class="flex-1 overflow-y-auto">
        <NPCDetail v-if="selected" :npc="selected" @remove="removeNPC(selected.id)" />
        <p v-else class="p-6 text-sm text-ink">Select an NPC to view details.</p>
      </div>
    </div>
  </div>
</template>
