<script setup lang="ts">
import { PhPlus, PhTrash } from '@phosphor-icons/vue'
import type { Campaign, SkillDefinition } from '@/types'

const props = defineProps<{ campaign: Campaign }>()

const COMPETENCE_MODELS: SkillDefinition['competenceModel'][] = ['proficiency', 'percentage', 'rank', 'boolean']

function addStat() {
  props.campaign.systemDefinition.stats.push({
    key: '',
    label: '',
    abbreviation: '',
    minValue: 1,
    maxValue: 20,
  })
}
function removeStat(index: number) {
  props.campaign.systemDefinition.stats.splice(index, 1)
}

function addSkill() {
  props.campaign.systemDefinition.skills.push({ key: '', label: '', competenceModel: 'proficiency' })
}
function removeSkill(index: number) {
  props.campaign.systemDefinition.skills.splice(index, 1)
}

function addCondition() {
  props.campaign.systemDefinition.conditions.push({ key: '', label: '', description: '' })
}
function removeCondition(index: number) {
  props.campaign.systemDefinition.conditions.splice(index, 1)
}

function addProficiencyTier() {
  props.campaign.systemDefinition.proficiencyScale.push('')
}
function removeProficiencyTier(index: number) {
  props.campaign.systemDefinition.proficiencyScale.splice(index, 1)
}
</script>

