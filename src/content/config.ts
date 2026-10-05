// src/content/config.ts
// Defines the shape of the frontmatter for posts and case studies.
// Astro validates at build time, miss a field, build fails.

import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tag: z.enum([
      'Local Business',
      'Maintenance',
      'Performance',
      'WordPress Security',
      'General',
      'Side Hustle',
      'Web Design',
    ]),
    date: z.date(),
    readTime: z.string(),
    author: z.string().default('Chris — wpbase.co.uk'),
    excerpt: z.string().optional(),
    // Card / hero image. Path lives in /public, e.g. "/blog/wrong-hosting.jpg".
    // Optional, so posts without one fall back to a tinted placeholder.
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    industry: z.string(),
    timeline: z.string(),
    ongoing: z.string(),
    intro: z.string(),
    // Hero image (logo or branded element). Either an image path or HTML
    // for cases like InclusionIQ where the "logo" is text styled inline.
    heroLogo: z.string().optional(),
    heroLogoHtml: z.string().optional(),
    // Featured image used on the homepage clients section and listings
    featuredImage: z.string().optional(),
    // Atmosphere image for the testimonial break under the hero. When set,
    // the testimonial moves up beside it and no longer repeats at the foot
    // of the page. Path lives in /public, e.g. "/case-studies/catagen-atmosphere-fuel.webp".
    breakImage: z.string().optional(),
    breakImageAlt: z.string().optional(),
    // Closing CTA below the testimonial
    cta: z.object({
      heading: z.string(),
      body: z.string(),
    }),
    // Optional testimonial. Some case studies haven't got one yet.
    testimonial: z.object({
      quote: z.string(),
      name: z.string(),
      role: z.string(),
    }).optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, caseStudies };
