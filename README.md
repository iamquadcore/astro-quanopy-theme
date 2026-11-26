# Quanopy

サイドバーと2列の記事カードを備えた、Astro 7 用のブログテーマです。

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

ページのタイトルはテーマが h1 で出します。本文が `# 見出し` で始まる記事 (Hexo からの記事など) は h1 が2つになるので、本文に h1 があるときだけ本文の見出しを全部1段下げます (h1→h2、h2→h3 …)。ID は変わりません。`demoteHeadings: false` でオフになります。

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

### 下書きや作業中のファイル

公開しない記事や作業中のファイルは、サイトのルートに `temporary/` フォルダを作って置いておけます。Astro は `src/` と `public/` の外にあるファイルをビルドしないので、ここに置いたものはサイトに出ません。Git にも載せないように、サイト側の `.gitignore` に次の1行を足してください。

```
temporary/
```

記事を公開するときは、Markdown と画像のフォルダをまとめて `src/content/posts/` に移します。画像を記事からの相対パス (`./my-post/image.jpg`) で書いておけば、移したあともそのまま表示されます。

## テーマの開発

```
npm install
npm run dev
```

`playground/` のサンプルサイトが開きます。`npm run check` で型を検査できます。配色、レイアウト幅、背景の高さとグラデーション開始位置は `src/styles/global.css` 冒頭の変数で変えられます。

## ライセンス

[MIT](./LICENSE)

アイコンは [Lucide](https://lucide.dev/) のものです。ライセンスは [src/assets/icons/LICENSE](./src/assets/icons/LICENSE) を見てください。サイドバーなどのアイコンは [Font Awesome Free](https://fontawesome.com/license/free) (アイコン: CC BY 4.0、コード: MIT) です。ビルド時に SVG としてページに埋め込み、SVG 内の帰属表示はそのまま残しています。

## 機能一覧

見た目と多くの機能は、[Hexo Theme Async](https://github.com/MaLuns/hexo-theme-async) と、それをフォークした hexo-theme-async-q-fork をもとに Astro で作り直したものです。

### 元のテーマから引き継いだもの

Hexo Theme Async にあった機能です。仕組みは Astro に合わせて作り直しています。

- レイアウト、配色、カードのデザイン、ライトとダークの切り替え
- 背景画像とスライドショー
- ナビのドロップダウンメニュー、スマホ用のメニュー
- ページを移るときのアニメーション (元は swup。ブラウザの View Transitions で作り直し)
- サイドバーのプロフィール、SNS のアイコン、情報欄
- サイト内検索
- 記事カードの一覧とページ送り
- タグ、カテゴリ、アーカイブのページ、固定ページ (About、404 など)
- 記事の日付、時刻、著者の表示と、読了時間の目安
- 前後の記事へのリンク
- コードブロックの言語名とコピーボタン
- 画面外の画像を後から読み込む
- OGP と X (Twitter) のカード
- Google アナリティクス

hexo-theme-async-q-fork で加えた変更です。

- 記事ごとに OGP 画像を設定できる
- サイドバーにタグを表示する
- Font Awesome を 5 から 6 に更新
- すべてのページに canonical タグを付ける

### Astro 版で新しく加えたもの

テーマの形

- Astro のインテグレーションとして配布し、`quanopy({ ... })` の1か所で設定する
- テーマの確認用サイト (`playground/`) と、記事の書き方の見え方をまとめた Markdown Preview 記事

見た目と記事

- 背景のスライドショーで、ページを移っても表示中の画像を引き継ぐ
- サイドバー内をスクロールさせるかどうかを選べる
- トップの先頭は大きいカード、以降は横長のカードで並べる
- 本文から書き出しを自動で作る (目次や画像だけの節は飛ばす)
- カテゴリとタグを記事の下に表示し、一覧ページへリンクする
- 更新日 (`updated`) を投稿日と並べて表示する
- 同じタグの関連記事 (Other Articles)
- 本文の1回の改行をそのまま改行として表示し、画像まわりの余白を詰める
- 画像に幅とクラスを指定できる書き方 (`![説明|500|img-center](./image.jpg)`)

Hexo からの移行

- 見出しの ID を Hexo と同じ形にでき (`headingIds: 'hexo'`)、移行前の目次や `#` 付きリンクがそのまま使える
- 本文が `# 見出し` で始まる記事は、本文の見出しを1段下げて h1 をタイトルだけにする
- Hexo の front-matter (`permalink`、`categories`、`tags`、`banner` など) をそのまま受け付ける

表示の速さ

- Font Awesome をビルド時に SVG としてページに埋め込み、アイコンフォントと CSS (約 250KB) を読み込まない
- 背景画像、アバター、記事やカードの画像を WebP に変換し、画面に合ったサイズを選ばせる (`srcset`)
- 背景画像の1枚目を最優先で読み込み、2枚目以降は切り替える直前に読み込む
- Google アナリティクスは本番のビルドだけで読み込む

検索エンジン向け (SEO)

- canonical と `og:url` の URL を正規化する (末尾のスラッシュをそろえ、404 と noindex のページには付けない)
- 記事の OGP に公開日、更新日、タグを付ける
- 構造化データ (JSON-LD): トップに WebSite と Person、記事に BlogPosting とパンくず
- ページごとに違う description (タグやカテゴリのページは件数と新しい記事のタイトル)
- `sitemap.xml`、`atom.xml` (新着20件のフィード)、`robots.txt` をテーマだけで作る
- `hidden: true` の記事は一覧、検索、サイトマップ、フィードから外し、noindex にする
- `site` が未設定のときは、間違った URL を出さずにビルド時に警告する
