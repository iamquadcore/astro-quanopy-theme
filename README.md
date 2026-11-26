# Quanopy

サイドバーと3列の記事カードを備えた、Astro 7 用のブログテーマです。

## インストール

```
npm install github:iamquadcore/astro-quanopy-theme
```

npm が `EALLOWGIT` で止まる場合は、サイト側の `.npmrc` に `allow-git=root` を書いてください。

`astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import quanopy from 'astro-quanopy-theme';

export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'always',
  integrations: [quanopy({ title: 'My Blog' })],
});
```

`src/content.config.ts`

```ts
import { defineCollection } from 'astro:content';
import { postsCollection } from 'astro-quanopy-theme/content';

export const collections = { posts: defineCollection(postsCollection()) };
```

トップ、記事、タグ、カテゴリのページはテーマが追加します。設定できる項目は `index.d.ts` を見てください。

サイドバー内のスクロールは既定でオンです。`quanopy({ sidebar: { scroll: false } })` でオフになります。

本文の1回の改行は、そのまま改行として表示します。`quanopy({ breaks: false })` で Markdown 標準の動作になります。

トップページは12件ごとにページを分けます。`quanopy({ postsPerPage: 9 })` のように変えられます。先頭の大きいカードの数は `featured` (既定: 2) です。

サイドバーのリンクは `icon` に [Font Awesome Free](https://fontawesome.com/search?ic=free) のクラスを書くとアイコンになります。`label` は読み上げとツールチップに使われます。

```js
quanopy({
  social: [{ label: 'GitHub', href: 'https://github.com/', icon: 'fa-brands fa-github' }],
})
```

### ナビ

`children` を書くとドロップダウンになります。

```js
nav: [
  { label: 'Home', href: '/' },
  { label: 'Topics', children: [{ label: 'Astro', href: '/tags/Astro/' }] },
],
```

### 背景画像

`hero` に配列を渡すとスライドショーになります。間隔は `heroInterval` (秒、既定: 7) です。

```js
hero: ['./src/assets/hero-1.jpg', './src/assets/hero-2.jpg'],
```

### 画像の最適化

背景画像・アバター・記事内やカードの画像は、ビルド時に WebP へ変換し、画面に合わせた複数のサイズ (`srcset`) を作ります。元の画像は大きいまま置いておいて構いません。背景画像の1枚目は最優先で読み込みます。記事内の画像は Astro の `image.layout: 'constrained'` を使っています。`astro.config.mjs` で `image.layout` を指定すると、そちらが優先されます。

### OGP とサイトマップ

OGP 画像は記事の `og_image`、`cover`、設定の `ogImage` の順に使います。大きさは 1200×630 を勧めます。説明文は記事の `description`、なければ書き出しです。固定ページでも `og_image` (`public/` からのパスか URL) と `description` を使えます。

`img/covers/a.jpg` と `/img/covers/a.jpg` はどちらも `public/img/covers/a.jpg` を指します。`./` や `../` で始めると記事からの相対パスになります。

```js
ogImage: '/img/ogp.jpg',
twitter: '@example',
```

ビルド時に `sitemap.xml` を作ります。`sitemap: false` でオフになります。

新着20件のフィード `atom.xml` と、サイトマップの場所を書いた `robots.txt` も作ります。それぞれ `feed: false`、`robots: false` でオフになります。`public/robots.txt` を置いた場合はそちらを使います。

### canonical (URL の正規化)

`astro.config.mjs` の `site` を基準に、各ページへ `<link rel="canonical">` と `og:url` を自動で付けます。クエリやハッシュは除き、末尾のスラッシュは `trailingSlash` (`'ignore'` のときは `build.format`) に合わせます。404 と `noindex` のページには付けません。`site` が未設定のときは canonical・`og:url`・サイトマップを出力せず、ビルド時に警告します。

### 見出しの ID

`headingIds: 'hexo'` にすると、見出しの ID が Hexo と同じ形 (大文字を保つ) になります。Hexo から移した記事の目次や、外部からの `#` 付きリンクがそのまま使えます。

### 一覧ページ

`/tags/`、`/categories/`、`/archives/` (年ごとは `/archives/2026/` など) は自動で作られます。

### Google アナリティクス

`googleAnalytics: 'G-XXXXXXXXXX'` のように測定 ID を渡すと、ビルドしたサイトで計測します。開発サーバーでは計測しません。

### 検索

ヘッダーの検索ボタンか Ctrl+K で開きます。`search: false` でオフになります。

## 固定ページ

`src/pages/` に Markdown を置き、`layout` を指定します。`404.md` も同じように作れます。

```yaml
layout: astro-quanopy-theme/layouts/Page.astro
title: About
```

## 記事

`src/content/posts/` に Markdown を置きます。`permalink` がそのまま URL になります。

```yaml
title: タイトル
date: 2026-01-01
updated: 2026-02-01 # 省略可。更新日として構造化データと OGP に使います
permalink: 2026/01/01/my-post
categories: Tech
tags: [Astro]
hidden: false # true にすると一覧、検索、サイトマップに出ず、noindex になります
```

画像は記事からの相対パスで書くと webp に変換されます。幅とクラスも指定できます。

```md
![説明|500|img-center](./my-post/image.jpg)
```

## テーマの開発

```
npm install
npm run dev
```

`playground/` のサンプルサイトが開きます。配色、レイアウト幅、背景の高さとグラデーション開始位置は `src/styles/global.css` 冒頭の変数で変えられます。

## ライセンス

[MIT](./LICENSE)

アイコンは [Lucide](https://lucide.dev/) のものです。ライセンスは [src/assets/icons/LICENSE](./src/assets/icons/LICENSE) を見てください。サイドバーなどのアイコンは [Font Awesome Free](https://fontawesome.com/license/free) (アイコン: CC BY 4.0、コード: MIT) です。ビルド時に SVG としてページに埋め込み、SVG 内の帰属表示はそのまま残しています。
