import { defineCollection } from 'astro:content';
import { postsCollection } from '../../content.mjs';

export const collections = { posts: defineCollection(postsCollection()) };
