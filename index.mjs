// @ts-check
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unified } from '@astrojs/markdown-remark';
import remarkBreaks from 'remark-breaks';
import { defaults } from './src/defaults.mjs';
import rehypeCodeHeader from './src/plugins/rehype-code-header.mjs';
import rehypeDemoteHeadings from './src/plugins/rehype-demote-headings.mjs';
import rehypeHexoHeadingIds from './src/plugins/rehype-hexo-heading-ids.mjs';
import remarkImgAttrs from './src/plugins/remark-img-attrs.mjs';
import remarkTightBlocks from './src/plugins/remark-tight-blocks.mjs';

const VIRTUAL_ID = 'virtual:quanopy/config';
const toPath = (/** @type {URL} */ url) => fileURLToPath(url).replaceAll('\\', '/');
const here = (/** @type {string} */ p) => new URL(p, import.meta.url);
// Font Awesome の SVG の置き場所。ビルド時に読み込んでインライン SVG にする
const iconDir = dirname(createRequire(import.meta.url).resolve('@fortawesome/fontawesome-free/package.json')).replaceAll('\\', '/') + '/svgs';

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
  let base = '/';

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
          `const urlFormat = ${JSON.stringify({ trailingSlash: config.trailingSlash, format: config.build.format })};`,
          `const iconDir = ${JSON.stringify(iconDir)};`,
          'export { site, urlFormat, iconDir };',
        ].join('\n');

        for (const [pattern, file] of [
          ['/', 'index.astro'],
          ['/page/[page]', 'page/[page].astro'],
          ['/tags', 'tags/index.astro'],
          ['/categories', 'categories/index.astro'],
          ['/archives', 'archives/index.astro'],
          ['/archives/[year]', 'archives/[year].astro'],
          ...(site.search ? [['/search.json', 'search.json.ts']] : []),
          // フィードの URL は絶対 URL なので、site がないと作れない
          ...(site.feed && config.site ? [['/atom.xml', 'atom.xml.ts']] : []),
          ['/tags/[tag]', 'tags/[tag].astro'],
          ['/categories/[category]', 'categories/[category].astro'],
          ['/[...slug]', '[...slug].astro'],
        ]) {
          injectRoute({ pattern, entrypoint: here(`./src/routes/${file}`) });
        }

        updateConfig({
          // 記事内やカードの画像に srcset を付け、画面に合った大きさを選ばせる。サイト側の設定があればそちらを優先する
          ...(config.image.layout ? {} : { image: { layout: 'constrained', responsiveStyles: config.image.responsiveStyles ?? true } }),
          markdown: { processor: unified({ remarkRehype: { footnoteLabel: '注釈', footnoteBackLabel: '本文に戻る' }, remarkPlugins: site.breaks ? [remarkBreaks, remarkTightBlocks, remarkImgAttrs] : [remarkImgAttrs], rehypePlugins: [rehypeCodeHeader, ...(site.headingIds === 'hexo' ? [rehypeHexoHeadingIds] : []), ...(site.demoteHeadings ? [rehypeDemoteHeadings] : [])] }) },
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
      'astro:config:done': ({ config, logger }) => {
        siteUrl = config.site;
        base = config.base;
        if (!siteUrl) logger.warn('astro.config に site (公開先の URL) が未設定のため、canonical と og:url を出力しません');
      },
      // サイトマップ。404、2ページ目以降の一覧、noindex のページは載せない
      'astro:build:done': async ({ dir, pages, logger }) => {
        // robots.txt。public/robots.txt を置いていればそれを優先する
        const robots = new URL('robots.txt', dir);
        const sitemapUrl = site.sitemap && siteUrl ? new URL(base.replace(/^\/?/, '/').replace(/\/?$/, '/') + 'sitemap.xml', siteUrl).href : undefined;
        if (site.robots && !(await readFile(robots).then(() => true, () => false))) {
          await writeFile(robots, ['User-agent: *', 'Allow: /', ...(sitemapUrl ? ['', `Sitemap: ${sitemapUrl}`] : []), ''].join('\n'));
          logger.info('robots.txt');
        }

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
