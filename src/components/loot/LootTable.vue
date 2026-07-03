<script setup lang="ts">
import { usePlayerStore } from '@/stores/players'
import type { LootItem } from '@/types'

defineProps<{ items: LootItem[]; selectedIds: string[] }>()
const emit = defineEmits<{ toggle: [string]; select: [LootItem] }>()

const playerStore = usePlayerStore()

function holderLabel(item: LootItem): string {
  if (!item.currentHolderId) return 'Party Stash'
  return playerStore.getById(item.currentHolderId)?.name ?? 'Unknown'
}

const RARITY_COLOR: Record<string, string> = {
  common: 'text-ink',
  uncommon: 'text-emerald',
  rare: 'text-arcane',
  'very rare': 'text-gold',
  legendary: 'text-crimson',
}
</script>

<template>
  <table class="w-full text-left text-sm">
    <thead>
      <tr class="border-b border-border text-xs uppercase tracking-wide text-ink">
        <th class="w-8 py-2"></th>
        <th class="py-2">Name</th>
        <th class="py-2">Type</th>
        <th class="py-2">Rarity</th>
        <th class="py-2">Value</th>
        <th class="py-2">Holder</th>
        <th class="py-2">Weight</th>
        <th class="py-2">Flags</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in items"
        :key="item.id"
        class="cursor-pointer border-b border-border/50 hover:bg-slate"
        @click="emit('select', item)"
      >
        <td class="py-2" @click.stop>
          <input
            type="checkbox"
            class="h-4 w-4 accent-gold"
            :checked="selectedIds.includes(item.id)"
            @change="emit('toggle', item.id)"
          />
        </td>
        <td class="py-2 text-parchment">{{ item.name || 'Unnamed Item' }}</td>
        <td class="py-2 text-ink">{{ item.type }}</td>
        <td class="py-2" :class="RARITY_COLOR[item.rarity?.toLowerCase() ?? ''] ?? 'text-ink'">{{ item.rarity }}</td>
        <td class="py-2 font-mono text-ink">{{ item.value }}</td>
        <td class="py-2 text-ink">{{ holderLabel(item) }}</td>
        <td class="py-2 font-mono text-ink">{{ item.weight ?? '—' }}</td>
        <td class="py-2">
          <span
            v-if="!item.isIdentified"
            class="mr-1 rounded-full border border-gold-dim px-1.5 py-0.5 text-[10px] text-gold"
          >
            Unidentified
          </span>
          <span
            v-if="item.attunementRequired"
            class="mr-1 rounded-full border border-arcane px-1.5 py-0.5 text-[10px] text-arcane"
          >
            Attunes
          </span>
          <span v-if="item.isCursed" class="rounded-full border border-crimson px-1.5 py-0.5 text-[10px] text-crimson">
            Cursed
          </span>
        </td>
      </tr>
      <tr v-if="items.length === 0">
        <td colspan="8" class="py-6 text-center text-sm text-ink">No items.</td>
      </tr>
    </tbody>
  </table>
</template>
