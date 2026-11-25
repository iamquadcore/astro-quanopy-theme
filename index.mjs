// @ts-check
import { fileURLToPath } from 'node:url';
import { unified } from '@astrojs/markdown-remark';
import remarkBreaks from 'remark-breaks';
import { defaults } from './src/defaults.mjs';
import remarkImgAttrs from './src/plugins/remark-img-attrs.mjs';
import remarkTightBlocks from './src/plugins/remark-tight-blocks.mjs';

const VIRTUAL_ID = 'virtual:quanopy/config';
const toPath = (/** @type {URL} */ url) => fileURLToPath(url).replaceAll('\\', '/');
const here = (/** @type {string} */ p) => new URL(p, import.meta.url);

/**
 * @param {import('./index').QuanopyOptions} [options]
 * @returns {import('astro').AstroIntegration}
 */
export default function quanopy(options = {}) {
  const { hero, avatar, ...rest } = options;
  const site = {
    ...defaults,
    ...rest,
    logo: { ...defaults.logo, ...rest.logo },
    author: { ...defaults.author, ...rest.author },
    footer: { ...defaults.footer, ...rest.footer },
    sidebar: { ...defaults.sidebar, ...rest.sidebar },
  };

  return {
    name: 'astro-quanopy-theme',
    hooks: {
      'astro:config:setup': ({ config, injectRoute, updateConfig }) => {
        // 画像パスはサイトのルート基準。省略時はテーマ同梱の画像を使う
        const image = (/** @type {string | undefined} */ p, /** @type {string} */ fallback) =>
          JSON.stringify(toPath(p ? new URL(p, config.root) : here(fallback)));
        const code = [
          `import hero from ${image(hero, './src/assets/hero.svg')};`,
          `import avatar from ${image(avatar, './src/assets/avatar.svg')};`,
          `const site = ${JSON.stringify(site)};`,
          'site.hero = hero;',
          'site.author.avatar = avatar;',
          'export { site };',
        ].join('\n');

        for (const [pattern, file] of [
          ['/', 'index.astro'],
          ['/page/[page]', 'page/[page].astro'],
          ['/tags/[tag]', 'tags/[tag].astro'],
          ['/categories/[category]', 'categories/[category].astro'],
          ['/[...slug]', '[...slug].astro'],
        ]) {
          injectRoute({ pattern, entrypoint: here(`./src/routes/${file}`) });
        }

        updateConfig({
          markdown: { processor: unified({ remarkPlugins: site.breaks ? [remarkBreaks, remarkTightBlocks, remarkImgAttrs] : [remarkImgAttrs] }) },
          vite: {
            plugins: [
              {
                name: 'quanopy-config',
                resolveId: (/** @type {string} */ id) => (id === VIRTUAL_ID ? '\0' + VIRTUAL_ID : undefined),
                load: (/** @type {string} */ id) => (id === '\0' + VIRTUAL_ID ? code : undefined),
              },
            ],
            resolve: { dedupe: ['astro'] },
            ssr: { noExternal: ['astro-quanopy-theme'] },
            server: { fs: { allow: [toPath(config.root), toPath(here('./'))] } },
          },
        });
      },
    },
  };
}
