// @ts-check
import { readFile, writeFile } from 'node:fs/promises';
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
  const ogFile = rest.ogImage?.startsWith('./') ? rest.ogImage : undefined;
  /** @type {string | undefined} */
  let siteUrl;

  return {
    name: 'astro-quanopy-theme',
    hooks: {
      'astro:config:setup': ({ config, injectRoute, updateConfig }) => {
        // 画像パスはサイトのルート基準。省略時はテーマ同梱の画像を使う
        const image = (/** @type {string | undefined} */ p, /** @type {string} */ fallback) =>
          JSON.stringify(toPath(p ? new URL(p, config.root) : here(fallback)));
        const heroes = [hero].flat();
        if (heroes.length === 0) heroes.push(undefined);
        const code = [
          ...heroes.map((p, i) => `import hero${i} from ${image(p, './src/assets/hero.svg')};`),
          // './' で始まる ogImage は画像として読み込み、それ以外は public/ からのパスか URL のまま使う
          ...(ogFile ? [`import ogImage from ${image(ogFile, '')};`] : []),
          `import avatar from ${image(avatar, './src/assets/avatar.svg')};`,
          `const site = ${JSON.stringify(site)};`,
          `site.hero = [${heroes.map((_, i) => `hero${i}`).join(', ')}];`,
          ...(ogFile ? ['site.ogImage = ogImage;'] : []),
          'site.author.avatar = avatar;',
          'export { site };',
        ].join('\n');

        for (const [pattern, file] of [
          ['/', 'index.astro'],
          ['/page/[page]', 'page/[page].astro'],
          ['/tags', 'tags/index.astro'],
          ['/categories', 'categories/index.astro'],
          ...(site.search ? [['/search.json', 'search.json.ts']] : []),
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
      'astro:config:done': ({ config }) => {
        siteUrl = config.site;
      },
      // サイトマップ。404、2ページ目以降の一覧、noindex のページは載せない
      'astro:build:done': async ({ dir, pages, logger }) => {
        if (!site.sitemap) return;
        if (!siteUrl) return logger.warn('site が未設定のため sitemap.xml を作りません');
        const urls = [];
        for (const { pathname } of pages) {
          if (/^404\/?$|^page\/\d+\/?$/.test(pathname)) continue;
          const file = new URL(pathname === '' || pathname.endsWith('/') ? `${pathname}index.html` : `${pathname}.html`, dir);
          const html = await readFile(file, 'utf8').catch(() => '');
          if (/<meta name="robots" content="noindex"/.test(html)) continue;
          urls.push(new URL(pathname, siteUrl).href.replaceAll('&', '&amp;'));
        }
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls.sort().map((u) => `  <url><loc>${u}</loc></url>`),
          '</urlset>',
          '',
        ].join('\n');
        await writeFile(new URL('sitemap.xml', dir), xml);
        logger.info(`sitemap.xml (${urls.length} URL)`);
      },
    },
  };
}
