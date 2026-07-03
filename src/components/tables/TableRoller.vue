<script setup lang="ts">
import { computed, ref } from 'vue'
import { PhDiceFive } from '@phosphor-icons/vue'
import { rollNotation } from '@/composables/useDiceParser'
import { useDiceStore } from '@/stores/dice'
import { useTablesStore } from '@/stores/tables'
import { useSessionStore } from '@/stores/session'
import { useSessionMode } from '@/composables/useSessionMode'
import { newId } from '@/utils/id'
import type { RandomTable, RandomTableEntry, DiceRoll } from '@/types'

const props = defineProps<{ table: RandomTable }>()

const diceStore = useDiceStore()
const tablesStore = useTablesStore()
const sessionStore = useSessionStore()
const { activeSessionId } = useSessionMode()

interface ChainStep {
  tableName: string
  total: number
  entry?: RandomTableEntry
}
const chain = ref<ChainStep[]>([])

// Every roll becomes a normal DiceRoll (tagged with tableId/tableEntryId)
// pushed into the shared diceStore — logged unconditionally, and also into
// the live session's own roll list when one is active, mirroring
// DiceRoller.vue's double-write.
function rollTable(table: RandomTable): { record: DiceRoll; entry?: RandomTableEntry } | null {
  const result = rollNotation(table.diceNotation)
  if (!result) return null
  const entry = table.entries.find((e) => result.total >= e.minRoll && result.total <= e.maxRoll)
  const record: DiceRoll = {
    id: newId(),
    sessionId: activeSessionId.value ?? undefined,
    timestamp: new Date().toISOString(),
    notation: result.notation,
    results: result.results,
    modifier: result.modifier,
    total: result.total,
    purpose: `${table.name}${entry ? ' → ' + entry.result : ' (no matching entry)'}`,
    isNatural20: result.isNatural20,
    isNatural1: result.isNatural1,
    isAdvantage: result.isAdvantage,
    isDisadvantage: result.isDisadvantage,
    dropped: result.dropped.length ? result.dropped : undefined,
    isSecret: false,
    tableId: table.id,
    tableEntryId: entry?.id,
  }
  diceStore.add(record)
  if (activeSessionId.value) {
    sessionStore.getById(activeSessionId.value)?.diceRolls.push(record)
  }
  return { record, entry }
}

function rollThisTable() {
  chain.value = []
  const outcome = rollTable(props.table)
  if (outcome) chain.value.push({ tableName: props.table.name, total: outcome.record.total, entry: outcome.entry })
}

function rollSubTable(tableId: string) {
  const sub = tablesStore.getById(tableId)
  if (!sub) return
  const outcome = rollTable(sub)
  if (outcome) chain.value.push({ tableName: sub.name, total: outcome.record.total, entry: outcome.entry })
}

const lastStep = computed(() => chain.value[chain.value.length - 1])
const subTableName = computed(() => {
  const subId = lastStep.value?.entry?.subTable
  return subId ? tablesStore.getById(subId)?.name : undefined
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <button
      type="button"
      class="tap-target flex items-center justify-center gap-2 rounded-md bg-gold px-4 py-2 font-semibold text-void hover:bg-gold-dim"
      @click="rollThisTable"
    >
      <PhDiceFive :size="18" /> Roll {{ table.diceNotation }}
    </button>

    <div v-if="chain.length" class="flex flex-col gap-2">
      <div
        v-for="(step, index) in chain"
        :key="index"
        class="flex flex-col gap-1 rounded-md border border-border bg-obsidian p-3"
      >
        <div class="flex items-center justify-between text-xs text-ink">
          <span>{{ step.tableName }}</span>
          <span class="font-mono text-gold">{{ step.total }}</span>
        </div>
        <p class="text-sm text-parchment">{{ step.entry?.result ?? 'No matching entry for this roll.' }}</p>
        <p v-if="step.entry?.notes" class="text-xs text-ink">{{ step.entry.notes }}</p>
      </div>

      <button
        v-if="subTableName"
        type="button"
        class="tap-target self-start text-sm text-gold hover:text-gold-dim"
        @click="rollSubTable(lastStep!.entry!.subTable!)"
      >
        Roll {{ subTableName }} →
      </button>
    </div>
  </div>
</template>
