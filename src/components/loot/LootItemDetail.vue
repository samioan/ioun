<script setup lang="ts">
import { computed } from 'vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { usePlayerStore } from '@/stores/players'
import type { LootItem } from '@/types'

const props = defineProps<{ item: LootItem }>()
const playerStore = usePlayerStore()

const playerOptions = computed(() => Object.values(playerStore.items).map((p) => ({ id: p.id, label: p.name })))
const holderLink = computed<string[]>({
  get: () => (props.item.currentHolderId ? [props.item.currentHolderId] : []),
  set: (v) => {
    props.item.currentHolderId = v[0]
  },
})

function addCharges() {
  props.item.charges = { current: 1, max: 1, recharge: '' }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <input
      v-model="item.name"
      placeholder="Item Name"
      class="w-full bg-transparent font-display text-xl text-gold outline-none"
    />
    <div class="grid grid-cols-2 gap-2">
      <input
        v-model="item.type"
        placeholder="Type"
        class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
      />
      <input
        v-model="item.rarity"
        placeholder="Rarity"
        class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
      />
      <input
        v-model="item.value"
        placeholder="Value (e.g. 50 gp)"
        class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
      />
      <input
        type="number"
        v-model.number="item.weight"
        placeholder="Weight"
        class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
      />
    </div>

    <textarea
      v-model="item.description"
      rows="3"
      placeholder="Description…"
      class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
    />

    <div class="flex flex-wrap items-center gap-4 text-xs text-ink">
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="item.isIdentified" class="h-4 w-4 accent-gold" /> Identified
      </label>
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="item.attunementRequired" class="h-4 w-4 accent-arcane" /> Requires Attunement
      </label>
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="item.isCursed" class="h-4 w-4 accent-crimson" /> Cursed
      </label>
    </div>
    <textarea
      v-if="item.isCursed"
      v-model="item.cursedEffect"
      rows="2"
      placeholder="Cursed effect…"
      class="w-full rounded-md border border-crimson/40 bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-crimson"
    />

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Current Holder</p>
      <EntityLinkList v-model="holderLink" :options="playerOptions" :max="1" />
    </div>

    <div>
      <p class="mb-1 text-xs uppercase tracking-wide text-ink">Charges</p>
      <div v-if="item.charges" class="flex items-center gap-2">
        <input
          type="number"
          v-model.number="item.charges.current"
          class="w-16 rounded-md border border-border bg-obsidian px-2 py-1 text-center font-mono text-sm text-parchment outline-none"
        />
        <span class="text-ink">/</span>
        <input
          type="number"
          v-model.number="item.charges.max"
          class="w-16 rounded-md border border-border bg-obsidian px-2 py-1 text-center font-mono text-sm text-parchment outline-none"
        />
        <input
          v-model="item.charges.recharge"
          placeholder="Recharge…"
          class="flex-1 rounded-md border border-border bg-obsidian px-2 py-1 text-xs text-parchment outline-none"
        />
      </div>
      <button v-else type="button" class="text-xs text-gold hover:text-gold-dim" @click="addCharges">
        + Add charges
      </button>
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Notes</label>
      <textarea
        v-model="item.notes"
        rows="2"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>
  </div>
</template>
