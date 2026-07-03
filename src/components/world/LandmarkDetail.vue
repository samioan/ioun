<script setup lang="ts">
import { computed } from 'vue'
import { PhTrash, PhPlus, PhX } from '@phosphor-icons/vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import { useNPCStore } from '@/stores/npcs'
import { useFactionStore } from '@/stores/factions'
import { useWorldStore } from '@/stores/world'
import { useSidePanel } from '@/composables/useSidePanel'
import { newId } from '@/utils/id'
import type { Landmark } from '@/types'

const props = defineProps<{ landmark: Landmark; parentOptions: { id: string; label: string }[] }>()
const emit = defineEmits<{ remove: [] }>()

const npcStore = useNPCStore()
const factionStore = useFactionStore()
const worldStore = useWorldStore()
const sidePanel = useSidePanel()

// Removes directly from the store rather than relying solely on the
// `remove` emit — the side panel (used when this is pushed from MapView's
// pin-chaining flow) doesn't forward component emits, only `v-bind`s props,
// so an emit-only delete would silently no-op there. WorldView.vue's inline
// usage still gets its `@remove` listener to clear its own selection.
function remove() {
  worldStore.remove(props.landmark.id)
  emit('remove')
  // Only close the panel if THIS instance is actually the one showing —
  // the side panel is a global singleton, so an unrelated panel could
  // coincidentally be open while this renders inline in WorldView.vue.
  if (sidePanel.current.value?.props?.landmark === props.landmark) sidePanel.close()
}

const LANDMARK_TYPES: Landmark['type'][] = [
  'city',
  'town',
  'village',
  'dungeon',
  'wilderness',
  'building',
  'region',
  'plane',
  'sea',
  'road',
  'ruin',
  'other',
]

const npcOptions = computed(() => Object.values(npcStore.items).map((n) => ({ id: n.id, label: n.name })))
const factionOptions = computed(() => Object.values(factionStore.items).map((f) => ({ id: f.id, label: f.name })))

const parentLink = computed<string[]>({
  get: () => (props.landmark.parentId ? [props.landmark.parentId] : []),
  set: (v) => {
    props.landmark.parentId = v[0]
  },
})

function addRumor() {
  if (!props.landmark.rumors) props.landmark.rumors = []
  props.landmark.rumors.push('')
}
function removeRumor(index: number) {
  props.landmark.rumors?.splice(index, 1)
}
function addHook() {
  if (!props.landmark.questHooks) props.landmark.questHooks = []
  props.landmark.questHooks.push('')
}
function removeHook(index: number) {
  props.landmark.questHooks?.splice(index, 1)
}

