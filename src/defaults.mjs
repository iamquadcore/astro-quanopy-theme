// quanopy() に渡されなかった項目に使う初期値
export const defaults = {
  title: 'Sample Blog',
  subtitle: 'Welcome to my blog',
  description: 'A simple blog built with Astro.',
  logo: { mark: 'SB', first: 'Sample', last: 'Blog' },
  author: { name: 'Your Name', bio: 'A short introduction.' },
  // トップページ1ページあたりの記事数
  postsPerPage: 12,
  // トップの先頭で縦型カードとして大きく見せる最新記事の数
  featured: 2,
  // 本文の1回の改行をそのまま改行として表示する
  breaks: true,
  // 見出しの ID の付け方
  headingIds: 'astro',
  // サイト内検索
  search: true,
  // sitemap.xml を作る
  sitemap: true,
  // atom.xml (新着記事のフィード) を作る
  feed: true,
  // robots.txt を作る (public/robots.txt があればそちらを使う)
  robots: true,
  // 背景画像が複数のとき、切り替える間隔 (秒)
  heroInterval: 7,
  // scroll: サイドバー内をスクロールさせる
  sidebar: { scroll: true },
  // since: 著作権表示の開始年
  footer: {},
  info: [],
  nav: [{ label: 'Home', href: '/' }],
  social: [],
};
