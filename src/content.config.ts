import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const optionalText = z.preprocess(
  (value) => value === '' || value === null ? undefined : value,
  z.string().trim().min(1).optional(),
);

const assetPath = z.string().trim().min(1).refine(
  (value) => /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value),
  'Use a public/ path such as /images/my-project/photo.webp, or a full http(s) URL.',
);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: process.env.PORTFOLIO_PROJECTS_DIR ?? './src/content/projects' }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    date: z.preprocess(
      (value) => value === '' || value === null ? undefined : value,
      z.iso.date().optional(),
    ),
    status: z.enum(['Not specified', 'Planned', 'In progress', 'Completed', 'On hold']).default('Not specified'),
    tags: z.array(z.string().trim().min(1)).default([]),
    draft: z.boolean().default(true),
    example: z.boolean().default(false),
    cover: z.preprocess((value) => value === '' || value === null ? undefined : value, assetPath.optional()),
    coverAlt: optionalText,
    coverCaption: optionalText,
    links: z.array(z.object({
      label: z.string().trim().min(1),
      url: assetPath,
    })).default([]),
  }).superRefine((data, context) => {
    if (data.cover && !data.coverAlt) {
      context.addIssue({ code: 'custom', path: ['coverAlt'], message: 'Add alternative text when a cover image is provided.' });
    }
  }),
});

export const collections = { projects };
