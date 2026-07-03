<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { PhBookOpen } from '@phosphor-icons/vue'
import { useCampaignStore } from '@/stores/campaign'
import { useTopicsStore } from '@/stores/topics'
import { useSidePanel } from '@/composables/useSidePanel'
import { createDefaultTopic } from '@/utils/defaults'
import CampaignWizard from '@/components/campaign/wizard/CampaignWizard.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import TopicCard from '@/components/topics/TopicCard.vue'
import TopicDetail from '@/components/topics/TopicDetail.vue'
import type { CampaignTopic } from '@/types'

const campaignStore = useCampaignStore()
const topicsStore = useTopicsStore()
const sidePanel = useSidePanel()

const hasCampaign = computed(() => !!campaignStore.getActive())
const showWizard = ref(false)

interface StatusTab {
  key: string
  label: string
  statuses: CampaignTopic['status'][]
}

const STATUS_TABS: StatusTab[] = [
  { key: 'all', label: 'All', statuses: [] },
  { key: 'open', label: 'Open', statuses: ['open'] },
  { key: 'ongoing', label: 'Ongoing', statuses: ['ongoing'] },
  { key: 'resolved', label: 'Resolved', statuses: ['resolved'] },
]
const activeTab = ref('all')

const allTopics = computed(() => Object.values(topicsStore.items))

const filteredTopics = computed(() => {
  const tab = STATUS_TABS.find((t) => t.key === activeTab.value)
  if (!tab || tab.statuses.length === 0) return allTopics.value
  return allTopics.value.filter((t) => tab.statuses.includes(t.status))
})

const groups = computed(() => {
  const byCategory = new Map<string, CampaignTopic[]>()
  for (const topic of filteredTopics.value) {
    if (!byCategory.has(topic.category)) byCategory.set(topic.category, [])
    byCategory.get(topic.category)!.push(topic)
  }
  return [...byCategory.entries()].sort((a, b) => a[0].localeCompare(b[0]))
})

function openDetail(topic: CampaignTopic) {
  sidePanel.push({ title: topic.title || 'Untitled Topic', component: TopicDetail, props: { topic } })
}

function addTopic() {
  const topic = topicsStore.add(createDefaultTopic({ title: 'New Topic' }))
  openDetail(topic)
}
</script>

<template>
  <div v-if="!hasCampaign" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <PhBookOpen :size="40" class="text-ink" />
    <p class="max-w-md text-ink">Create a campaign first to start tracking topics and hooks.</p>
    <Button label="Create Campaign" @click="showWizard = true" />
    <CampaignWizard v-if="showWizard" @complete="showWizard = false" @cancel="showWizard = false" />
  </div>

  <div v-else class="flex h-full flex-col">
    <PageHeader title="Topics & Hooks">
      <template #actions>
        <Button label="Add Topic" @click="addTopic" />
      </template>
    </PageHeader>

    <div class="flex items-center gap-2 border-b border-border px-6 py-3">
      <button
        v-for="tab in STATUS_TABS"
        :key="tab.key"
        type="button"
        class="tap-target rounded-full border px-3 py-1 text-xs"
        :class="
          activeTab === tab.key
            ? 'border-gold text-gold'
            : 'border-border text-ink hover:border-gold-dim hover:text-parchment'
        "
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-4">
      <div v-if="allTopics.length === 0" class="flex flex-col items-center gap-3 py-16 text-center">
        <PhBookOpen :size="32" class="text-ink" />
        <p class="text-sm text-ink">No hooks dangling yet. Add a rumor, prophecy, or promise to track.</p>
      </div>
      <div v-else-if="filteredTopics.length === 0" class="py-16 text-center text-sm text-ink">
        No topics match this filter.
      </div>
      <div v-else class="flex flex-col gap-6">
        <div v-for="[category, topics] in groups" :key="category">
          <p class="mb-2 text-xs uppercase tracking-wide text-ink">{{ category }} ({{ topics.length }})</p>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <TopicCard v-for="topic in topics" :key="topic.id" :topic="topic" @select="openDetail(topic)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
