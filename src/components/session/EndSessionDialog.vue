<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { PhX } from '@phosphor-icons/vue'
import { usePlayerStore } from '@/stores/players'
import { useSessionMode } from '@/composables/useSessionMode'
import { newId } from '@/utils/id'
import type { Session } from '@/types'

const props = defineProps<{ visible: boolean; session: Session }>()
const emit = defineEmits<{ 'update:visible': [boolean] }>()

const playerStore = usePlayerStore()
const { exitPlayMode } = useSessionMode()
const router = useRouter()

const draft = reactive({
  summary: props.session.summary,
  recap: props.session.recap,
  nextSessionPrep: props.session.nextSessionPrep,
  xpAmount: '',
  xpReason: '',
})

watch(
  () => props.visible,
  (visible) => {
    if (!visible) return
    draft.summary = props.session.summary
    draft.recap = props.session.recap
    draft.nextSessionPrep = props.session.nextSessionPrep
    draft.xpAmount = ''
    draft.xpReason = ''
  },
)

function close() {
  emit('update:visible', false)
}

function finish() {
  props.session.summary = draft.summary.trim()
  props.session.recap = draft.recap.trim()
  props.session.nextSessionPrep = draft.nextSessionPrep.trim()

  const xp = Number(draft.xpAmount)
  if (!Number.isNaN(xp) && xp !== 0) {
    for (const playerId of props.session.attendingPlayerIds) {
      const player = playerStore.getById(playerId)
      if (!player) continue
      player.experiencePoints += xp
      player.xpLog.push({
        id: newId(),
        amount: xp,
        reason: draft.xpReason.trim(),
        sessionId: props.session.id,
        timestamp: new Date().toISOString(),
      })
    }
    props.session.xpAwarded += xp
  }

  exitPlayMode()
  close()
  router.push('/')
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :show-header="false"
    class="w-full max-w-lg"
    @update:visible="close"
  >
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <h2 class="font-display text-lg text-gold">End Session</h2>
      <button type="button" class="tap-target text-ink hover:text-gold" @click="close">
        <PhX :size="18" />
      </button>
    </div>
    <div class="flex max-h-[70vh] flex-col gap-3 overflow-y-auto p-4">
      <div>
        <label class="mb-1 block text-xs text-ink">DM Session Summary</label>
        <Textarea v-model="draft.summary" rows="3" />
      </div>
      <div>
        <label class="mb-1 block text-xs text-ink">Player-Facing Recap</label>
        <Textarea v-model="draft.recap" rows="3" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="mb-1 block text-xs text-ink">Award XP to attendees</label>
          <InputText v-model="draft.xpAmount" type="number" placeholder="250" />
        </div>
        <div>
          <label class="mb-1 block text-xs text-ink">Reason</label>
          <InputText v-model="draft.xpReason" placeholder="Cleared the ambush" />
        </div>
      </div>
      <div>
        <label class="mb-1 block text-xs text-ink">Prep for Next Session</label>
        <Textarea v-model="draft.nextSessionPrep" rows="3" placeholder="One line per item…" />
      </div>
      <Button label="Finish" @click="finish" />
    </div>
  </Dialog>
</template>
