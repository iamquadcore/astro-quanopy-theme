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

## 記事

`src/content/posts/` に Markdown を置きます。`permalink` がそのまま URL になります。

```yaml
title: タイトル
date: 2026-01-01
permalink: 2026/01/01/my-post
categories: Tech
tags: [Astro]
hidden: false # true にすると一覧に出ません
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

アイコンは [Lucide](https://lucide.dev/) のものです。ライセンスは [src/assets/icons/LICENSE](./src/assets/icons/LICENSE) を見てください。
