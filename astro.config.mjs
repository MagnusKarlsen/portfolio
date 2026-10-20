import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { base, origin } from './config/site.mjs';
import rehypeBaseUrls from './scripts/rehype-base-urls.mjs';

export default defineConfig({
  output: 'static',
  site: origin || undefined,
  base,
  trailingSlash: 'always',
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    server: { watch: { ignored: ['**/.tools/**', '**/.qa/**'] } },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { throwOnError: true, strict: 'error' }], rehypeBaseUrls],
    }),
  },
});