function addShop() {
  if (!props.landmark.shops) props.landmark.shops = []
  props.landmark.shops.push({ id: newId(), name: '', type: '', inventory: [], notes: '' })
}
function removeShop(id: string) {
  const index = props.landmark.shops?.findIndex((s) => s.id === id)
  if (index !== undefined && index !== -1) props.landmark.shops!.splice(index, 1)
}
function addShopItem(shopId: string) {
  const shop = props.landmark.shops?.find((s) => s.id === shopId)
  if (shop) shop.inventory.push({ name: '', price: '', quantity: 1 })
}
function removeShopItem(shopId: string, index: number) {
  const shop = props.landmark.shops?.find((s) => s.id === shopId)
  shop?.inventory.splice(index, 1)
}
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1">
        <input
          v-model="landmark.name"
          placeholder="Landmark Name"
          class="w-full bg-transparent font-display text-2xl text-gold outline-none"
        />
        <div class="mt-2 flex flex-wrap items-center gap-3">
          <select v-model="landmark.type" class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment">
            <option v-for="t in LANDMARK_TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
          <div class="flex items-center gap-2">
            <span class="text-xs text-ink">Parent:</span>
            <EntityLinkList v-model="parentLink" :options="parentOptions" :max="1" />
          </div>
        </div>
      </div>
      <button type="button" class="tap-target text-ink hover:text-crimson" @click="remove">
        <PhTrash :size="18" />
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-4 text-sm text-ink">
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="landmark.hasBeenVisited" class="h-4 w-4 accent-gold" /> Visited
      </label>
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="landmark.isKnownToPlayers" class="h-4 w-4 accent-gold" /> Known to players
      </label>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Description</label>
        <textarea
          v-model="landmark.description"
          rows="3"
          class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Atmosphere</label>
        <textarea
          v-model="landmark.atmosphere"
          rows="3"
          class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
        />
      </div>
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Secret Info (DM only)</label>
      <textarea
        v-model="landmark.secretInfo"
        rows="2"
        class="w-full rounded-md border border-crimson/40 bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-crimson"
      />
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">NPCs Present</p>
        <EntityLinkList v-model="landmark.npcIds" :options="npcOptions" />
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Factions Present</p>
        <EntityLinkList v-model="landmark.factionIds" :options="factionOptions" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Rumors</p>
        <div v-for="(_rumor, index) in landmark.rumors" :key="index" class="mb-1 flex items-center gap-2">
          <input
            v-model="landmark.rumors![index]"
            class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeRumor(index)">
            <PhTrash :size="14" />
          </button>
        </div>
        <button type="button" class="tap-target text-sm text-gold hover:text-gold-dim" @click="addRumor">
          + Add rumor
        </button>
      </div>
      <div>
        <p class="mb-1 text-xs uppercase tracking-wide text-ink">Quest Hooks</p>
        <div v-for="(_hook, index) in landmark.questHooks" :key="index" class="mb-1 flex items-center gap-2">
          <input
            v-model="landmark.questHooks![index]"
            class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeHook(index)">
            <PhTrash :size="14" />
          </button>
        </div>
        <button type="button" class="tap-target text-sm text-gold hover:text-gold-dim" @click="addHook">
          + Add hook
        </button>
      </div>
    </div>

    <div>
      <label class="mb-1 block text-xs uppercase tracking-wide text-ink">Map Notes</label>
      <textarea
        v-model="landmark.mapNotes"
        rows="2"
        class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
      />
    </div>

    <div>
      <p class="mb-2 font-display text-lg text-gold">Shops</p>
      <div v-for="shop in landmark.shops" :key="shop.id" class="mb-3 rounded-md border border-border p-3">
        <div class="flex items-center gap-2">
          <input
            v-model="shop.name"
            placeholder="Shop name"
            class="min-w-0 flex-1 bg-transparent text-sm font-semibold text-parchment outline-none"
          />
          <input
            v-model="shop.type"
            placeholder="Type"
            class="w-24 shrink-0 rounded-md border border-border bg-slate px-2 py-1 text-xs text-ink outline-none"
          />
          <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeShop(shop.id)">
            <PhTrash :size="14" />
          </button>
        </div>
        <div v-for="(item, itemIndex) in shop.inventory" :key="itemIndex" class="mt-1 flex items-center gap-2">
          <input
            v-model="item.name"
            placeholder="Item"
            class="min-w-0 flex-1 rounded-md border border-border bg-obsidian px-2 py-1 text-xs text-parchment outline-none"
          />
          <input
            v-model="item.price"
            placeholder="Price"
            class="w-16 shrink-0 rounded-md border border-border bg-obsidian px-2 py-1 text-xs text-parchment outline-none"
          />
          <button
            type="button"
            class="shrink-0 text-ink hover:text-crimson"
            @click="removeShopItem(shop.id, itemIndex)"
          >
            <PhX :size="12" />
          </button>
        </div>
        <button type="button" class="mt-1 text-xs text-gold hover:text-gold-dim" @click="addShopItem(shop.id)">
          + Add item
        </button>
      </div>
      <button
        type="button"
        class="tap-target flex items-center gap-2 text-sm text-gold hover:text-gold-dim"
        @click="addShop"
      >
        <PhPlus :size="14" /> Add shop
      </button>
    </div>
  </div>
</template>
