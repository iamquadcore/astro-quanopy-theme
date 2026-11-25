// サイト固有の値はすべてここで変更する
import avatar from './assets/avatar.svg';
import hero from './assets/hero.svg';

export const site = {
  title: 'Sample Blog',
  subtitle: 'Welcome to my blog',
  description: 'A simple blog built with Astro.',
  logo: { mark: 'SB', first: 'Sample', last: 'Blog' },
  hero,
  author: { name: 'Your Name', bio: 'A short introduction.', avatar },
  info: [{ key: 'Profile', value: 'Your profile' }],
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Tech', href: '/categories/Tech/' },
    { label: 'Design', href: '/categories/Design/' },
    { label: 'Notes', href: '/categories/Notes/' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'YouTube', href: 'https://www.youtube.com/' },
  ],
};
