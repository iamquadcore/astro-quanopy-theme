# Quanopy

サイドバーと3列の記事カードを備えた、Astro 7 用のブログテーマです。

## 使い方

```
npm install
npm run dev
```

## 設定

- サイト名、プロフィール、ナビ、リンク: `src/site.config.ts`
- 公開URL: `astro.config.mjs` の `site`
- 配色、レイアウト幅、背景の高さとグラデーション開始位置: `src/styles/global.css` 冒頭の変数
- 背景画像、アバター: `src/assets/`

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

## ライセンス

[MIT](./LICENSE)
