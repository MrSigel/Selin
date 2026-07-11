import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const wissen = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/wissen" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    pubDate: z.coerce.date(),
    readingTime: z.string().optional(),
    imageLabel: z.string().optional(),
  }),
});

export const collections = { wissen };
