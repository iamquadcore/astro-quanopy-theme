import { urlFormat } from 'virtual:quanopy/config';

/**
 * astro.config の site を基準に、ページの正規 URL を作る。
 * - クエリやハッシュは付けない
 * - 連続したスラッシュや末尾の index.html を取り除く
 * - 末尾のスラッシュは trailingSlash (ignore のときは build.format) に合わせる
 * site が未設定なら正しいドメインが分からないので undefined を返す
 */
export function canonicalUrl(pathname: string, site: URL | undefined): URL | undefined {
  if (!site) return undefined;
  let path = decodeURI(pathname).replace(/\/{2,}/g, '/').replace(/\/index\.html?$/, '/');
  const isFile = /\.[a-z0-9]+$/i.test(path);
  if (!isFile && path !== '/') {
    const slash =
      urlFormat.trailingSlash === 'always' ||
      (urlFormat.trailingSlash === 'ignore' && urlFormat.format !== 'file');
    path = path.replace(/\/+$/, '') + (slash ? '/' : '');
  }
  return new URL(encodeURI(path), site);
}
