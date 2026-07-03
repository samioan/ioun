<script setup lang="ts">
import { ref, computed } from 'vue'
import { PhDiceFive } from '@phosphor-icons/vue'
import { rollNotation, appendDie } from '@/composables/useDiceParser'
import { useDiceStore } from '@/stores/dice'
import { newId } from '@/utils/id'
import DiceHistory from './DiceHistory.vue'
import type { Session, DiceRoll } from '@/types'

const props = defineProps<{ session: Session }>()
const diceStore = useDiceStore()

const notation = ref('1d20')
const purpose = ref('')
const dcInput = ref('')
const lastRoll = ref<DiceRoll | null>(null)
const rollCount = ref(0)

const recentRolls = computed(() => [...props.session.diceRolls].slice(-8).reverse())

function quickDie(sides: number) {
  notation.value = appendDie(notation.value, sides)
}

function toggleAdvantage() {
  notation.value = notation.value === '2d20kh1' ? '1d20' : '2d20kh1'
}

function toggleDisadvantage() {
  notation.value = notation.value === '2d20kl1' ? '1d20' : '2d20kl1'
}

function roll() {
  const result = rollNotation(notation.value)
  if (!result) return
  const dc = dcInput.value.trim() ? Number(dcInput.value) : undefined
  const succeeded = dc !== undefined && !Number.isNaN(dc) ? result.total >= dc : undefined

  const record: DiceRoll = {
    id: newId(),
    sessionId: props.session.id,
    timestamp: new Date().toISOString(),
    notation: result.notation,
    results: result.results,
    modifier: result.modifier,
    total: result.total,
    purpose: purpose.value.trim() || undefined,
    rolledBy: 'DM',
    isNatural20: result.isNatural20,
    isNatural1: result.isNatural1,
    isAdvantage: result.isAdvantage,
    isDisadvantage: result.isDisadvantage,
    dropped: result.dropped.length ? result.dropped : undefined,
    isSecret: false,
    dcTarget: dc,
    succeeded,
  }

  props.session.diceRolls.push(record)
  diceStore.add(record)
  lastRoll.value = record
  rollCount.value += 1
}

const resultClass = computed(() => {
  if (!lastRoll.value) return 'border-border'
  if (lastRoll.value.isNatural20) return 'border-gold animate-pulse-gold'
  if (lastRoll.value.isNatural1) return 'border-crimson animate-flash-crimson'
  return 'border-border'
})
</script>

<template>
  <div class="flex flex-col gap-3 p-4">
    <div class="flex flex-wrap gap-1">
      <button
        v-for="d in [4, 6, 8, 10, 12, 20]"
        :key="d"
        type="button"
        class="tap-target rounded-md border border-border px-2 py-1 text-xs text-ink hover:border-gold hover:text-gold"
        @click="quickDie(d)"
      >
        d{{ d }}
      </button>
      <button
        type="button"
        class="tap-target rounded-md border border-border px-2 py-1 text-xs text-ink hover:border-gold hover:text-gold"
        @click="quickDie(100)"
      >
        d%
      </button>
      <button
        type="button"
        class="tap-target rounded-md border px-2 py-1 text-xs"
        :class="notation === '2d20kh1' ? 'border-gold text-gold' : 'border-border text-ink hover:border-gold'"
        @click="toggleAdvantage"
      >
        ADV
      </button>
      <button
        type="button"
        class="tap-target rounded-md border px-2 py-1 text-xs"
        :class="notation === '2d20kl1' ? 'border-crimson text-crimson' : 'border-border text-ink hover:border-crimson'"
        @click="toggleDisadvantage"
      >
        DIS
      </button>
    </div>

    <div class="flex items-center gap-2">
      <input
        v-model="notation"
        type="text"
        class="tap-target flex-1 rounded-md border border-border bg-slate px-3 py-2 font-mono text-parchment outline-none focus:border-gold"
        placeholder="2d6+3"
        @keydown.enter="roll"
      />
      <button
        type="button"
        class="tap-target-lg flex items-center justify-center rounded-md bg-gold text-void hover:bg-gold-dim"
        @click="roll"
      >
        <PhDiceFive :size="20" />
      </button>
    </div>

    <div
      v-if="lastRoll"
      :key="rollCount"
      class="flex animate-roll-in flex-col items-center gap-1 rounded-md border-2 bg-obsidian py-4"
      :class="resultClass"
    >
      <span class="font-mono text-4xl text-parchment">{{ lastRoll.total }}</span>
      <span class="text-xs text-ink">
        {{ lastRoll.results.join(', ') }}
        <span v-if="lastRoll.dropped?.length">(dropped {{ lastRoll.dropped.join(', ') }})</span>
        <span v-if="lastRoll.modifier">{{ lastRoll.modifier > 0 ? '+' : '' }}{{ lastRoll.modifier }}</span>
      </span>
    </div>

    <div class="flex items-center gap-2 text-sm">
      <label class="text-ink">DC</label>
      <input
        v-model="dcInput"
        type="number"
        class="w-16 rounded-md border border-border bg-obsidian px-2 py-1 text-center font-mono text-parchment outline-none"
      />
      <span v-if="lastRoll?.succeeded !== undefined" :class="lastRoll.succeeded ? 'text-emerald' : 'text-crimson'">
        {{ lastRoll.succeeded ? '✓ Success' : '✗ Failure' }}
      </span>
    </div>

    <input
      v-model="purpose"
      type="text"
      placeholder="Purpose (Attack, Damage, Save…)"
      class="rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
    />

    <DiceHistory :rolls="recentRolls" />
  </div>
</template>
