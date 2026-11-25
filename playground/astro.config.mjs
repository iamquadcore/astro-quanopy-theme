// @ts-check
import { defineConfig } from 'astro/config';
import quanopy from '../index.mjs';

// テーマの動作確認用サイト
export default defineConfig({
  // 公開して OGP を確かめるときは、環境変数 SITE に公開先の URL を渡す
  site: process.env.SITE || 'https://example.com',
  trailingSlash: 'always',
  integrations: [
    quanopy({
      ogImage: '/img/ogp.jpg',
      hero: ['./src/assets/hero-1.svg', './src/assets/hero-2.svg'],
      info: [{ key: 'Profile', value: 'Your profile' }],
      nav: [
        { label: 'Home', children: [{ label: 'Top', href: '/' }, { label: 'Categories', href: '/categories/' }, { label: 'Tags', href: '/tags/' }] },
        { label: 'Topics', children: [{ label: 'Astro', href: '/tags/Astro/' }, { label: 'CSS', href: '/tags/CSS/' }, { label: 'JavaScript', href: '/tags/JavaScript/' }] },
        { label: 'Tech', href: '/categories/Tech/' },
        { label: 'Design', href: '/categories/Design/' },
        { label: 'Notes', href: '/categories/Notes/' },
        { label: 'About', href: '/about/' },
        { label: 'Contact(JP)', href: '#' },
      ],
      social: [
        { label: 'GitHub', href: 'https://github.com/', icon: 'fa-brands fa-github' },
        { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'fa-brands fa-youtube' },
      ],
    }),
  ],
});
