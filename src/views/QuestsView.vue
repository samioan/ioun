<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhScroll } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useQuestsStore } from '@/stores/quests'
import { createDefaultQuest } from '@/utils/defaults'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import QuestBoard from '@/components/quests/QuestBoard.vue'

const campaignStore = useCampaignStore()
const questsStore = useQuestsStore()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)
const hasQuests = computed(() => Object.keys(questsStore.items).length > 0)

function addQuest() {
  questsStore.add(createDefaultQuest({ title: 'New Quest' }))
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhScroll :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start tracking quests.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Quest Board">
      <template #actions>
        <Button label="Add Quest" @click="addQuest" />
      </template>
    </PageHeader>

    <div class="flex-1 overflow-y-auto">
      <div v-if="!hasQuests" class="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <PhScroll :size="32" class="text-ink" />
        <p class="text-sm text-ink">No quests yet. Add the first job, bounty, or duty your party has taken on.</p>
      </div>
      <QuestBoard v-else />
    </div>
  </div>
</template>
