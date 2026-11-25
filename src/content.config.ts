import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    permalink: z.string(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    hidden: z.boolean().optional(),
    cover: z.string().optional(),
    og_image: z.string().optional(),
    thumbnail: z.string().optional(),
    aliases: z.union([z.string(), z.array(z.string())]).optional(),
    banner: z.object({ type: z.string().optional(), bgurl: z.string().optional() }).optional(),
  }),
});

export const collections = { posts };
