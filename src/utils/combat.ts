import { newId } from './id'
import type { Session, CombatEncounter, InitiativeEntry, Enemy } from '@/types'

export function createEncounter(session: Session): CombatEncounter {
  return {
    id: newId(),
    sessionId: session.id,
    name: `Encounter ${session.combatEncounters.length + 1}`,
    status: 'active',
    round: 1,
    currentTurnIndex: 0,
    initiativeOrder: [],
    enemyIds: [],
    terrain: '',
    notes: '',
    conditions: '',
    rewards: { xp: 0, lootIds: [] },
  }
}

// Shared by InitiativeTracker.vue (switching to Combat mode) and the
// Bestiary page's "quick-add to active encounter" — both need "the current
// active encounter, creating one if none exists yet."
export function ensureActiveEncounter(session: Session): CombatEncounter {
  const existing = session.combatEncounters.find((e) => e.status === 'active')
  if (existing) return existing
  const created = createEncounter(session)
  session.combatEncounters.push(created)
  return created
}

export function resortInitiative(encounter: CombatEncounter) {
  encounter.initiativeOrder.sort((a, b) => b.initiative - a.initiative)
  encounter.currentTurnIndex = Math.min(encounter.currentTurnIndex, Math.max(0, encounter.initiativeOrder.length - 1))
}

export function buildEnemyInitiativeEntry(enemy: Enemy, initiative = 10): InitiativeEntry {
  return {
    entityId: enemy.id,
    entityType: 'enemy',
    initiative,
    hasActed: false,
    conditions: [],
    healthCurrent: enemy.health.current,
    healthMax: enemy.health.max,
    healthTemp: 0,
    derivedStats: enemy.derivedStats,
    isHidden: false,
    actionPools: {},
    notes: '',
  }
}
