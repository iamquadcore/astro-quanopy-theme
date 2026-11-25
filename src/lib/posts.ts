import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// hidden: true の記事は一覧に出さない(URL では開ける)
export async function getListedPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.hidden);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// 同じタグを1つでも持つ記事を新しい順に返す(自分自身は除く)
export async function getRelatedPosts(post: Post, max = 2) {
  const tags = toArray(post.data.tags);
  const posts = await getListedPosts();
  return posts.filter((p) => p.id !== post.id && toArray(p.data.tags).some((t) => tags.includes(t))).slice(0, max);
}

export const pageCount = (total: number, per: number) => Math.max(1, Math.ceil(total / per));

export const toArray = (v?: string | string[]) =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];
export const toSlug = (s: string) => s.trim().replace(/[\s_]+/g, '-');

export function countBy(posts: Post[], key: 'tags' | 'categories') {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const v of toArray(p.data[key])) map.set(v, (map.get(v) ?? 0) + 1);
  }
  return [...map].sort(([a], [b]) => a.localeCompare(b));
}

export type OgImage = { src: string; width: number; height: number };

// 年ごとに分ける。並びは渡された順のまま
export function byYear(posts: Post[]): [year: string, posts: Post[]][] {
  const map = new Map<string, Post[]>();
  for (const p of posts) {
    const year = String(p.data.date.getUTCFullYear());
    map.set(year, [...(map.get(year) ?? []), p]);
  }
  return [...map];
}

// public/ からのパスか URL。img/a.jpg は /img/a.jpg として扱う
export const asUrl = (v: string) => (/^(https?:)?\//.test(v) ? v : '/' + v);
// 大きさの分からない画像は 1200×630 とみなす
export const asOgImage = (v: string | ImageMetadata): OgImage =>
  typeof v === 'string' ? { src: asUrl(v), width: 1200, height: 630 } : v;

// OGP 画像の URL。og_image、cover の順に使う
export async function ogImage({ data: { og_image, cover } }: Post): Promise<OgImage | undefined> {
  const img = og_image || cover;
  if (!img) return undefined;
  if (typeof img === 'string') return asOgImage(img);
  if (img.format === 'svg') return undefined;
  const width = Math.min(1200, img.width);
  const height = Math.round((img.height * width) / img.width);
  return { src: (await getImage({ src: img, width, height, format: 'jpeg' })).src, width, height };
}

// Markdown 本文から見出し・目次・画像・記号を除いた地の文を取り出す
export function plainText(body = '') {
  return body
    .replace(/^[ \t]*`{3}[^`\n]*\n[\s\S]*?^[ \t]*`{3}/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/^\s*[-*+]\s+(目次|\[[^\]]*\]\(#[^)]*\))\s*$/gm, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s.*$/gm, ' ')
    .replace(/[*`~>]/g, '')
    .replace(/[\s　]+/g, ' ')
    .trim();
}

// 一覧用の書き出し。先頭の見出しを飛ばし、次の見出しの手前まで。
// 導入文がない(目次や画像だけの)記事は、次に文章のある節を使う
export function excerpt(body = '', max = 160) {
  const sections = body.replace(/^[ \t]*`{3}[^`\n]*\n[\s\S]*?^[ \t]*`{3}/gm, ' ').split(/^#{1,6}\s.*$/m);
  for (const section of sections) {
    const text = plainText(section);
    if (text) return text.slice(0, max);
  }
  return '';
}

const pad = (n: number) => String(n).padStart(2, '0');
// front-matter の日付は UTC として読まれるため、UTC で出せば書いた日付のまま表示される
export const formatDate = (d: Date) =>
  [d.getUTCFullYear() % 100, d.getUTCMonth() + 1, d.getUTCDate()].map(pad).join('/');
export const formatTime = (d: Date) => [d.getUTCHours(), d.getUTCMinutes()].map(pad).join(':');
