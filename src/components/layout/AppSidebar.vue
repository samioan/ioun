<script setup lang="ts">
import { computed, type Component } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  PhHouse,
  PhPlayCircle,
  PhUsersThree,
  PhDiceFive,
  PhMapTrifold,
  PhMapPin,
  PhUserCircle,
  PhFlag,
  PhBookOpen,
  PhScroll,
  PhLightbulb,
  PhCoins,
  PhSkull,
  PhDoorOpen,
  PhFileText,
  PhCalendarBlank,
  PhBookBookmark,
  PhSpeakerHigh,
  PhGear,
} from '@phosphor-icons/vue'
import { useSessionMode } from '@/composables/useSessionMode'

interface NavItem {
  label: string
  to: string
  icon: Component
  activeDot?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    label: 'Play',
    items: [
      { label: 'Session', to: '/session', icon: PhPlayCircle, activeDot: true },
      { label: 'Players', to: '/players', icon: PhUsersThree },
      { label: 'Dice / Tables', to: '/tables', icon: PhDiceFive },
    ],
  },
  {
    label: 'World',
    items: [
      { label: 'Locations', to: '/world/landmarks', icon: PhMapTrifold },
      { label: 'Map', to: '/world/map', icon: PhMapPin },
      { label: 'NPCs', to: '/world/npcs', icon: PhUserCircle },
      { label: 'Factions', to: '/world/factions', icon: PhFlag },
    ],
  },
  {
    label: 'Story',
    items: [
      { label: 'Campaign Arc', to: '/campaign', icon: PhBookOpen },
      { label: 'Quests', to: '/quests', icon: PhScroll },
      { label: 'Topics & Hooks', to: '/topics', icon: PhLightbulb },
    ],
  },
  {
    label: 'Assets',
    items: [
      { label: 'Loot', to: '/loot', icon: PhCoins },
      { label: 'Bestiary', to: '/bestiary', icon: PhSkull },
      { label: 'Dungeons', to: '/dungeons', icon: PhDoorOpen },
      { label: 'Handouts', to: '/handouts', icon: PhFileText },
    ],
  },
  {
    label: 'Reference',
    items: [
      { label: 'Calendar', to: '/calendar', icon: PhCalendarBlank },
      { label: 'Rules', to: '/rules', icon: PhBookBookmark },
      { label: 'Atmosphere', to: '/ambient', icon: PhSpeakerHigh },
    ],
  },
]

const route = useRoute()
const { isPlaying } = useSessionMode()

// Play mode forces icon-only regardless of viewport; otherwise it's a pure
// CSS breakpoint collapse at Tailwind's `xl` (1280px), per UX Principle 3/7.
const forceCollapsed = computed(() => isPlaying.value)

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <aside
    class="h-full flex flex-col overflow-y-auto border-r border-border bg-obsidian py-4 transition-all duration-200"
    :class="forceCollapsed ? 'w-16' : 'w-16 xl:w-64'"
  >
    <nav class="flex flex-1 flex-col gap-6">
      <div class="flex flex-col gap-1 border-b border-border pb-2">
        <RouterLink
          to="/"
          title="Dashboard"
          class="tap-target relative flex items-center gap-3 border-l-2 px-4 py-2 text-sm text-parchment hover:bg-slate"
          :class="isActive('/') ? 'border-gold bg-slate text-gold' : 'border-transparent'"
        >
          <PhHouse :size="20" />
          <span :class="forceCollapsed ? 'hidden' : 'hidden xl:inline'">Dashboard</span>
        </RouterLink>
      </div>
      <div v-for="group in groups" :key="group.label" class="flex flex-col gap-1">
        <p
          class="px-4 text-xs font-semibold uppercase tracking-wider text-ink"
          :class="forceCollapsed ? 'hidden' : 'hidden xl:block'"
        >
          {{ group.label }}
        </p>
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          :title="item.label"
          class="tap-target relative flex items-center gap-3 border-l-2 px-4 py-2 text-sm text-parchment hover:bg-slate"
          :class="isActive(item.to) ? 'border-gold bg-slate text-gold' : 'border-transparent'"
        >
          <component :is="item.icon" :size="20" />
          <span :class="forceCollapsed ? 'hidden' : 'hidden xl:inline'">{{ item.label }}</span>
          <span
            v-if="item.activeDot && isPlaying"
            class="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 animate-pulse-gold rounded-full bg-gold"
          />
        </RouterLink>
      </div>
    </nav>

    <div class="mt-auto border-t border-border pt-2">
      <RouterLink
        to="/settings"
        title="Settings"
        class="tap-target flex items-center gap-3 border-l-2 px-4 py-2 text-sm text-parchment hover:bg-slate"
        :class="isActive('/settings') ? 'border-gold bg-slate text-gold' : 'border-transparent'"
      >
        <PhGear :size="20" />
        <span :class="forceCollapsed ? 'hidden' : 'hidden xl:inline'">Settings</span>
      </RouterLink>
    </div>
  </aside>
</template>
