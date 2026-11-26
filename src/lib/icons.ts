import { readFileSync } from 'node:fs';
import { iconDir } from 'virtual:quanopy/config';

// Font Awesome のクラス指定のうち、スタイルを表すもの
const styles: Record<string, string> = {
  'fa-solid': 'solid', fas: 'solid',
  'fa-regular': 'regular', far: 'regular',
  'fa-brands': 'brands', fab: 'brands',
};
const cache = new Map<string, string | undefined>();

/**
 * Font Awesome のクラス (例: 'fa-brands fa-github') を、ビルド時にインライン SVG へ変換する。
 * アイコンフォントと CSS を読み込まずに済むので、ページが軽くなる。
 * SVG 内のライセンス表記 (CC BY 4.0 の帰属表示) はそのまま残す。
 * 見つからなければ undefined
 */
export function faIcon(cls: string): string | undefined {
  if (cache.has(cls)) return cache.get(cls);
  let style = 'solid';
  let name: string | undefined;
  for (const c of cls.trim().split(/\s+/)) {
    if (styles[c]) style = styles[c];
    else if (c.startsWith('fa-')) name = c.slice(3);
  }
  let svg: string | undefined;
  if (name && /^[a-z0-9-]+$/.test(name)) {
    try {
      const raw = readFileSync(`${iconDir}/${style}/${name}.svg`, 'utf8').trim();
      const [, w = '1', h = '1'] = raw.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) ?? [];
      // 高さは文字に合わせて 1em、幅はアイコンの縦横比から決める
      const width = +(Number(w) / Number(h)).toFixed(4);
      svg = raw.replace('<svg ', `<svg class="icon" style="width:${width}em" aria-hidden="true" focusable="false" `);
    } catch {}
  }
  if (!svg) console.warn(`[astro-quanopy-theme] Font Awesome のアイコンが見つかりません: ${cls}`);
  cache.set(cls, svg);
  return svg;
}
