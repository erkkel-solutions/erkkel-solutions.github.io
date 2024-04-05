import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://erkkel-solutions.github.io',
  integrations: [
    tailwind(),
    icon({
      iconDir: 'src/assets/icons',
    }),
  ],
});
