# AGENTS.md

Project: personal-site (VitePress + Vue)

## Stack
- VitePress site, custom theme in `.vitepress/theme`
- Three.js for Conway's Game of Life background
- Markdown content for pages, blog posts, projects

## Key files
- `.vitepress/config.mts` (site nav/config)
- `.vitepress/theme/index.ts` (theme entry, layout registration)
- `.vitepress/theme/Layout.vue` (global layout, mounts background)
- `.vitepress/theme/components/HomeBackground.vue` (Conway simulation)
- `.vitepress/theme/components/BlogIndex.vue` (blog list + tag cloud)
- `.vitepress/theme/components/ProjectIndex.vue` (projects list)
- `.vitepress/theme/style.css` (global styling, dark theme)
- `index.md` (home page with hero card)
- `about.md` (about page)
- `blog/index.md` and `blog/posts/*.md` (blog)
- `projects/index.md` and `projects/*.md` (projects)

## Behavior notes
- Game of Life background is global and should persist across page navigation; it is mounted in the layout and reused.
- Simulation pauses when the document is hidden.
- Background uses a black canvas with white cells; text is styled for dark mode readability.

## Content conventions
- Blog posts: markdown in `blog/posts/` with frontmatter: `title`, `date`, `description`, `tags`.
- Projects: markdown in `projects/` with frontmatter: `title`, `date`, `description`, `repo`.

## Common tasks
- Run dev server: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## Open questions / future tweaks
- Adjust Conway speed/size in `HomeBackground.vue` (`stepInterval`, point size).
- Refine dark theme contrast, especially for nav + cards.
- Add real resume PDF at `/resume.pdf` or update `about.md` link.
