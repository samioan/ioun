<script setup lang="ts">
import { reactive, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { PhX } from '@phosphor-icons/vue'
import { useSessionStore } from '@/stores/session'
import { usePlayerStore } from '@/stores/players'
import { useSessionMode } from '@/composables/useSessionMode'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [boolean] }>()

const sessionStore = useSessionStore()
const playerStore = usePlayerStore()
const { enterPlayMode } = useSessionMode()

const players = computed(() => Object.values(playerStore.items))

const nextNumber = computed(() => {
  const nums = Object.values(sessionStore.items).map((s) => s.number)
  return nums.length ? Math.max(...nums) + 1 : 1
})

const draft = reactive({
  title: '',
  date: new Date().toISOString().slice(0, 10),
  attendingPlayerIds: [] as string[],
})

function toggleAttendance(id: string) {
  const idx = draft.attendingPlayerIds.indexOf(id)
  if (idx !== -1) draft.attendingPlayerIds.splice(idx, 1)
  else draft.attendingPlayerIds.push(id)
}

function close() {
  emit('update:visible', false)
}

function begin() {
  const absentPlayerIds = players.value.map((p) => p.id).filter((id) => !draft.attendingPlayerIds.includes(id))
  const session = sessionStore.add({
    number: nextNumber.value,
    date: draft.date,
    title: draft.title.trim(),
    summary: '',
    recap: '',
    attendingPlayerIds: [...draft.attendingPlayerIds],
    absentPlayerIds,
    events: [],
    diceRolls: [],
    combatEncounters: [],
    lootAwarded: [],
    xpAwarded: 0,
    notes: '',
    openedHooks: [],
    closedHooks: [],
    playerMoments: [],
    dmNotes: '',
    nextSessionPrep: '',
  })
  enterPlayMode(session.id)
  draft.title = ''
  draft.attendingPlayerIds = []
  close()
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :show-header="false"
    class="w-full max-w-md"
    @update:visible="close"
  >
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <h2 class="font-display text-lg text-gold">Begin Session</h2>
      <button type="button" class="tap-target text-ink hover:text-gold" @click="close">
        <PhX :size="18" />
      </button>
    </div>
    <div class="flex flex-col gap-3 p-4">
      <p class="text-sm text-ink">Session {{ nextNumber }}</p>
      <InputText v-model="draft.title" placeholder="Session title (optional)" />
      <input
        v-model="draft.date"
        type="date"
        class="rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />

      <div v-if="players.length">
        <p class="mb-2 text-xs uppercase tracking-wide text-ink">Attending</p>
        <label
          v-for="player in players"
          :key="player.id"
          class="mb-1 flex items-center gap-2 text-sm text-parchment"
        >
          <input
            type="checkbox"
            class="h-4 w-4 accent-gold"
            :checked="draft.attendingPlayerIds.includes(player.id)"
            @change="toggleAttendance(player.id)"
          />
          {{ player.name }}
        </label>
      </div>

      <Button label="Begin" @click="begin" />
    </div>
  </Dialog>
</template>
