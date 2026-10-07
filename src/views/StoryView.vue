<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { api } from '@/lib/api'
import type { StoryDetail } from '@/types'

const route = useRoute()
const story = ref<StoryDetail | null>(null)
const error = ref('')

onMounted(async () => {
  try {
    story.value = await api<StoryDetail>(`/stories/${route.params.slug}`)
  } catch {
    error.value = 'Story not found.'
  }
})
</script>

<template>
  <main class="wrap">
    <RouterLink to="/">&larr; All stories</RouterLink>
    <p v-if="error">{{ error }}</p>
    <article v-else-if="story">
      <h1>{{ story.title }}</h1>
      <p>By {{ story.author.name }} · {{ story.category.name }} · Ages {{ story.ageGroup.label }}</p>
      <img v-if="story.mainImageUrl" :src="story.mainImageUrl" :alt="story.title" class="hero" />
      <audio v-if="story.audioUrl" :src="story.audioUrl" controls />
      <p class="text">{{ story.content }}</p>
      <p><span v-for="t in story.tags" :key="t.slug" class="tag">#{{ t.name }}</span></p>
    </article>
  </main>
</template>

<style scoped>
.wrap { max-width: 720px; margin: 0 auto; padding: 1rem; }
.hero { width: 100%; border-radius: 12px; }
.text { white-space: pre-line; font-size: 1.2rem; line-height: 1.7; }
.tag { margin-right: 0.5rem; color: #555; }
</style>