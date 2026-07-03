<script setup lang="ts">
import Button from 'primevue/button'

const emit = defineEmits<{ create: [] }>()
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
    <h1 class="font-display text-4xl text-gold">Ioun</h1>
    <p class="max-w-md text-ink">Everything a dungeon master needs. Nothing they don't.</p>
    <Button label="Create Campaign" @click="emit('create')" />
  </div>
</template>
