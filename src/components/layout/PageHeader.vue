<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <header class="flex items-center justify-between border-b border-border px-6 py-5">
    <h1 class="font-display text-2xl text-gold">{{ title }}</h1>
    <div class="flex items-center gap-3">
      <slot name="actions" />
    </div>
  </header>
</template>
