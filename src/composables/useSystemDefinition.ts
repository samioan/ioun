import { computed } from 'vue'
import { evaluate } from 'mathjs/number'
import { useCampaignStore } from '@/stores/campaign'
import type { RestTypeDefinition, SkillDefinition, StatDefinition } from '@/types'

// Reads the ACTIVE campaign's SystemDefinition — every consumer must handle
// `system.value` being undefined (no active campaign, a real reachable
// state since the sidebar links to every route regardless of campaign).
export function useSystemDefinition() {
  const campaignStore = useCampaignStore()
  const system = computed(() => campaignStore.getActive()?.systemDefinition)

  function getStatDef(key: string): StatDefinition | undefined {
    return system.value?.stats.find((s) => s.key === key)
  }

  function getStatLabel(key: string): string {
    return getStatDef(key)?.label ?? key
  }

  function getSkillDef(key: string): SkillDefinition | undefined {
    return system.value?.skills.find((s) => s.key === key)
  }

  function getSkillLabel(key: string): string {
    return getSkillDef(key)?.label ?? key
  }

  function getConditionByKey(key: string) {
    return system.value?.conditions.find((c) => c.key === key)
  }

  function getProficiencyLabel(index: number): string {
    return system.value?.proficiencyScale[index] ?? String(index)
  }

  function getRestTypes(): RestTypeDefinition[] {
    return system.value?.restTypes ?? []
  }

  function formatCurrency(record: Record<string, number>): string {
    if (!system.value) return ''
    return system.value.currency
      .filter((c) => record[c.key])
      .map((c) => `${record[c.key]}${c.abbreviation}`)
      .join(' ')
  }

  // StatDefinition.modifierFormula uses a real {value}-token evaluable
  // convention (e.g. "floor(({value} - 10) / 2)"), unlike DerivedStat.formula
  // which is just a human-readable note. Uses mathjs/number (tree-shaken
  // entry point) rather than the full mathjs bundle.
  function evaluateModifier(statValue: number, statKey: string): number | undefined {
    const def = getStatDef(statKey)
    if (!def?.modifierFormula) return undefined
    try {
      const result = evaluate(def.modifierFormula.replace('{value}', String(statValue)))
      return typeof result === 'number' ? result : undefined
    } catch {
      return undefined
    }
  }

  return {
    system,
    getStatDef,
    getStatLabel,
    getSkillDef,
    getSkillLabel,
    getConditionByKey,
    getProficiencyLabel,
    getRestTypes,
    formatCurrency,
    evaluateModifier,
  }
}
