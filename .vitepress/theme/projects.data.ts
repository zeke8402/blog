import { createContentLoader } from 'vitepress'

export interface ProjectEntry {
  title: string
  description: string
  repo: string
  site: string
  featured: boolean
  date?: string
  url: string
}

export default createContentLoader('projects/{*.md,*/index.md}', {
  transform(raw): ProjectEntry[] {
    return raw
      .filter(({ url }) => url !== '/projects/')
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title,
        description: frontmatter.description ?? '',
        repo: frontmatter.repo ?? '',
        site: frontmatter.site ?? '',
        featured: frontmatter.featured ?? false,
        date: frontmatter.date
      }))
      .sort((a, b) => {
        if (!a.date || !b.date) return 0
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
  }
})
