<script setup lang="ts">
import { computed } from 'vue'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import type { Option } from '@/types'

const props = defineProps<{ categories: Option[] }>()
const model = defineModel<string>({ default: 'all' })

// "all" is a real value (not an empty string), which avoids edge cases with empty select values.
const label = computed(
  () => props.categories.find((c) => c.slug === model.value)?.name ?? 'All categories',
)

const itemClass =
  'flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-xl px-4 text-lg outline-none data-[highlighted]:bg-brand-100 data-[state=checked]:font-bold'
</script>

<template>
  <SelectRoot :model-value="model" @update:model-value="(v) => (model = v ? String(v) : 'all')">
    <SelectTrigger
      aria-label="Choose a category"
      class="inline-flex min-h-12 min-w-56 items-center justify-between gap-3 rounded-full bg-white px-5 text-lg font-bold ring-2 ring-ink/10 transition hover:bg-ocean-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ocean-600 data-[state=open]:ring-ocean-600"
    >
      <SelectValue>{{ label }}</SelectValue>
      <SelectIcon aria-hidden="true">▾</SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="8"
        class="z-50 min-w-56 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10"
      >
        <SelectViewport class="p-2">
          <SelectItem value="all" :class="itemClass">
            <SelectItemText>All categories</SelectItemText>
            <SelectItemIndicator aria-hidden="true">✓</SelectItemIndicator>
          </SelectItem>
          <SelectItem v-for="c in categories" :key="c.id" :value="c.slug" :class="itemClass">
            <SelectItemText>{{ c.name }}</SelectItemText>
            <SelectItemIndicator aria-hidden="true">✓</SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>