<script setup lang="ts">
import { computed } from 'vue'
import { PhPlus, PhTrash, PhUserCircle } from '@phosphor-icons/vue'
import { useSystemDefinition } from '@/composables/useSystemDefinition'
import { useNPCStore } from '@/stores/npcs'
import HPBar from '@/components/shared/HPBar.vue'
import ConditionPicker from '@/components/shared/ConditionPicker.vue'
import EntityChip from '@/components/shared/EntityChip.vue'
import EntityLinkList from '@/components/shared/EntityLinkList.vue'
import DynamicStatBlock from './DynamicStatBlock.vue'
import DynamicSkillList from './DynamicSkillList.vue'
import DerivedStatDisplay from './DerivedStatDisplay.vue'
import ResourcePoolTracker from './ResourcePoolTracker.vue'
import CharacterFeatureList from './CharacterFeatureList.vue'
import CurrencyEditor from './CurrencyEditor.vue'
import XPLog from './XPLog.vue'
import type { Player } from '@/types'

const props = defineProps<{ player: Player }>()
const { system } = useSystemDefinition()
const npcStore = useNPCStore()

const NARRATIVE_FIELDS = ['backstory', 'appearance', 'personalityTraits', 'ideals', 'bonds', 'flaws'] as const

function updateHP(value: number) {
  props.player.health.current = value
}

function updateConditions(conditions: string[]) {
  props.player.conditions = conditions
}

function addInventoryRow() {
  props.player.inventory.push({ name: '', quantity: 1, equipped: false, notes: '' })
}

function removeInventoryRow(index: number) {
  props.player.inventory.splice(index, 1)
}

// Local bookkeeping only — no LootItem cross-linking since /loot is stubbed.
function toggleAttunement(itemName: string) {
  const list = props.player.attunedItemIds
  const idx = list.indexOf(itemName)
  if (idx !== -1) {
    list.splice(idx, 1)
    return
  }
  const cap = system.value?.maxAttunedItems ?? Infinity
  if (list.length >= cap) return
  list.push(itemName)
}

function addLanguage() {
  props.player.languages.push('')
}
function removeLanguage(index: number) {
  props.player.languages.splice(index, 1)
}
function addProficiency() {
  props.player.proficiencies.push('')
}
function removeProficiency(index: number) {
  props.player.proficiencies.splice(index, 1)
}

const relationshipEntries = computed(() =>
  Object.entries(props.player.relationshipMap).map(([npcId, note]) => ({
    npcId,
    note,
    npcName: npcStore.getById(npcId)?.name ?? 'Unknown NPC',
  })),
)

const relationshipIds = computed(() => Object.keys(props.player.relationshipMap))
const npcOptions = computed(() => Object.values(npcStore.items).map((npc) => ({ id: npc.id, label: npc.name })))

function addRelationship(npcId: string) {
  props.player.relationshipMap[npcId] = ''
}

function removeRelationship(npcId: string) {
  delete props.player.relationshipMap[npcId]
}
</script>

