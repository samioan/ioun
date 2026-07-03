<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCampaignStore } from '@/stores/campaign'
import { useSessionStore } from '@/stores/session'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import InlineTip from '@/components/shared/InlineTip.vue'
import DashboardWelcome from '@/components/dashboard/DashboardWelcome.vue'
import DashboardStartHere from '@/components/dashboard/DashboardStartHere.vue'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardAtAGlance from '@/components/dashboard/DashboardAtAGlance.vue'
import DashboardPlayerHP from '@/components/dashboard/DashboardPlayerHP.vue'
import DashboardStoryBeat from '@/components/dashboard/DashboardStoryBeat.vue'
import DashboardLastSession from '@/components/dashboard/DashboardLastSession.vue'
import DashboardUrgentTopics from '@/components/dashboard/DashboardUrgentTopics.vue'
import DashboardUpcomingEvents from '@/components/dashboard/DashboardUpcomingEvents.vue'
import DashboardPrepChecklist from '@/components/dashboard/DashboardPrepChecklist.vue'
import DashboardActiveQuests from '@/components/dashboard/DashboardActiveQuests.vue'

const campaignStore = useCampaignStore()
const sessionStore = useSessionStore()

const hasCampaign = computed(() => !!campaignStore.getActive())
const hasSessions = computed(() => Object.keys(sessionStore.items).length > 0)

const showWizard = ref(false)

function onWizardComplete() {
  showWizard.value = false
}
</script>

<template>
  <div class="flex h-full flex-col">
    <template v-if="hasCampaign">
      <DashboardHeader />
      <InlineTip tip-key="dashboard-welcome" class="mx-6 mb-4">
        New here? The sidebar (left) holds every section, Session under Play is your live-play cockpit, and
        Settings has full JSON export/import for backups.
      </InlineTip>
      <DashboardStartHere v-if="!hasSessions" />
      <div class="flex-1 overflow-y-auto">
        <DashboardAtAGlance v-if="hasSessions" />
        <DashboardPlayerHP />
        <DashboardStoryBeat />
        <DashboardLastSession />
        <DashboardUrgentTopics />
        <DashboardUpcomingEvents />
        <DashboardPrepChecklist />
        <DashboardActiveQuests />
      </div>
    </template>

    <DashboardWelcome v-else @create="showWizard = true" />

    <CampaignWizard v-if="showWizard" @complete="onWizardComplete" @cancel="showWizard = false" />
  </div>
</template>
