<script setup lang="ts">
import { computed } from 'vue'
import { useCampaignStore } from '@/stores/campaign'

const campaignStore = useCampaignStore()
const campaign = computed(() => campaignStore.getActive())
</script>

<template>
  <div v-if="campaign" class="flex items-center gap-3 px-6 py-5">
    <h1 class="font-display text-2xl text-gold">{{ campaign.name }}</h1>
    <span class="rounded-full border border-gold-dim px-2 py-0.5 text-xs text-ink">
      {{ campaign.systemDefinition.name }}
    </span>
  </div>
</template>
