# wpbase.co.uk

Marketing site for WP Base (feedme.design internally). Built with [Astro](https://astro.build) and deployed to Cloudflare Pages.

## Local development

```bash
npm install
npm run dev
```

Dev server runs at `http://localhost:4321`.

## Build

```bash
npm run build
```

Output goes to `dist/`. Preview with `npm run preview`.

## Project structure

```
src/
├── components/       Reusable .astro components (Hero, Pricing, TipCard, etc)
├── content/
│   ├── config.ts     Frontmatter schemas for posts and case studies
│   ├── posts/        Blog posts as .mdx
│   └── caseStudies/  Case studies as .mdx
├── layouts/
│   ├── BaseLayout.astro       Wraps every page (head, fonts, gtag, nav, footer)
│   ├── PostLayout.astro       Wraps blog posts
│   └── CaseStudyLayout.astro  Wraps case studies
├── pages/
│   ├── index.astro                  Homepage
│   ├── blog.astro                   Blog index (auto-generated)
│   ├── 404.astro                    Custom 404
│   ├── posts/[...slug].astro        Dynamic route for posts
│   └── case-studies/[...slug].astro Dynamic route for case studies
├── scripts/
│   └── homepage.ts   Marquee + hero terminal animation (homepage only)
└── styles/
    ├── reset.css     CSS reset
    └── global.css    All site styles

public/
├── case-studies/     Case study images
├── _redirects        Cloudflare Pages redirects (old .html → clean URLs)
├── robots.txt
└── favicons + manifest
```

## Adding a blog post

1. Create `src/content/posts/your-post-slug.mdx`
2. Frontmatter (required fields, see `src/content/config.ts`):
   ```yaml
   ---
   title: "Your post title"
   description: "Short description for meta tag and listings"
   tag: "WordPress Security"   # must be one of the values in config.ts
   date: 2026-05-01
   readTime: "5 min read"
   ---
   ```
3. Write your post in markdown below the frontmatter
4. Drop in components if you need them:
   ```mdx
   import TipCard from '../../components/TipCard.astro';
   import Callout from '../../components/Callout.astro';

   <TipCard number="1" title="Heading">Body</TipCard>
   <Callout>Highlighted note</Callout>
   ```
5. `npm run dev` to preview, then commit. The blog index and post list update themselves.

## Adding a case study

Same pattern under `src/content/caseStudies/`. See an existing one for the frontmatter shape.

## Tag validation

The post `tag` field is locked to an enum in `src/content/config.ts`. Adding a new tag means editing that file first. This prevents typos shipping broken filter buttons.

## Notes

- Sitemap is generated automatically at build time at `/sitemap-index.xml`
- Nav and footer are real components imported by BaseLayout, not client-side fetched
- The marquee and hero terminal scripts only load on the homepage
- Case study testimonials are optional in the frontmatter; the layout handles missing ones


