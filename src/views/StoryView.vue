<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { api } from '@/lib/api'
import PillToggleGroup from '@/components/PillToggleGroup.vue'
import { useReadingPrefs } from '@/composables/useReadingPrefs'
import type { PillItem, StoryDetail } from '@/types'

const route = useRoute()
const prefs = useReadingPrefs()

const story = ref<StoryDetail | null>(null)
const loading = ref(true)
const failed = ref(false)

const sizeItems: PillItem[] = [
  { value: 'm', label: 'A', aria: 'Normal text' },
  { value: 'l', label: 'A+', aria: 'Large text' },
  { value: 'xl', label: 'A++', aria: 'Extra large text' },
]
const themeItems: PillItem[] = [
  { value: 'light', label: 'Light' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'night', label: 'Night' },
]
// Complete class names, so Tailwind can find them.
const sizeClass: Record<string, string> = { m: 'text-xl', l: 'text-2xl', xl: 'text-3xl' }

const paragraphs = computed(
  () => story.value?.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) ?? [],
)

let latest = 0

async function load() {
  const id = ++latest
  loading.value = true
  failed.value = false
  story.value = null
  try {
    const result = await api<StoryDetail>(`/stories/${encodeURIComponent(String(route.params.slug))}`)
    if (id === latest) story.value = result
  } catch {
    if (id === latest) failed.value = true
  } finally {
    if (id === latest) loading.value = false
  }
}

// The slug check stops a pointless request while navigating away from this page.
watch(() => route.params.slug, (slug) => { if (slug) load() }, { immediate: true })
</script>

<template>
  <main id="main" class="mx-auto max-w-3xl px-4 py-6">
    <RouterLink to="/" class="btn">← All stories</RouterLink>

    <div v-if="loading" role="status" class="mt-6 h-96 rounded-card bg-white/70 motion-safe:animate-pulse">
      <span class="sr-only">Loading story…</span>
    </div>

    <div v-else-if="failed || !story" role="alert" class="mt-6 rounded-card bg-white p-8 text-center shadow-pop">
      <p class="font-display text-2xl">We couldn't find that story.</p>
      <p class="mt-2">It may have moved, or you may be offline.</p>
      <RouterLink to="/" class="btn mt-4">Back to all stories</RouterLink>
    </div>

    <article
      v-else
      :data-read-theme="prefs.theme"
      class="mt-6 rounded-card bg-[var(--read-bg)] p-5 text-[var(--read-fg)] shadow-pop sm:p-8"
    >
      <h1 class="text-3xl sm:text-5xl">{{ story.title }}</h1>
      <p class="mt-2 opacity-80">
        By {{ story.author.name }} · {{ story.category.name }} · Ages {{ story.ageGroup.label }} · {{ story.readingMinutes }} min read
      </p>

      <img
        v-if="story.mainImageUrl"
        :src="story.mainImageUrl"
        :alt="`Illustration for ${story.title}`"
        class="mt-6 w-full rounded-2xl"
      />
      <audio
        v-if="story.audioUrl"
        :src="story.audioUrl"
        controls
        preload="none"
        aria-label="Listen to this story"
        class="mt-6 w-full"
      />

      <div class="mt-6 flex flex-wrap gap-x-6 gap-y-3">
        <PillToggleGroup v-model="prefs.size" :items="sizeItems" label="Text size" />
        <PillToggleGroup v-model="prefs.theme" :items="themeItems" label="Page color" />
      </div>

      <!-- {{ }} escapes the text. Never use v-html for story content. -->
      <div class="mt-6 max-w-prose space-y-6 leading-relaxed" :class="sizeClass[prefs.size] ?? 'text-2xl'">
        <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
      </div>

      <ul v-if="story.tags.length" class="mt-8 flex flex-wrap gap-2 text-base">
        <li v-for="t in story.tags" :key="t.slug" class="rounded-full bg-black/5 px-3 py-1 font-bold">
          #{{ t.name }}
        </li>
      </ul>
    </article>
  </main>
</template>