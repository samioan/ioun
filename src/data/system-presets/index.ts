import type { SystemDefinition } from '@/types'
import dnd5e from './dnd5e.json'
import pathfinder2e from './pathfinder2e.json'
import coc7e from './coc7e.json'
import blades from './blades.json'
import mothership from './mothership.json'
import generic from './generic.json'

export const systemPresets = [dnd5e, pathfinder2e, coc7e, blades, mothership, generic] as SystemDefinition[]

export function getSystemPreset(id: string): SystemDefinition | undefined {
  return systemPresets.find((preset) => preset.id === id)
}
