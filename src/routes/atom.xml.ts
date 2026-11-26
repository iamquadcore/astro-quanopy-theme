import type { APIContext } from 'astro';
import { site } from 'virtual:quanopy/config';
import { excerpt, getListedPosts, toArray } from '../lib/posts';

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

// 新しい記事の Atom フィード。本文は載せず、要約と記事への URL を載せる
export async function GET({ site: origin }: APIContext) {
  const home = new URL(import.meta.env.BASE_URL, origin);
  const self = new URL('atom.xml', home).href;
  const posts = (await getListedPosts()).slice(0, 20);
  const time = (d: Date) => d.toISOString();
  const updated = posts.reduce((t, p) => Math.max(t, (p.data.updated ?? p.data.date).valueOf()), 0);

  const entries = posts.map(({ data, body }) => {
    const url = new URL(`${data.permalink}/`, home).href;
    const summary = data.description || excerpt(body, 200);
    return [
      '  <entry>',
      `    <title>${esc(data.title)}</title>`,
      `    <link href="${esc(url)}"/>`,
      `    <id>${esc(url)}</id>`,
      `    <published>${time(data.date)}</published>`,
      `    <updated>${time(data.updated ?? data.date)}</updated>`,
      ...(summary ? [`    <summary>${esc(summary)}</summary>`] : []),
      ...[...toArray(data.categories), ...toArray(data.tags)].map((t) => `    <category term="${esc(t)}"/>`),
      '  </entry>',
    ].join('\n');
  });

  const xml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="ja">',
    `  <title>${esc(site.title)}</title>`,
    `  <subtitle>${esc(site.description)}</subtitle>`,
    `  <link href="${esc(self)}" rel="self" type="application/atom+xml"/>`,
    `  <link href="${esc(home.href)}"/>`,
    `  <id>${esc(home.href)}</id>`,
    `  <updated>${time(new Date(updated || Date.now()))}</updated>`,
    `  <author><name>${esc(site.author.name)}</name><uri>${esc(home.href)}</uri></author>`,
    ...entries,
    '</feed>',
    '',
  ].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
}
