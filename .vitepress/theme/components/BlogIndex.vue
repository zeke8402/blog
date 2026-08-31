<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../blog.data'

const tagCounts = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return counts
})

const tags = computed(() => {
  const entries = Array.from(tagCounts.value.entries())
  entries.sort((a, b) => b[1] - a[1])
  return entries
})

const fontSizeFor = (count: number) => {
  const counts = Array.from(tagCounts.value.values())
  const min = Math.min(...counts)
  const max = Math.max(...counts)
  if (min === max) {
    return 18
  }
  const normalized = (count - min) / (max - min)
  return 14 + normalized * 18
}
</script>

<template>
  <section class="blog-index">
    <header class="blog-index__header">
      <h1>Blog</h1>
      <p>Thoughts, notes, and experiments in software and product craft.</p>
    </header>

    <div class="tag-cloud" aria-label="Tag cloud">
      <a
        v-for="[tag, count] in tags"
        :key="tag"
        class="tag-cloud__tag"
        :style="{ fontSize: fontSizeFor(count) + 'px' }"
        href="#posts"
      >
        {{ tag }}
      </a>
    </div>

    <div id="posts" class="post-list">
      <article v-for="post in posts" :key="post.url" class="post-card">
        <h2>
          <a :href="post.url">{{ post.title }}</a>
        </h2>
        <div class="post-meta">
          <span>{{ post.date }}</span>
          <span v-if="post.description">{{ post.description }}</span>
        </div>
        <div class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
