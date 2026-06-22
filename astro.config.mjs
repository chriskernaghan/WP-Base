import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wpbase.co.uk',
  integrations: [
    mdx(),
    sitemap({
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
