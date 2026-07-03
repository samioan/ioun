<script setup lang="ts">
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'

defineProps<{ label: string; to?: string; icon?: Component }>()
</script>

<template>
  <component
    :is="to ? RouterLink : 'span'"
    :to="to"
    class="tap-target inline-flex items-center gap-1.5 rounded-full border border-border bg-slate px-2.5 py-1 text-xs text-parchment"
    :class="to ? 'hover:border-gold hover:text-gold' : ''"
  >
    <component :is="icon" v-if="icon" :size="14" />
    {{ label }}
  </component>
</template>
