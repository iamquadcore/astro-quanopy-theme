import type { glob } from 'astro/loaders';
import type { z } from 'astro/zod';
import type { ImageMetadata } from 'astro';
import type { SchemaContext } from 'astro:content';

type Strings = z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString>]>>;
type Picture = z.ZodOptional<z.ZodNullable<z.ZodType<ImageMetadata | string>>>;
type OptionalString = z.ZodOptional<z.ZodString>;

export declare const postSchema: (context: SchemaContext) => z.ZodObject<{
  title: z.ZodString;
  date: z.ZodCoercedDate;
  permalink: z.ZodString;
  tags: Strings;
  categories: Strings;
  hidden: z.ZodOptional<z.ZodBoolean>;
  description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  cover: Picture;
  og_image: Picture;
  thumbnail: OptionalString;
  aliases: Strings;
  banner: z.ZodOptional<z.ZodNullable<z.ZodObject<{ type: OptionalString; bgurl: OptionalString }>>>;
}>;

export declare function postsCollection(options?: { base?: string }): {
  loader: ReturnType<typeof glob>;
  schema: typeof postSchema;
};
