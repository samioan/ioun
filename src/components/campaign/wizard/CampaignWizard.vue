<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Button from 'primevue/button'
import { PhX } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { usePlayerStore } from '@/stores/players'
import { getSystemPreset, systemPresets } from '@/data/system-presets'
import { createDefaultCampaign, createDefaultPlayer } from '@/utils/defaults'
import WizardStepName from './WizardStepName.vue'
import WizardStepSystem from './WizardStepSystem.vue'
import WizardStepPlayers from './WizardStepPlayers.vue'
import WizardStepReady from './WizardStepReady.vue'

const emit = defineEmits<{ complete: []; cancel: [] }>()

const campaignStore = useCampaignStore()
const playerStore = usePlayerStore()

const STEP_TITLES = ['Name your campaign', 'Choose your system', 'Add your players', 'Ready']
const currentStep = ref(1)

const draft = reactive({
  name: '',
  description: '',
  coverImageUrl: '',
  systemPresetId: 'dnd5e',
  players: [] as { name: string; playerName: string }[],
})

const canProceed = computed(() => {
  if (currentStep.value === 1) return draft.name.trim().length > 0
  return true
})

const hasPlayerRows = computed(() => draft.players.some((p) => p.name.trim() || p.playerName.trim()))

const primaryLabel = computed(() => {
  if (currentStep.value === 3) return hasPlayerRows.value ? 'Continue' : 'Skip for now'
  if (currentStep.value === 4) return 'Open Campaign'
  return 'Next'
})

function back() {
  if (currentStep.value > 1) currentStep.value -= 1
}

function primaryAction() {
  if (currentStep.value < 4) {
    currentStep.value += 1
    return
  }
  finish()
}

function finish() {
  const campaign = campaignStore.add(
    createDefaultCampaign({
      name: draft.name.trim(),
      description: draft.description.trim(),
      coverImageUrl: draft.coverImageUrl.trim() || undefined,
      systemDefinition: getSystemPreset(draft.systemPresetId) ?? systemPresets[systemPresets.length - 1],
    }),
  )
  campaignStore.setActive(campaign.id)

  for (const row of draft.players) {
    if (!row.name.trim() && !row.playerName.trim()) continue
    playerStore.add(createDefaultPlayer({ name: row.name.trim(), playerName: row.playerName.trim() }))
  }

  emit('complete')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex flex-col bg-void">
    <div class="flex items-center justify-between border-b border-border px-6 py-4">
      <div class="flex items-center gap-3">
        <span
          v-for="step in 4"
          :key="step"
          class="h-2 w-2 rounded-full"
          :class="step <= currentStep ? 'bg-gold' : 'bg-border'"
        />
        <span class="ml-2 font-display text-lg text-gold">{{ STEP_TITLES[currentStep - 1] }}</span>
      </div>
      <button
        type="button"
        class="tap-target flex items-center justify-center text-ink hover:text-gold"
        @click="emit('cancel')"
      >
        <PhX :size="20" />
      </button>
    </div>

    <div class="flex flex-1 items-center justify-center overflow-y-auto px-6 py-8">
      <div class="w-full max-w-xl">
        <WizardStepName v-if="currentStep === 1" :draft="draft" />
        <WizardStepSystem v-else-if="currentStep === 2" :draft="draft" />
        <WizardStepPlayers v-else-if="currentStep === 3" :draft="draft" />
        <WizardStepReady v-else :draft="draft" />
      </div>
    </div>

    <div class="flex items-center justify-between border-t border-border px-6 py-4">
      <Button v-if="currentStep > 1" label="Back" class="!bg-transparent !text-ink hover:!text-gold" @click="back" />
      <span v-else />
      <Button :label="primaryLabel" :disabled="!canProceed" @click="primaryAction" />
    </div>
  </div>
</template>
