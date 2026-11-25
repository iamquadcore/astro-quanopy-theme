import { SKIP, visit } from 'unist-util-visit';

const names = {
  bash: 'bash', sh: 'sh', shell: 'Shell', shellscript: 'Shell', zsh: 'zsh', powershell: 'PowerShell', ps1: 'PowerShell', bat: 'Batch', cmd: 'Batch', console: 'Console',
  js: 'JavaScript', javascript: 'JavaScript', ts: 'TypeScript', typescript: 'TypeScript', jsx: 'JSX', tsx: 'TSX', node: 'Node.js',
  html: 'HTML', css: 'CSS', scss: 'SCSS', sass: 'Sass', less: 'Less', stylus: 'Stylus', vue: 'Vue', svelte: 'Svelte', astro: 'Astro', ejs: 'EJS',
  json: 'JSON', jsonc: 'JSON', yaml: 'YAML', yml: 'YAML', toml: 'TOML', ini: 'INI', xml: 'XML', csv: 'CSV', md: 'Markdown', markdown: 'Markdown', mdx: 'MDX',
  py: 'Python', python: 'Python', rb: 'Ruby', ruby: 'Ruby', go: 'Go', rs: 'Rust', rust: 'Rust', java: 'Java', kotlin: 'Kotlin', swift: 'Swift', php: 'PHP', lua: 'Lua', sql: 'SQL',
  c: 'C', cpp: 'C++', 'c++': 'C++', cs: 'C#', csharp: 'C#', glsl: 'GLSL', hlsl: 'HLSL', shaderlab: 'ShaderLab', diff: 'Diff', docker: 'Dockerfile', dockerfile: 'Dockerfile',
  plaintext: 'Text', text: 'Text', txt: 'Text',
};

const h = (tagName, className, children) => ({ type: 'element', tagName, properties: { className: [className] }, children });

// コードブロックの上に言語名の見出しを付ける
export default function rehypeCodeHeader() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      const lang = node.properties?.['data-language'] ?? node.properties?.dataLanguage;
      if (node.tagName !== 'pre' || !lang || !parent) return;
      const value = names[String(lang).toLowerCase()] ?? String(lang);
      parent.children[index] = h('div', 'code-box', [
        h('div', 'code-head', [h('span', 'code-lang', [{ type: 'text', value }])]),
        node,
      ]);
      return SKIP;
    });
  };
}
