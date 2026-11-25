---
title: Markdown の表示テスト
date: 2026-01-25
permalink: 2026/01/25/sample/markdown-preview
description: 見出し、コードブロック、注釈、表など、記事で使う書き方の見え方をまとめた確認用の記事です。
categories: Tech
tags: [Astro, CSS, JavaScript]
cover: ./markdown-preview/cover.jpg
---
# Markdown の表示テスト

見出し、コードブロック、注釈、表など、記事で使う書き方の見え方をまとめた確認用の記事です。

- [文字の装飾](#文字の装飾)
- [見出し](#見出し)
- [リスト](#リスト)
- [引用](#引用)
- [コードブロック](#コードブロック)
  - [JavaScript の例](#JavaScript-の例)
  - [HTML / CSS の例](#HTML-CSS-の例)
- [注釈](#注釈)
- [表](#表)
- [画像](#画像)
- [折りたたみ](#折りたたみ)
- [埋め込み](#埋め込み)
- [その他](#その他)

## 文字の装飾

通常の文章に、**太字**、*斜体*、***太字の斜体***、~~打ち消し線~~、`インラインコード` を混ぜた例です。
この行は改行1回で書いています。リンクは[サイト内](/about/)と[外部サイト](https://docs.astro.build/)、URL だけの https://astro.build/ があります。

<kbd>Ctrl</kbd> + <kbd>K</kbd>、<mark>マーカー</mark>、H<sub>2</sub>O、x<sup>2</sup>、<u>下線</u>、<font color="#ff9d5c">色付きの文字</font>。

長い英単語の折り返し: `averyveryveryveryveryveryveryveryveryveryveryveryveryverylongidentifiername_without_any_spaces`

## 見出し

### 見出し3

本文が続きます。

#### 見出し4

本文が続きます。

##### 見出し5

本文が続きます。

###### 見出し6

本文が続きます。

## リスト

- 項目
- 長い項目は折り返したときに行頭が揃うかを確認します。文章が続いて2行目に入っても、記号の下に文字が回り込まないのが正しい表示です。
  - 入れ子の項目
    - さらに入れ子の項目

1. 手順1
2. 手順2
   1. 手順2の1
   2. 手順2の2
3. 手順3

- [x] 終わった作業
- [ ] まだの作業

## 引用

> 引用文です。
> 2行目です。
>
> > 入れ子の引用です。

## コードブロック

言語を指定しない場合:

```
plain text
  indented text
```

### JavaScript の例

```js
// 記事を新しい順に並べる
export async function getPosts(limit = 10) {
  const posts = await load('posts');
  return posts
    .filter((post) => !post.hidden)
    .sort((a, b) => b.date - a.date)
    .slice(0, limit);
}
```

### HTML / CSS の例

```html
<article class="card">
  <h2>Title</h2>
  <p>Hello, <strong>world</strong>!</p>
</article>
```

```css
.card {
  padding: 16px;
  border-radius: 10px;
  background: #487448;
}
```

### そのほかの言語

```bash
npm install
npm run dev
```

```yaml
title: Sample
tags: [Astro, CSS]
```

```diff
- const color = 'red';
+ const color = 'green';
```

### 横に長いコード

```js
const message = 'とても長い1行です。横にスクロールできるか、ページ全体が横に広がらないかを確認するために、あえて改行せずに書いています。' + new Date().toISOString() + ' / end of line';
```

## 注釈

文章の途中に注釈を付けられます[^1]。複数付けることも[^note]、同じ注釈をもう一度参照することもできます[^1]。

[^1]: 1つ目の注釈です。番号を押すとここへ移動し、矢印で本文へ戻ります。
[^note]: 2つ目の注釈です。`コード` や[リンク](https://docs.astro.build/)も書けます。

## 表

| 左寄せ | 中央 | 右寄せ |
| :--- | :---: | ---: |
| りんご | 赤 | 120 |
| バナナ | 黄 | 80 |
| **ぶどう** | 紫 | `300` |

列の多い表:

| 項目 | 1月 | 2月 | 3月 | 4月 | 5月 | 6月 | 7月 | 8月 | 9月 | 10月 | 11月 | 12月 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 記事数 | 12 | 8 | 15 | 9 | 11 | 7 | 10 | 14 | 6 | 13 | 5 | 16 |
| 閲覧数 | 1,200 | 980 | 1,540 | 1,010 | 1,130 | 890 | 1,060 | 1,420 | 760 | 1,310 | 690 | 1,680 |

## 画像

幅の指定なし:

![山の風景のイラスト](./markdown-preview/image.jpg)

幅360px、左寄せ:

![左寄せの画像|360|img-left](./markdown-preview/image.jpg)

幅360px、中央寄せ:

![中央寄せの画像|360|img-center](./markdown-preview/image.jpg)

幅360px、右寄せ:

![右寄せの画像|360|img-right](./markdown-preview/image.jpg)

## 折りたたみ

<details>
<summary>クリックで開きます</summary>

折りたたみの中身です。

```js
console.log('Hello');
```

</details>

## 埋め込み

<iframe width="560" height="315" title="埋め込みの例" srcdoc="<body style='display:grid;place-items:center;height:100vh;margin:0;font-family:sans-serif;background:#92ce60'>iframe 560 x 315</body>"></iframe>

## その他

水平線:

---

絵文字: 🌱 🎨 🚀

エスケープ: \*アスタリスク\*、\# シャープ
