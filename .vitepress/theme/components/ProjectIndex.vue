<script setup lang="ts">
import { data as projects } from '../projects.data'
import { withBase } from 'vitepress'

const featuredProjects = projects.filter((project) => project.featured)
const otherProjects = projects.filter((project) => !project.featured)
</script>

<template>
  <section class="projects-index">
    <header class="blog-index__header">
      <h1>Projects</h1>
      <p>Selected work, experiments, and things I have shipped.</p>
    </header>

    <section v-if="featuredProjects.length" class="project-group">
      <div class="project-group__heading">
        <p class="project-group__eyebrow">Projects that matter</p>
        <h2>Things I’m building for the long haul.</h2>
      </div>

      <div class="post-list project-list--featured">
        <article v-for="project in featuredProjects" :key="project.url" class="project-card project-card--featured">
          <h2>{{ project.title }}</h2>
          <p>{{ project.description }}</p>
          <div class="project-card__links">
            <a v-if="project.repo" :href="project.repo" class="project-link" target="_blank" rel="noreferrer">
              View repository →
            </a>
            <a v-if="project.site" :href="withBase(project.site)" class="project-link">
              View site →
            </a>
          </div>
        </article>
      </div>
    </section>

    <section v-if="otherProjects.length" class="project-group">
      <div class="project-group__heading">
        <p class="project-group__eyebrow">More projects</p>
      </div>
      <div class="post-list">
      <article v-for="project in otherProjects" :key="project.url" class="project-card">
        <h2>{{ project.title }}</h2>
        <p>{{ project.description }}</p>
        <div class="project-card__links">
          <a v-if="project.repo" :href="project.repo" class="project-link" target="_blank" rel="noreferrer">
            View repository →
          </a>
          <a v-if="project.site" :href="withBase(project.site)" class="project-link">View site →</a>
        </div>
      </article>
      </div>
    </section>
  </section>
</template>
