// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkImgAttrs from './src/plugins/remark-img-attrs.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    processor: unified({ remarkPlugins: [remarkImgAttrs] }),
  },
});
