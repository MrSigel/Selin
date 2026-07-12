// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.selin-weikard.de',
  integrations: [
    sitemap({
      // Interner Bereich & Login niemals in die Sitemap
      filter: (page) => !/\/(crm|login)(\/|$)/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
