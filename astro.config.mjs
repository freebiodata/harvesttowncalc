// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ---------------------------------------------------------------------------
// CHANGE BEFORE DEPLOYING: set this to the real production domain.
// It drives canonical URLs, the XML sitemap and JSON-LD URLs.
// ---------------------------------------------------------------------------
export const SITE_URL = 'https://harvesttowncalc.top';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
