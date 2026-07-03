<script setup lang="ts">
import { useSystemDefinition } from '@/composables/useSystemDefinition'
import type { SkillBlock } from '@/types'

const props = defineProps<{ skills: SkillBlock }>()
const { system, getProficiencyLabel } = useSystemDefinition()

function skillValue(key: string): number {
  return props.skills[key] ?? 0
}

function setSkill(key: string, value: number) {
  props.skills[key] = value
}

function onNumberInput(key: string, value: string) {
  const num = Number(value)
  if (!Number.isNaN(num)) setSkill(key, num)
}
</script>

<template>
  <div v-if="system && system.skills.length" class="flex flex-col gap-2">
    <div
      v-for="skill in system.skills"
      :key="skill.key"
      class="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
    >
      <span class="text-sm text-parchment">{{ skill.label }}</span>

      <div v-if="skill.competenceModel === 'proficiency' && system.proficiencyScale.length" class="flex gap-1">
        <button
          v-for="(tier, index) in system.proficiencyScale"
          :key="tier"
          type="button"
          class="tap-target rounded-md border px-2 py-1 text-xs"
          :class="
            skillValue(skill.key) === index
              ? 'border-gold bg-slate text-gold'
              : 'border-border text-ink hover:bg-slate'
          "
          @click="setSkill(skill.key, index)"
        >
          {{ getProficiencyLabel(index) }}
        </button>
      </div>

      <input
        v-else-if="skill.competenceModel === 'percentage' || skill.competenceModel === 'rank'"
        type="number"
        min="0"
        :max="skill.competenceModel === 'percentage' ? 100 : skill.maxRank"
        :value="skillValue(skill.key)"
        class="tap-target w-20 rounded-md border border-border bg-obsidian text-center font-mono text-sm text-parchment outline-none focus:border-gold"
        @change="onNumberInput(skill.key, ($event.target as HTMLInputElement).value)"
      />

      <input
        v-else-if="skill.competenceModel === 'boolean'"
        type="checkbox"
        class="tap-target h-4 w-4 accent-gold"
        :checked="skillValue(skill.key) === 1"
        @change="setSkill(skill.key, ($event.target as HTMLInputElement).checked ? 1 : 0)"
      />
    </div>
  </div>
  <p v-else class="text-sm text-ink">No skills defined for this system yet.</p>
</template>
