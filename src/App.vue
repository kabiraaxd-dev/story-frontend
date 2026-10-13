<script setup lang="ts">

import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
  >
    Skip to content
  </a>
  <div class="flex min-h-dvh flex-col">
    <header class="border-b-4 border-brand-500 bg-white">
      <div class="mx-auto flex max-w-6xl items-center px-4 py-3">
        <RouterLink to="/" class="font-display text-2xl text-ink">📚 Story app</RouterLink>
      </div>
    </header>

    <div class="flex-1">
      <RouterView />
    </div>

    <footer class="py-8 text-center text-sm text-ink/60">Made with ❤ for curious little readers</footer>
  </div>
</template>

<style scoped></style>
