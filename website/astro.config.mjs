// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.selin-weikard.de',
  integrations: [
    sitemap({
      // Interner Bereich, Login & die clientseitige Beitrag-Hülle nicht in die Sitemap
      filter: (page) => !/\/(crm|login)(\/|$)/.test(page) && !/\/wissen\/beitrag/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
