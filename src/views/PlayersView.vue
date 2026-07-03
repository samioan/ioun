<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhUsersThree } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { usePlayerStore } from '@/stores/players'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import PlayerCard from '@/components/players/PlayerCard.vue'
import PlayerFormDialog from '@/components/players/PlayerFormDialog.vue'
import RestDialog from '@/components/players/RestDialog.vue'
import AwardXPDialog from '@/components/players/AwardXPDialog.vue'

const campaignStore = useCampaignStore()
const playerStore = usePlayerStore()

const hasCampaign = computed(() => !!campaignStore.getActive())
const players = computed(() => Object.values(playerStore.items))

const showWizard = ref(false)
const showAddPlayer = ref(false)
const showRest = ref(false)
const showAwardXP = ref(false)

function removePlayer(id: string, name: string) {
  if (window.confirm(`Remove ${name || 'this player'}? This cannot be undone.`)) {
    playerStore.remove(id)
  }
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhUsersThree :size="40" class="text-ink" />
    <p class="max-w-md text-ink">
      Create a campaign first — the roster needs a system to know what stats and skills to track.
    </p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else>
    <PageHeader title="Players">
      <template #actions>
        <Button label="Rest" class="!bg-transparent !text-ink hover:!text-gold" @click="showRest = true" />
        <Button
          label="Award XP to All"
          class="!bg-transparent !text-ink hover:!text-gold"
          @click="showAwardXP = true"
        />
        <Button label="Add Player" @click="showAddPlayer = true" />
      </template>
    </PageHeader>

    <div v-if="players.length === 0" class="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <PhUsersThree :size="40" class="text-ink" />
      <p class="text-ink">Add your party. Track their HP, conditions, and story from one place.</p>
      <Button label="Add Player" @click="showAddPlayer = true" />
    </div>

    <div v-else class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
      <PlayerCard
        v-for="player in players"
        :key="player.id"
        :player="player"
        @remove="removePlayer(player.id, player.name)"
      />
    </div>

    <PlayerFormDialog v-model:visible="showAddPlayer" />
    <RestDialog v-model:visible="showRest" :players="players" />
    <AwardXPDialog v-model:visible="showAwardXP" :players="players" />
  </div>
</template>
