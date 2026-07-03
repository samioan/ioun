<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import { useSessionMode } from '@/composables/useSessionMode'
import { useSessionStore } from '@/stores/session'
import { useDiceStore } from '@/stores/dice'
import { rollNotation } from '@/composables/useDiceParser'
import { newId } from '@/utils/id'
import SessionTimer from '@/components/session/SessionTimer.vue'
import type { DiceRoll } from '@/types'

const { isPlaying, activeSessionId } = useSessionMode()
const sessionStore = useSessionStore()
const diceStore = useDiceStore()

const activeSession = computed(() =>
  activeSessionId.value ? sessionStore.getById(activeSessionId.value) : undefined,
)
const lastRoll = computed(() => {
  const rolls = activeSession.value?.diceRolls
  return rolls && rolls.length ? rolls[rolls.length - 1] : undefined
})

// The quick-roll d20 button is always available, session or not — matches
// the spec's "persistent dice button" framing, not gated on play mode.
function rollD20() {
  const result = rollNotation('1d20')
  if (!result) return
  const record: DiceRoll = {
    id: newId(),
    sessionId: activeSession.value?.id,
    timestamp: new Date().toISOString(),
    notation: result.notation,
    results: result.results,
    modifier: result.modifier,
    total: result.total,
    rolledBy: 'DM',
    isNatural20: result.isNatural20,
    isNatural1: result.isNatural1,
    isAdvantage: result.isAdvantage,
    isDisadvantage: result.isDisadvantage,
    dropped: result.dropped.length ? result.dropped : undefined,
    isSecret: false,
  }
  activeSession.value?.diceRolls.push(record)
  diceStore.add(record)
}
</script>

<template>
  <footer
    class="flex h-14 items-center justify-between border-t border-border bg-obsidian px-4 transition-shadow duration-200 sm:h-14"
    :class="{ 'shadow-[0_0_16px_rgba(201,150,42,0.35)]': isPlaying }"
  >
    <div class="flex items-center gap-3 text-sm text-ink">
      <SessionTimer v-if="isPlaying" />
      <span v-else class="font-mono text-parchment">00:00</span>
      <span v-if="!isPlaying">No active session</span>
    </div>
    <div class="hidden font-mono text-sm text-parchment sm:block">
      Last roll:
      <span v-if="lastRoll" :class="lastRoll.isNatural20 ? 'text-gold' : lastRoll.isNatural1 ? 'text-crimson' : ''">
        {{ lastRoll.notation }} → {{ lastRoll.total }}
      </span>
      <span v-else>—</span>
    </div>
    <Button label="Roll d20" class="tap-target-lg" @click="rollD20" />
  </footer>
</template>
