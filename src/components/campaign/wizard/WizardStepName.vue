<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

const props = defineProps<{
  draft: { name: string; description: string; coverImageUrl: string }
}>()
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <label class="mb-2 block font-display text-2xl text-parchment">What is this campaign called?</label>
      <InputText
        v-model="props.draft.name"
        placeholder="The Iron Vale"
        class="font-display !text-xl"
        autofocus
      />
      <p class="mt-2 text-sm text-ink">Name your world. The rest follows.</p>
    </div>
    <div>
      <label class="mb-2 block text-sm text-ink">Cover image URL (optional)</label>
      <InputText v-model="props.draft.coverImageUrl" placeholder="https://…" />
    </div>
    <div>
      <label class="mb-2 block text-sm text-ink">Description (optional)</label>
      <Textarea v-model="props.draft.description" rows="4" placeholder="A brief pitch for your campaign…" />
    </div>
  </div>
</template>
