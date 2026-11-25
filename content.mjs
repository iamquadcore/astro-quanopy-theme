import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const strings = z.union([z.string(), z.array(z.string())]).optional();

/** @param {import('astro:content').SchemaContext} context */
export const postSchema = ({ image }) =>
  z.object({
    title: z.string(),
    date: z.coerce.date(),
    permalink: z.string(),
    tags: strings,
    categories: strings,
    hidden: z.boolean().optional(),
    // './' や '../' で始まるパスは最適化する画像、それ以外は文字列のまま扱う
    cover: z.union([z.string().regex(/^\.{1,2}\//).pipe(image()), z.string()]).optional(),
    og_image: z.string().optional(),
    thumbnail: z.string().optional(),
    aliases: strings,
    banner: z.object({ type: z.string().optional(), bgurl: z.string().optional() }).optional(),
  });

// defineCollection() に渡す記事コレクションの定義
export const postsCollection = ({ base = './src/content/posts' } = {}) => ({
  loader: glob({ pattern: '**/*.md', base }),
  schema: postSchema,
});
