import { visit } from 'unist-util-visit';

// ページの h1 はテーマがタイトルとして出すので、本文に h1 があるときだけ見出しを全部1段下げる
// (h1→h2、h2→h3 …。h6 はそのまま)。見出しの ID は文字から作るので変わらない
export default function rehypeDemoteHeadings() {
  return (tree) => {
    let hasH1 = false;
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h1') hasH1 = true;
    });
    if (!hasH1) return;
    visit(tree, 'element', (node) => {
      const m = /^h([1-5])$/.exec(node.tagName);
      if (m) node.tagName = `h${Number(m[1]) + 1}`;
    });
  };
}
