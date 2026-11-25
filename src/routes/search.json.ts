import { getListedPosts, formatDate, plainText, toArray } from '../lib/posts';

// サイト内検索の索引
export async function GET() {
  const posts = await getListedPosts();
  return Response.json(posts.map(({ data, body }) => ({
    title: data.title,
    url: `/${data.permalink}/`,
    date: formatDate(data.date),
    terms: [...toArray(data.categories), ...toArray(data.tags)],
    text: plainText(body),
  })));
}