<template>
  <section class="border-b border-border px-6 py-4">
    <p class="mb-1 font-display text-lg text-gold">System Setup — {{ campaign.systemDefinition.name }}</p>
    <p class="mb-4 text-xs text-ink">
      Edits the current system's stats, skills, conditions, and toggles in place. Switching to a different preset
      isn't offered here — that would silently orphan the keys every existing character sheet already uses.
    </p>

    <div class="mb-4">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-sm font-semibold text-parchment">Stats</p>
        <button type="button" class="tap-target text-gold hover:text-gold-dim" @click="addStat">
          <PhPlus :size="14" />
        </button>
      </div>
      <div v-for="(stat, index) in campaign.systemDefinition.stats" :key="index" class="mb-2 flex flex-wrap items-center gap-2">
        <input v-model="stat.key" placeholder="key" class="w-24 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        <input v-model="stat.label" placeholder="Label" class="w-28 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        <input v-model="stat.abbreviation" placeholder="STR" class="w-14 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        <input v-model.number="stat.minValue" type="number" class="w-14 rounded-md border border-border bg-slate px-2 py-1 text-center text-xs text-parchment outline-none" />
        <input v-model.number="stat.maxValue" type="number" class="w-14 rounded-md border border-border bg-slate px-2 py-1 text-center text-xs text-parchment outline-none" />
        <input v-model="stat.modifierFormula" placeholder="floor(({value}-10)/2)" class="flex-1 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeStat(index)">
          <PhTrash :size="12" />
        </button>
      </div>
      <p v-if="campaign.systemDefinition.stats.length === 0" class="text-xs text-ink">No stats defined.</p>
    </div>

    <div class="mb-4">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-sm font-semibold text-parchment">Skills</p>
        <button type="button" class="tap-target text-gold hover:text-gold-dim" @click="addSkill">
          <PhPlus :size="14" />
        </button>
      </div>
      <div v-for="(skill, index) in campaign.systemDefinition.skills" :key="index" class="mb-2 flex flex-wrap items-center gap-2">
        <input v-model="skill.key" placeholder="key" class="w-24 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        <input v-model="skill.label" placeholder="Label" class="w-28 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        <select v-model="skill.linkedStatKey" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment">
          <option value="">No linked stat</option>
          <option v-for="stat in campaign.systemDefinition.stats" :key="stat.key" :value="stat.key">{{ stat.label || stat.key }}</option>
        </select>
        <select v-model="skill.competenceModel" class="rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment">
          <option v-for="model in COMPETENCE_MODELS" :key="model" :value="model">{{ model }}</option>
        </select>
        <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeSkill(index)">
          <PhTrash :size="12" />
        </button>
      </div>
      <p v-if="campaign.systemDefinition.skills.length === 0" class="text-xs text-ink">No skills defined.</p>
    </div>

    <div class="mb-4">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-sm font-semibold text-parchment">Conditions</p>
        <button type="button" class="tap-target text-gold hover:text-gold-dim" @click="addCondition">
          <PhPlus :size="14" />
        </button>
      </div>
      <div v-for="(condition, index) in campaign.systemDefinition.conditions" :key="index" class="mb-2 flex flex-wrap items-center gap-2">
        <input v-model="condition.key" placeholder="key" class="w-24 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        <input v-model="condition.label" placeholder="Label" class="w-28 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        <input v-model="condition.description" placeholder="Effect text…" class="flex-1 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        <input v-model="condition.color" placeholder="color" class="w-20 rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        <button type="button" class="tap-target text-ink hover:text-crimson" @click="removeCondition(index)">
          <PhTrash :size="12" />
        </button>
      </div>
      <p v-if="campaign.systemDefinition.conditions.length === 0" class="text-xs text-ink">No conditions defined.</p>
    </div>

    <div class="mb-4">
      <p class="mb-2 text-sm font-semibold text-parchment">Proficiency Scale</p>
      <div class="flex flex-wrap items-center gap-2">
        <div
          v-for="(_tier, index) in campaign.systemDefinition.proficiencyScale"
          :key="index"
          class="flex items-center gap-1 rounded-full border border-border bg-slate px-2 py-0.5 text-xs text-parchment"
        >
          <input v-model="campaign.systemDefinition.proficiencyScale[index]" class="w-20 bg-transparent outline-none" />
          <button type="button" class="text-ink hover:text-crimson" @click="removeProficiencyTier(index)">
            <PhTrash :size="10" />
          </button>
        </div>
        <button type="button" class="tap-target text-xs text-gold hover:text-gold-dim" @click="addProficiencyTier">
          + Add tier
        </button>
      </div>
    </div>

    <div>
      <p class="mb-2 text-sm font-semibold text-parchment">Feature Toggles</p>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label class="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" v-model="campaign.systemDefinition.hasThreatRating" class="h-4 w-4 accent-gold" /> Threat Rating
          </label>
          <input v-if="campaign.systemDefinition.hasThreatRating" v-model="campaign.systemDefinition.threatRatingLabel" placeholder="CR, Threat Level…" class="mt-1 w-full rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        </div>
        <div>
          <label class="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" v-model="campaign.systemDefinition.hasMagicSystem" class="h-4 w-4 accent-gold" /> Magic System
          </label>
          <input v-if="campaign.systemDefinition.hasMagicSystem" v-model="campaign.systemDefinition.magicSystemLabel" placeholder="Spell Slots, Mana…" class="mt-1 w-full rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        </div>
        <div>
          <label class="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" v-model="campaign.systemDefinition.hasHealthPoints" class="h-4 w-4 accent-gold" /> Health Points
          </label>
          <input v-if="campaign.systemDefinition.hasHealthPoints" v-model="campaign.systemDefinition.healthLabel" placeholder="HP, Stress…" class="mt-1 w-full rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        </div>
        <div>
          <label class="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" v-model="campaign.systemDefinition.hasDeathMechanic" class="h-4 w-4 accent-gold" /> Death Mechanic
          </label>
          <input v-if="campaign.systemDefinition.hasDeathMechanic" v-model="campaign.systemDefinition.deathMechanicLabel" placeholder="Death Saves…" class="mt-1 w-full rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        </div>
        <div>
          <label class="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" v-model="campaign.systemDefinition.hasInitiative" class="h-4 w-4 accent-gold" /> Initiative
          </label>
          <input v-if="campaign.systemDefinition.hasInitiative" v-model="campaign.systemDefinition.initiativeLabel" placeholder="Initiative, Reflex Order…" class="mt-1 w-full rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        </div>
        <div>
          <label class="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" v-model="campaign.systemDefinition.hasAttunement" class="h-4 w-4 accent-gold" /> Attunement
          </label>
          <input v-if="campaign.systemDefinition.hasAttunement" v-model="campaign.systemDefinition.attunementLabel" placeholder="Attunement, Bonding…" class="mt-1 w-full rounded-md border border-border bg-slate px-2 py-1 text-xs text-parchment outline-none" />
        </div>
        <label class="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" v-model="campaign.systemDefinition.hasEncumbrance" class="h-4 w-4 accent-gold" /> Encumbrance
        </label>
        <label class="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" v-model="campaign.systemDefinition.hasSizeCategories" class="h-4 w-4 accent-gold" /> Size Categories
        </label>
      </div>
    </div>
  </section>
</template>