<template>
  <div class="flex flex-col gap-8 p-6">
    <section class="flex flex-wrap items-start gap-6">
      <PhUserCircle :size="64" class="text-ink" />
      <div class="min-w-0 flex-1">
        <input
          v-model="player.name"
          class="w-full bg-transparent font-display text-3xl text-gold outline-none"
          placeholder="Character Name"
        />
        <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <input
            v-model="player.playerName"
            placeholder="Player"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <input
            v-model="player.ancestry"
            placeholder="Ancestry"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <input
            v-model="player.characterClass"
            placeholder="Class"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <input
            v-model="player.background"
            placeholder="Background"
            class="rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-wrap items-center gap-6">
      <div class="flex items-center gap-2">
        <span class="text-xs uppercase tracking-wide text-ink">HP</span>
        <HPBar
          :current="player.health.current"
          :max="player.health.max"
          :temp="player.health.temp"
          @update:current="updateHP"
        />
      </div>
      <div v-if="system?.hasDeathMechanic && player.deathMechanic" class="flex items-center gap-2 text-xs text-ink">
        <span>{{ player.deathMechanic.label }}</span>
        <input
          type="number"
          v-model.number="player.deathMechanic.successes"
          class="w-12 rounded border border-border bg-obsidian text-center font-mono text-emerald outline-none"
        />
        <span>/</span>
        <input
          type="number"
          v-model.number="player.deathMechanic.failures"
          class="w-12 rounded border border-border bg-obsidian text-center font-mono text-crimson outline-none"
        />
      </div>
      <ConditionPicker :model-value="player.conditions" @update:model-value="updateConditions" />
    </section>

    <section>
      <h2 class="mb-3 font-display text-lg text-gold">Stats</h2>
      <DynamicStatBlock :stats="player.stats" />
    </section>

    <section>
      <h2 class="mb-3 font-display text-lg text-gold">Skills</h2>
      <DynamicSkillList :skills="player.skills" />
    </section>

    <section v-if="player.derivedStats.length">
      <h2 class="mb-3 font-display text-lg text-gold">Derived Stats</h2>
      <DerivedStatDisplay :derived-stats="player.derivedStats" />
    </section>

    <section>
      <h2 class="mb-3 font-display text-lg text-gold">Resource Pools</h2>
      <ResourcePoolTracker :player="player" />
    </section>

    <section>
      <h2 class="mb-3 font-display text-lg text-gold">Features & Traits</h2>
      <CharacterFeatureList :player="player" />
    </section>

    <section>
      <h2 class="mb-3 font-display text-lg text-gold">Inventory</h2>
      <div class="flex flex-col gap-2">
        <div
          v-for="(item, index) in player.inventory"
          :key="index"
          class="flex items-center gap-2 rounded-md border border-border px-3 py-2"
        >
          <input v-model="item.name" placeholder="Item name" class="flex-1 bg-transparent text-sm text-parchment outline-none" />
          <input
            type="number"
            v-model.number="item.quantity"
            class="w-16 rounded border border-border bg-obsidian text-center font-mono text-sm text-parchment outline-none"
          />
          <label class="flex items-center gap-1 text-xs text-ink">
            <input type="checkbox" v-model="item.equipped" class="h-4 w-4 accent-gold" /> Equipped
          </label>
          <label v-if="system?.hasAttunement" class="flex items-center gap-1 text-xs text-ink">
            <input
              type="checkbox"
              :checked="player.attunedItemIds.includes(item.name)"
              class="h-4 w-4 accent-arcane"
              @change="toggleAttunement(item.name)"
            />
            Attuned
          </label>
          <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeInventoryRow(index)">
            <PhTrash :size="16" />
          </button>
        </div>
        <p v-if="system?.hasAttunement" class="text-xs text-ink">
          Attuned: {{ player.attunedItemIds.length }} / {{ system.maxAttunedItems }}
        </p>
        <button
          type="button"
          class="tap-target flex items-center gap-2 self-start text-sm text-gold hover:text-gold-dim"
          @click="addInventoryRow"
        >
          <PhPlus :size="14" /> Add Item
        </button>
      </div>
    </section>

    <section>
      <h2 class="mb-3 font-display text-lg text-gold">Currency</h2>
      <CurrencyEditor :player="player" />
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div v-for="field in NARRATIVE_FIELDS" :key="field">
        <label class="mb-1 block text-xs uppercase tracking-wide text-ink">{{ field }}</label>
        <textarea
          v-model="player[field]"
          rows="3"
          class="w-full rounded-md border border-border bg-slate px-3 py-2 text-sm text-parchment outline-none focus:border-gold"
        />
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <h3 class="mb-2 font-display text-base text-gold">Languages</h3>
        <div v-for="(_lang, index) in player.languages" :key="index" class="mb-1 flex items-center gap-2">
          <input
            v-model="player.languages[index]"
            class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeLanguage(index)">
            <PhTrash :size="14" />
          </button>
        </div>
        <button type="button" class="tap-target text-sm text-gold hover:text-gold-dim" @click="addLanguage">
          + Add language
        </button>
      </div>
      <div>
        <h3 class="mb-2 font-display text-base text-gold">Proficiencies</h3>
        <div v-for="(_prof, index) in player.proficiencies" :key="index" class="mb-1 flex items-center gap-2">
          <input
            v-model="player.proficiencies[index]"
            class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
          <button type="button" class="shrink-0 text-ink hover:text-crimson" @click="removeProficiency(index)">
            <PhTrash :size="14" />
          </button>
        </div>
        <button type="button" class="tap-target text-sm text-gold hover:text-gold-dim" @click="addProficiency">
          + Add proficiency
        </button>
      </div>
    </section>

    <section>
      <h2 class="mb-3 font-display text-lg text-gold">Relationships</h2>
      <EntityLinkList
        :model-value="relationshipIds"
        :options="npcOptions"
        @add="addRelationship"
        @remove="removeRelationship"
      />
      <p v-if="relationshipEntries.length === 0" class="mt-2 text-sm text-ink">No linked NPCs yet.</p>
      <div v-else class="mt-2 flex flex-col gap-2">
        <div v-for="entry in relationshipEntries" :key="entry.npcId" class="flex items-center gap-3">
          <EntityChip :label="entry.npcName" to="/world/npcs" class="shrink-0" />
          <input
            v-model="player.relationshipMap[entry.npcId]"
            class="min-w-0 flex-1 rounded-md border border-border bg-slate px-2 py-1 text-sm text-parchment outline-none"
          />
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-3 font-display text-lg text-gold">XP Log</h2>
      <p class="mb-2 text-sm text-ink">Total XP: <span class="font-mono text-gold">{{ player.experiencePoints }}</span></p>
      <XPLog :player="player" />
    </section>
  </div>
</template>
