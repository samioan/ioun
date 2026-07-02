<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'

const route = useRoute()
const tab = computed(() => (route.meta.worldTab as string) ?? 'Overview')
</script>

<template>
  <div>
    <PageHeader :title="`World — ${tab}`" />
    <p class="p-6 text-ink">Coming soon.</p>
  </div>
</template>
