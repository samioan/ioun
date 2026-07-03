<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import Button from 'primevue/button'
import { PhPlayCircle } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useSessionStore } from '@/stores/session'
import { useSessionMode } from '@/composables/useSessionMode'
import { useTipsStore } from '@/stores/tips'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import BeginSessionDialog from '@/components/session/BeginSessionDialog.vue'
import EndSessionDialog from '@/components/session/EndSessionDialog.vue'
import RecapModal from '@/components/session/RecapModal.vue'
import InitiativeTracker from '@/components/session/InitiativeTracker.vue'
import DiceRoller from '@/components/session/DiceRoller.vue'
import SessionNotes from '@/components/session/SessionNotes.vue'
import SessionEventLog from '@/components/session/SessionEventLog.vue'
import PlayerHPStrip from '@/components/session/PlayerHPStrip.vue'

const campaignStore = useCampaignStore()
const sessionStore = useSessionStore()
const tipsStore = useTipsStore()
const { isPlaying, activeSessionId } = useSessionMode()

const hasCampaign = computed(() => !!campaignStore.getActive())
const activeSession = computed(() =>
  activeSessionId.value ? sessionStore.getById(activeSessionId.value) : undefined,
)

const showWizard = ref(false)
const showBegin = ref(false)
const showEnd = ref(false)
const showRecap = ref(false)
const subMode = ref<'combat' | 'exploration'>('combat')

const previousSession = computed(() => {
  if (!activeSession.value) return undefined
  const earlier = Object.values(sessionStore.items).filter((s) => s.number < activeSession.value!.number)
  if (earlier.length === 0) return undefined
  return earlier.reduce((latest, s) => (s.number > latest.number ? s : latest))
})

// Show the "read last recap" prompt exactly once per session (not once per
// SessionView mount) — gated via the same persisted tips store used for
// every other one-time-ever banner in the app.
onMounted(() => {
  if (!activeSession.value || !previousSession.value?.recap) return
  const key = `session-recap-${activeSession.value.id}`
  if (!tipsStore.isDismissed(key)) {
    showRecap.value = true
    tipsStore.dismiss(key)
  }
})
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhPlayCircle :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start a session.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div
    v-else-if="!isPlaying || !activeSession"
    class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center"
  >
    <PhPlayCircle :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Ready to play? Start a session to track initiative, rolls, and events.</p>
    <Button label="Begin Session" @click="showBegin = true" />
    <BeginSessionDialog v-model:visible="showBegin" />
  </div>

  <div v-else class="flex h-full flex-col">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
      <div class="flex items-center gap-3">
        <div class="flex rounded-md border border-border">
          <button
            type="button"
            class="tap-target rounded-l-md px-3 py-1.5 text-sm"
            :class="subMode === 'combat' ? 'bg-slate text-gold' : 'text-ink'"
            @click="subMode = 'combat'"
          >
            Combat
          </button>
          <button
            type="button"
            class="tap-target rounded-r-md px-3 py-1.5 text-sm"
            :class="subMode === 'exploration' ? 'bg-slate text-gold' : 'text-ink'"
            @click="subMode = 'exploration'"
          >
            Exploration
          </button>
        </div>
        <span class="font-display text-lg text-gold">
          Session {{ activeSession.number }}<span v-if="activeSession.title"> · "{{ activeSession.title }}"</span>
        </span>
      </div>
      <Button label="End Session" class="!bg-transparent !text-crimson hover:!text-crimson" @click="showEnd = true" />
    </div>

    <div class="flex flex-1 overflow-hidden">
      <template v-if="subMode === 'combat'">
        <div class="w-[55%] overflow-y-auto border-r border-border">
          <InitiativeTracker :session="activeSession" />
        </div>
        <div class="w-[45%] overflow-y-auto">
          <DiceRoller :session="activeSession" />
        </div>
      </template>
      <template v-else>
        <div class="flex w-[60%] flex-col overflow-y-auto border-r border-border">
          <SessionNotes :session="activeSession" />
          <SessionEventLog :session="activeSession" />
        </div>
        <div class="w-[40%] overflow-y-auto">
          <DiceRoller :session="activeSession" />
        </div>
      </template>
    </div>

    <PlayerHPStrip />

    <EndSessionDialog v-model:visible="showEnd" :session="activeSession" />
    <RecapModal
      v-model:visible="showRecap"
      :recap="previousSession?.recap ?? ''"
      :session-number="previousSession?.number ?? 0"
    />
  </div>
</template>
