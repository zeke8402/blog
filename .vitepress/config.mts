import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: 'Zeke',
  description: 'Personal site and blog',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Projects', link: '/projects/' }
    ]
  }
})
