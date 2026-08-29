import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wpbase.co.uk',
  // Canonical tags emit the trailing-slash form, so every internal link and the
  // dev server need to agree. Without this, /blog and /blog/ were both getting
  // indexed and splitting the signals between them.
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      // Keep noindex pages out of the sitemap entirely. Submitting a URL while
      // also telling Google not to index it sends contradictory signals.
      filter: (page) =>
        !page.includes('/welcome') && !page.includes('/demos/'),
      // Set sensible priorities and change frequencies by route type.
      serialize(item) {
        if (item.url === 'https://wpbase.co.uk/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/posts/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/case-studies/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (item.url.endsWith('/blog/')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        return item;
      },
    }),
  ],
});
