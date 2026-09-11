// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://edward-vj.github.io',
  // User site (<user>.github.io): no `base`.
  trailingSlash: 'always',
  integrations: [sitemap()],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
