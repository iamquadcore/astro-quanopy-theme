import { visit } from 'unist-util-visit';

const BLOCK = /^<[/]?(dev|div|p|ul|ol|li|dl|dt|dd|table|details|summary|iframe|figure|img)[^a-z0-9]/i;
const isBlock = (node) => node?.type === 'image' || (node?.type === 'html' && BLOCK.test(node.value));

// 画像やブロック要素の前後の改行は、余分な空行になるので取り除く
export default function remarkTightBlocks() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      const c = node.children;
      node.children = c.filter((n, i) => !(n.type === 'break' && (isBlock(c[i - 1]) || isBlock(c[i + 1]))));
    });
  };
}
