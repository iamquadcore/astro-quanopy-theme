import type { AstroIntegration } from 'astro';

interface Link { label: string; href: string }

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
  sidebar?: {
    /** サイドバーを画面内に収め、あふれた分をスクロールバーで見せる (既定: true) */
    scroll?: boolean;
  };
  footer?: {
    /** 著作権表示の開始年。省略すると今年だけを表示する */
    since?: number;
  };
  info?: { key: string; value: string }[];
  nav?: Link[];
  social?: SocialLink[];
  /** 背景画像。サイトのルートからのパス (例: './src/assets/hero.jpg') */
  hero?: string;
  /** アバター画像。サイトのルートからのパス */
  avatar?: string;
}

export default function quanopy(options?: QuanopyOptions): AstroIntegration;
