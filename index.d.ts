import type { AstroIntegration } from 'astro';

interface Link { label: string; href: string }

interface NavLink {
  label: string;
  /** children があるときは省略できる */
  href?: string;
  /** ドロップダウンに並べるリンク */
  children?: Link[];
}

interface SocialLink extends Link {
  /** Font Awesome のクラス (例: 'fa-brands fa-github')。省略すると label を文字で表示する */
  icon?: string;
}

export interface QuanopyOptions {
  title?: string;
  subtitle?: string;
  description?: string;
  logo?: { mark?: string; first?: string; last?: string };
  author?: { name?: string; bio?: string };
  /** トップページ1ページあたりの記事数 (既定: 12) */
  postsPerPage?: number;
  /** トップの先頭で大きく見せる最新記事の数。0 で無効 (既定: 2) */
  featured?: number;
  /** 本文の1回の改行をそのまま改行として表示する (既定: true) */
  breaks?: boolean;
  /** 見出しの ID の付け方。'hexo' にすると Hexo と同じ ID になり、移行前の目次やリンクがそのまま使える (既定: 'astro') */
  headingIds?: 'astro' | 'hexo';
  sidebar?: {
    /** サイドバーを画面内に収め、あふれた分をスクロールバーで見せる (既定: true) */
    scroll?: boolean;
  };
  footer?: {
    /** 著作権表示の開始年。省略すると今年だけを表示する */
    since?: number;
  };
  info?: { key: string; value: string }[];
  nav?: NavLink[];
  social?: SocialLink[];
  /** 背景画像。サイトのルートからのパス (例: './src/assets/hero.jpg')。配列で複数渡すとスライドショーになる */
  hero?: string | string[];
  /** 背景画像が複数のとき、切り替える間隔の秒数 (既定: 7) */
  heroInterval?: number;
  /** 記事に画像がないときの OGP 画像 (推奨: 1200×630)。'./' で始めるとサイトのルートから、'/img/ogp.jpg' などは public/ からのパスか URL */
  ogImage?: string;
  /** X (Twitter) のユーザー名 (例: '@example')。カードの twitter:site と twitter:creator に使う */
  twitter?: string;
  /** サイト内検索 (既定: true) */
  search?: boolean;
  /** ビルド時に sitemap.xml を作る (既定: true) */
  sitemap?: boolean;
  /** アバター画像。サイトのルートからのパス */
  avatar?: string;
}

export default function quanopy(options?: QuanopyOptions): AstroIntegration;
