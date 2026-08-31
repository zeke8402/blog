<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeBackground from './components/HomeBackground.vue'

const route = useRoute()
const isProjectPage = computed(() => /\/projects\/[^/]+/.test(route.path))
</script>

<template>
  <div class="site-shell" :class="{ 'site-shell--project': isProjectPage }">
    <HomeBackground />
    <DefaultTheme.Layout />
    <footer v-if="isProjectPage" class="site-footer">
      <p>Made by <a :href="withBase('/')">Zeke</a></p>
    </footer>
  </div>
</template>
