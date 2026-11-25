import type { glob } from 'astro/loaders';
import type { z } from 'astro/zod';
import type { ImageMetadata } from 'astro';
import type { SchemaContext } from 'astro:content';

type Strings = z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString>]>>;
type OptionalString = z.ZodOptional<z.ZodString>;

export declare const postSchema: (context: SchemaContext) => z.ZodObject<{
  title: z.ZodString;
  date: z.ZodCoercedDate;
  permalink: z.ZodString;
  tags: Strings;
  categories: Strings;
  hidden: z.ZodOptional<z.ZodBoolean>;
  cover: z.ZodOptional<z.ZodType<ImageMetadata | string>>;
  og_image: OptionalString;
  thumbnail: OptionalString;
  aliases: Strings;
  banner: z.ZodOptional<z.ZodObject<{ type: OptionalString; bgurl: OptionalString }>>;
}>;

export declare function postsCollection(options?: { base?: string }): {
  loader: ReturnType<typeof glob>;
  schema: typeof postSchema;
};
