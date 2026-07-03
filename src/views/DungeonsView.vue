<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { PhDoorOpen } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useDungeonStore } from '@/stores/dungeons'
import { createDefaultDungeon } from '@/utils/defaults'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import DungeonCard from '@/components/dungeons/DungeonCard.vue'

const campaignStore = useCampaignStore()
const dungeonStore = useDungeonStore()
const router = useRouter()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

const dungeons = computed(() => Object.values(dungeonStore.items).sort((a, b) => a.name.localeCompare(b.name)))

function addDungeon() {
  const dungeon = dungeonStore.add(createDefaultDungeon({ name: 'New Dungeon' }))
  router.push(`/dungeons/${dungeon.id}`)
}

function removeDungeon(id: string) {
  if (window.confirm('Remove this dungeon? This cannot be undone.')) {
    dungeonStore.remove(id)
  }
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhDoorOpen :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start mapping dungeons.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else>
    <PageHeader title="Dungeon Planner">
      <template #actions>
        <Button label="Add Dungeon" @click="addDungeon" />
      </template>
    </PageHeader>

    <div v-if="dungeons.length === 0" class="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <PhDoorOpen :size="40" class="text-ink" />
      <p class="text-ink">No dungeons prepped yet. Map out the first site your party will crawl.</p>
      <Button label="Add Dungeon" @click="addDungeon" />
    </div>

    <div v-else class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
      <DungeonCard
        v-for="dungeon in dungeons"
        :key="dungeon.id"
        :dungeon="dungeon"
        @remove="removeDungeon(dungeon.id)"
      />
    </div>
  </div>
</template>
