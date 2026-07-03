<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { PhUsersThree, PhPlayCircle, PhBookOpen, PhArrowRight } from '@phosphor-icons/vue'

const nodes = [
  { label: 'Add your players', to: '/players', icon: PhUsersThree },
  { label: 'Plan your first session', to: '/campaign', icon: PhBookOpen },
  { label: 'Begin playing', to: '/session', icon: PhPlayCircle },
]
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 border-b border-border bg-obsidian px-6 py-4">
    <span class="text-sm text-ink">Start here:</span>
    <template v-for="(node, i) in nodes" :key="node.to">
      <RouterLink
        :to="node.to"
        class="tap-target flex items-center gap-2 rounded-md border border-gold-dim px-3 py-1.5 text-sm text-parchment hover:bg-slate"
      >
        <component :is="node.icon" :size="16" class="text-gold" />
        {{ node.label }}
      </RouterLink>
      <PhArrowRight v-if="i < nodes.length - 1" :size="14" class="text-ink" />
    </template>
  </div>
</template>
