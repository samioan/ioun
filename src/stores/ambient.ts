import { defineStore } from 'pinia'
import { createEntityStore } from './createEntityStore'
import type { AmbientCue } from '@/types'

export const useAmbientStore = defineStore('ambient', () => {
  return createEntityStore<AmbientCue>('ioun:ambientCues')
  // TODO(feature-phase): scene presets bundling multiple cues
})
