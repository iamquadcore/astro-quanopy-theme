import { visit } from 'unist-util-visit';

// ![alt|width|class](src) -> alt / width / class を img に付与する。
export default function remarkImgAttrs() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      const [alt, width, cls] = (node.alt ?? '').split('|');
      node.alt = alt;
      node.data ??= {};
      node.data.hProperties ??= {};
      if (width) node.data.hProperties.width = Number(width);
      if (cls) node.data.hProperties.class = cls;
    });
  };
}
