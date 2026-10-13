<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/lib/api'
import StoryCard from '@/components/StoryCard.vue'
import PillToggleGroup from '@/components/PillToggleGroup.vue'
import CategorySelect from '@/components/CategorySelect.vue'
import { useDebounce } from '@/composables/useDebounce'
import type { AgeGroup, Option, PillItem, StoryList } from '@/types'

const route = useRoute()
const router = useRouter()

const str = (v: unknown, fallback: string) => (typeof v === 'string' && v ? v : fallback)

// Start from the address bar, so Back, refresh and shared links keep the filters.
const category = ref(str(route.query.category, 'all'))
const ageGroup = ref(str(route.query.age, 'all'))
const query = ref(str(route.query.q, ''))
const page = ref(Math.max(1, Number(route.query.page) || 1))

const data = ref<StoryList | null>(null)
const categories = ref<Option[]>([])
const ageGroups = ref<AgeGroup[]>([])
const loading = ref(true)
const error = ref(false)
const q = ref('')

const ageItems = computed<PillItem[]>(() => [
  { value: 'all', label: 'All ages' },
  ...ageGroups.value.map((a) => ({ value: String(a.id), label: `Ages ${a.label}` })),
])

const totalPages = computed(() =>
  data.value ? Math.max(1, Math.ceil(data.value.total / data.value.pageSize)) : 1,
)
const filtersActive = computed(() => category.value !== 'all' || ageGroup.value !== 'all')

const debouncedLoad = useDebounce(load, 800)

let latest = 0 // guards against slow, out-of-order responses

async function load() {
  const id = ++latest
  loading.value = true
  error.value = false

  const params = new URLSearchParams({ page: String(page.value) })
  const query: Record<string, string> = {}
  if (category.value !== 'all') { params.set('category', category.value); query.category = category.value }
  if (ageGroup.value !== 'all') { params.set('ageGroup', ageGroup.value); query.age = ageGroup.value }
  if (q.value) { params.set('q', q.value); query.q = q.value }
  if (page.value > 1) query.page = String(page.value)
  router.replace({ query })

  try {
    const result = await api<StoryList>(`/stories?${params}`)
    if (id === latest) data.value = result
  } catch {
    if (id === latest) error.value = true
  } finally {
    if (id === latest) loading.value = false
  }
}

async function search() {
  // q.value = ''
  debouncedLoad()
}

function resetFilters() {
  category.value = 'all'
  ageGroup.value = 'all'
}

watch([category, ageGroup], () => { page.value = 1 })
watch([category, ageGroup, page], load)
watch(page, () => window.scrollTo({ top: 0 }))

onMounted(() => {
  load()
  Promise.all([api<Option[]>('/categories'), api<AgeGroup[]>('/age-groups')])
    .then(([c, a]) => { categories.value = c; ageGroups.value = a })
    .catch(() => { /* filters stay hidden, stories still work */ })
})
</script>

<template>
  <main id="main" class="mx-auto max-w-6xl px-4 py-8">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-4xl sm:text-5xl">Pick a story!</h1>
        <p class="mt-2 text-lg text-ink/70">Short tales for little readers.</p>
      </div>
      <div class="flex flex-wrap gap-2  font-bold">
        <!-- <span v-if="filtersActive" class="rounded-full bg-grape-100 px-3 py-1 text-grape-600">Filters active</span>
        <span v-if="data" class="rounded-full bg-leaf-100 px-3 py-1 text-leaf-600">{{ data.total }} stories</span> -->
        <input
          type="text"
          v-model="q"
          @input="search()"
          placeholder="Search stories by title"
          class="w-52 rounded-full border-2 border-ink/10 bg-white px-4 py-2  font-bold text-ink/80 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ocean-600"
        />
      </div>
    </div>

    <section aria-label="Filters" class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <PillToggleGroup v-if="ageGroups.length" v-model="ageGroup" :items="ageItems" label="Filter by age" />
      <CategorySelect v-if="categories.length" v-model="category" :categories="categories" />
    </section>

    <p v-if="loading" role="status" class="sr-only">Loading stories…</p>

    <!-- Error -->
    <div v-if="error" role="alert" class="mt-10 rounded-card bg-white p-8 text-center shadow-pop">
      <p class="font-display text-2xl">Oops! The stories wandered off.</p>
      <p class="mt-2">Check your connection and try again.</p>
      <button type="button" class="btn mt-4" @click="load">Try again</button>
    </div>

    <!-- First load -->
    <div v-else-if="loading && !data" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      <div v-for="n in 6" :key="n" class="h-80 rounded-card bg-white/70 ring-1 ring-black/5 motion-safe:animate-pulse" />
    </div>

    <!-- Nothing found -->
    <div v-else-if="data && data.items.length === 0" class="mt-10 rounded-card bg-white p-8 text-center shadow-pop">
      <p class="font-display text-2xl">No stories here yet.</p>
      <p class="mt-2">Try a different age or category.</p>
      <button v-if="filtersActive" type="button" class="btn mt-4" @click="resetFilters">Show all stories</button>
    </div>

    <!-- Stories -->
    <ul
      v-else-if="data"
      class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      :class="{ 'opacity-60 transition-opacity': loading }"
    >
      <li v-for="s in data.items" :key="s.id">
        <StoryCard :story="s" class="h-full" />
      </li>
    </ul>

    <nav v-if="data && totalPages > 1" aria-label="Pages" class="mt-10 flex items-center justify-center gap-4">
      <button type="button" class="btn" :disabled="page <= 1" @click="page--">← Back</button>
      <span class="text-lg font-bold">Page {{ page }} of {{ totalPages }}</span>
      <button type="button" class="btn" :disabled="page >= totalPages" @click="page++">Next →</button>
    </nav>
  </main>
</template>