<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import type { PillItem } from '@/types'

defineProps<{ items: PillItem[]; label: string }>()
const model = defineModel<string>({ required: true })

// Clicking the selected pill again would "unselect" it. Ignore that, so one pill always stays selected.
function onUpdate(value: unknown) {
  if (value) model.value = String(value)
}

const itemClass =
  'min-h-12 rounded-full bg-white px-5 text-lg font-bold text-ink ring-2 ring-ink/10 transition hover:bg-ocean-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ocean-600 data-[state=on]:bg-ocean-600 data-[state=on]:text-white data-[state=on]:ring-ocean-600'
</script>

<template>
  <ToggleGroupRoot
    type="single"
    :model-value="model"
    :aria-label="label"
    class="flex flex-wrap gap-2"
    @update:model-value="onUpdate"
  >
    <ToggleGroupItem
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      :aria-label="item.aria"
      :class="itemClass"
    >
      {{ item.label }}
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>