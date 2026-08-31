import { createContentLoader } from 'vitepress'

export interface BlogPost {
  title: string
  date: string
  description: string
  tags: string[]
  url: string
}

export default createContentLoader('blog/posts/*.md', {
  transform(raw): BlogPost[] {
    return raw
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title,
        date: frontmatter.date,
        description: frontmatter.description ?? '',
        tags: frontmatter.tags ?? []
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
})
