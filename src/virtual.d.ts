declare module 'virtual:quanopy/config' {
  type Link = { label: string; href: string };
  export const site: {
    title: string;
    subtitle: string;
    description: string;
    logo: { mark: string; first: string; last: string };
    author: { name: string; bio: string; avatar: import('astro').ImageMetadata };
    hero: import('astro').ImageMetadata[];
    heroInterval: number;
    ogImage?: string | import('astro').ImageMetadata;
    twitter?: string;
    googleAnalytics?: string;
    search: boolean;
    sitemap: boolean;
    postsPerPage: number;
    featured: number;
    breaks: boolean;
    headingIds: 'astro' | 'hexo';
    sidebar: { scroll: boolean };
    footer: { since?: number };
    info: { key: string; value: string }[];
    nav: { label: string; href?: string; children?: Link[] }[];
    social: (Link & { icon?: string })[];
  };
  /** URL の末尾スラッシュの扱い。astro.config の trailingSlash と build.format */
  /** Font Awesome の SVG があるディレクトリ */
  export const iconDir: string;
  export const urlFormat: { trailingSlash: 'always' | 'never' | 'ignore'; format: 'directory' | 'file' | 'preserve' };
}
