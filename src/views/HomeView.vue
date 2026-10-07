<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/lib/api'
import type { StoryList, Option, AgeGroup } from '@/types'

const data = ref<StoryList | null>(null)
const categories = ref<Option[]>([])
const ageGroups = ref<AgeGroup[]>([])
const category = ref('')
const ageGroup = ref('')
const page = ref(1)
const loading = ref(false)
const error = ref('')

const totalPages = computed(() => (data.value ? Math.ceil(data.value.total / data.value.pageSize) : 1))

async function load() {
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams({ page: String(page.value) })
    if (category.value) params.set('category', category.value)
    if (ageGroup.value) params.set('ageGroup', ageGroup.value)
    data.value = await api<StoryList>(`/stories?${params}`)
  } catch {
    error.value = 'Could not load stories.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    categories.value = await api<Option[]>('/categories')
    ageGroups.value = await api<AgeGroup[]>('/age-groups')
  } catch {
    error.value = 'Could not load filters.'
  }
  load()
})

watch([category, ageGroup], () => {
  page.value = 1
  load()
})
watch(page, load)
</script>

<template>
  <main class="wrap">
    <h1>Stories</h1>

    <div class="filters">
      <select v-model="category">
        <option value="">All categories</option>
        <option v-for="c in categories" :key="c.id" :value="c.slug">{{ c.name }}</option>
      </select>
      <select v-model="ageGroup">
        <option value="">All ages</option>
        <option v-for="a in ageGroups" :key="a.id" :value="a.id">{{ a.label }}</option>
      </select>
    </div>

    <p v-if="loading">Loading...</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else-if="data && data.items.length === 0">No stories found.</p>

    <div v-else-if="data" class="grid">
      <RouterLink v-for="s in data.items" :key="s.id" :to="`/story/${s.slug}`" class="card">
        <img v-if="s.mainImageUrl" :src="s.mainImageUrl" :alt="s.title" />
        <h2>{{ s.title }}</h2>
        <p>{{ s.summary }}</p>
        <small>{{ s.category.name }} · Ages {{ s.ageGroup.label }} · by {{ s.author.name }}</small>
      </RouterLink>
    </div>

    <div v-if="totalPages > 1" class="pager">
      <button :disabled="page <= 1" @click="page--">Previous</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button :disabled="page >= totalPages" @click="page++">Next</button>
    </div>
  </main>
</template>

<style scoped>
.wrap { max-width: 960px; margin: 0 auto; padding: 1rem; }
.filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
.card { display: block; border: 1px solid #ddd; border-radius: 12px; padding: 0.75rem; text-decoration: none; color: inherit; }
.card img { width: 100%; border-radius: 8px; }
.pager { display: flex; gap: 1rem; align-items: center; justify-content: center; margin-top: 1rem; }
</style>