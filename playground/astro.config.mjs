// @ts-check
import { defineConfig } from 'astro/config';
import quanopy from '../index.mjs';

// テーマの動作確認用サイト
export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'always',
  integrations: [
    quanopy({
      info: [{ key: 'Profile', value: 'Your profile' }],
      nav: [
        { label: 'Home', href: '/' },
        { label: 'Tech', href: '/categories/Tech/' },
        { label: 'Design', href: '/categories/Design/' },
        { label: 'Notes', href: '/categories/Notes/' },
        { label: 'About', href: '#' },
        { label: 'Contact(JP)', href: '#' },
      ],
      social: [
        { label: 'GitHub', href: 'https://github.com/' },
        { label: 'YouTube', href: 'https://www.youtube.com/' },
      ],
    }),
  ],
});
