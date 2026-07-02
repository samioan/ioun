<script setup lang="ts">
import { useRoute } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'

const route = useRoute()
</script>

<template>
  <div>
    <PageHeader :title="`Dungeon — ${route.params.id}`" />
    <p class="p-6 text-ink">Coming soon.</p>
  </div>
</template>
