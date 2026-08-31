<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeBackground from './components/HomeBackground.vue'

const route = useRoute()
const { frontmatter } = useData()
const isProjectPage = computed(() => /\/projects\/[^/]+/.test(route.path))
const isBlogPost = computed(() => route.path.startsWith('/blog/posts/'))
const publishedDate = computed(() => {
  const rawDate = frontmatter.value.date
  if (!rawDate) return ''
  const date = rawDate instanceof Date
    ? rawDate
    : new Date(typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? `${rawDate}T12:00:00` : rawDate)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
})
</script>

<template>
  <div
    class="site-shell"
    :class="{
      'site-shell--project': isProjectPage,
      'site-shell--blog-post': isBlogPost
    }"
  >
    <HomeBackground />
    <DefaultTheme.Layout>
      <template #doc-before>
        <header v-if="isBlogPost" class="article-header">
          <p class="article-header__eyebrow">
            Journal<span v-if="publishedDate" aria-hidden="true">·</span>{{ publishedDate }}
          </p>
          <h1>{{ frontmatter.title }}</h1>
          <p v-if="frontmatter.description" class="article-header__dek">
            {{ frontmatter.description }}
          </p>
          <ul v-if="frontmatter.tags?.length" class="article-header__tags" aria-label="Tags">
            <li v-for="tag in frontmatter.tags" :key="tag">{{ tag }}</li>
          </ul>
        </header>
      </template>
    </DefaultTheme.Layout>
    <footer v-if="isProjectPage" class="site-footer">
      <p>Made by <a :href="withBase('/')">Zeke</a></p>
    </footer>
  </div>
</template>
