import { visit } from 'unist-util-visit';

// 見出しの文字列を Hexo と同じ形の ID にする。大文字を保ち、半角の記号と空白を - にまとめる
export const hexoSlug = (text) =>
  text
    .trim()
    // Hexo では &nbsp; が文字のまま ID に残る
    .replace(/\u00a0/g, '-nbsp-')
    // アクセント記号などを外す(é -> e)。かなの濁点は外さない
    .replace(/\p{Script=Latin}\p{Mn}*/gu, (c) => c.normalize('NFKD').replace(/\p{M}/gu, ''))
    .replace(/[\u0000-\u001f]/g, '')
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g, '-')
    .replace(/^-+|-+$/g, '');

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

// Astro が ID を付ける前に付ける(付いている ID は Astro が上書きしない)
export default function rehypeHexoHeadingIds() {
  return (tree) => {
    const seen = new Map();
    visit(tree, 'element', (node) => {
      if (!/^h[1-6]$/.test(node.tagName) || node.properties.id) return;
      const id = hexoSlug(textOf(node));
      if (!id) return;
      const n = seen.get(id) ?? 0;
      seen.set(id, n + 1);
      node.properties.id = n ? `${id}-${n}` : id;
    });
  };
}
