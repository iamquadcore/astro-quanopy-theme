declare module 'virtual:quanopy/config' {
  type Link = { label: string; href: string };
  export const site: {
    title: string;
    subtitle: string;
    description: string;
    logo: { mark: string; first: string; last: string };
    author: { name: string; bio: string; avatar: import('astro').ImageMetadata };
    hero: import('astro').ImageMetadata;
    postsPerPage: number;
    featured: number;
    breaks: boolean;
    sidebar: { scroll: boolean };
    footer: { since?: number };
    info: { key: string; value: string }[];
    nav: Link[];
    social: Link[];
  };
}
