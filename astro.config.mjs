// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
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
  // Two self-hosted families (Fontsource packages, Latin subset, OFL). Files live in
  // src/assets/fonts/ and are copied to dist/_astro/fonts at build; licences in public/credits/.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-sans',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/bricolage-grotesque-latin-400-normal.woff2'], weight: 400, style: 'normal', display: 'swap' },
          { src: ['./src/assets/fonts/bricolage-grotesque-latin-700-normal.woff2'], weight: 700, style: 'normal', display: 'swap' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Source Serif 4',
      cssVariable: '--font-serif',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/source-serif-4-latin-400-normal.woff2'], weight: 400, style: 'normal', display: 'swap' },
          { src: ['./src/assets/fonts/source-serif-4-latin-400-italic.woff2'], weight: 400, style: 'italic', display: 'swap' },
        ],
      },
    },
  ],
});
