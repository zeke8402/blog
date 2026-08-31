import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import FancyGraphic from './components/FancyGraphic.vue'
import BlogIndex from './components/BlogIndex.vue'
import ProjectIndex from './components/ProjectIndex.vue'
import './style.css'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('FancyGraphic', FancyGraphic)
    ctx.app.component('BlogIndex', BlogIndex)
    ctx.app.component('ProjectIndex', ProjectIndex)
  }
}
