<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { thumb } from '@/lib/media'
import type { StorySummary } from '@/types'

defineProps<{ story: StorySummary }>()
</script>

<template>
  <RouterLink
    :to="`/story/${story.slug}`"
    class="group flex flex-col overflow-hidden rounded-card bg-white shadow-pop ring-1 ring-black/5 transition focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ocean-600 motion-safe:hover:-translate-y-1"
  >
    <div class="aspect-[3/2] bg-brand-100">
      <!-- alt is empty because the title right below already names the story -->
      <img
        v-if="story.mainImageUrl"
        :src="thumb(story.mainImageUrl)"
        alt=""
        loading="lazy"
        class="size-full object-cover"
      />
      <div v-else class="grid size-full place-items-center text-6xl" aria-hidden="true">📖</div>
    </div>

    <div class="flex flex-1 flex-col gap-2 p-4">
      <div class="flex flex-wrap gap-2 text-sm font-bold">
        <span class="rounded-full bg-grape-100 px-3 py-1 text-grape-600">{{ story.category.name }}</span>
        <span class="rounded-full bg-leaf-100 px-3 py-1 text-leaf-600">Ages {{ story.ageGroup.label }}</span>
      </div>
      <h2 class="text-xl leading-snug group-hover:text-brand-600">{{ story.title }}</h2>
      <p class="line-clamp-3 text-ink/80">{{ story.summary }}</p>
      <div class="mt-auto space-x-1">
        <span v-for="tag in story.tags" :key="tag.slug" class="rounded text-sm bg-blue-100 px-2 py-1 text-blue-600">#{{ tag.name }}</span>
      </div>
      <!-- <p class=" pt-2 text-sm text-ink/60">by {{ story.author.name }}</p> -->
      <p class="mt-auto flex items-center justify-between pt-2 text-sm text-ink/60">
  <span>by {{ story.author.name }}</span>
  <span><span aria-hidden="true">⏱</span> {{ story.readingMinutes }} min read</span>
</p>
    </div>
  </RouterLink>
</template>