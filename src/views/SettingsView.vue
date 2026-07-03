<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { useCampaignStore } from '@/stores/campaign'
import { useExportImport } from '@/composables/useExportImport'
import PageHeader from '@/components/layout/PageHeader.vue'
import CampaignSwitcher from '@/components/settings/CampaignSwitcher.vue'
import SystemSetupEditor from '@/components/settings/SystemSetupEditor.vue'
import CalendarSetupEditor from '@/components/settings/CalendarSetupEditor.vue'
import DangerZone from '@/components/settings/DangerZone.vue'

const campaignStore = useCampaignStore()
const { downloadCampaign, importCampaign } = useExportImport()

const campaign = computed(() => campaignStore.getActive())
const fileInput = ref<HTMLInputElement | null>(null)
const importMessage = ref('')

function exportCampaign() {
  const ok = downloadCampaign()
  importMessage.value = ok ? '' : 'No active campaign to export.'
}

function triggerImport() {
  fileInput.value?.click()
}

async function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    const parsed = JSON.parse(text)
    if (!window.confirm('This will add a new campaign and all its data — continue?')) return
    const ok = importCampaign(parsed)
    importMessage.value = ok ? 'Campaign imported and made active.' : 'That file doesn\'t look like an Ioun export.'
  } catch {
    importMessage.value = 'Could not read that file — is it a valid Ioun export?'
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="flex h-full flex-col overflow-y-auto">
    <PageHeader title="Settings" />

    <CampaignSwitcher />

    <section class="border-b border-border px-6 py-4">
      <p class="mb-1 font-display text-lg text-gold">Backup</p>
      <p class="mb-3 text-xs text-ink">Export the active campaign and everything linked to it as a JSON file, or import one back in as a new campaign.</p>
      <div class="flex flex-wrap items-center gap-3">
        <Button label="Export Campaign" class="!bg-transparent !text-ink hover:!text-gold" @click="exportCampaign" />
        <Button label="Import Campaign" class="!bg-transparent !text-ink hover:!text-gold" @click="triggerImport" />
        <input ref="fileInput" type="file" accept="application/json" class="hidden" @change="onFileSelected" />
      </div>
      <p v-if="importMessage" class="mt-2 text-xs text-ink">{{ importMessage }}</p>
    </section>

    <template v-if="campaign">
      <SystemSetupEditor :campaign="campaign" />
      <CalendarSetupEditor :campaign="campaign" />
      <DangerZone :campaign="campaign" />
    </template>
    <p v-else class="px-6 py-4 text-sm text-ink">Select or create a campaign above to edit its system and calendar.</p>
  </div>
</template>
