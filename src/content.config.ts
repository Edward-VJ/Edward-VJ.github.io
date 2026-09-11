import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** The public plan documents (docs/plan/*.md), rendered on /how-this-was-built/. */
const plan = defineCollection({
  loader: glob({ base: './docs/plan', pattern: ['**/*.md', '!steps/**'] }),
  schema: z.object({
    title: z.string().optional(),
    order: z.number().int().optional(),
  }),
});

/** One log per plan step (docs/plan/steps/PS-n.md). */
const steps = defineCollection({
  loader: glob({ base: './docs/plan/steps', pattern: '*.md' }),
  schema: z.object({
    step: z.string().regex(/^PS-\d+[a-z]?$/),
    title: z.string(),
    branch: z.string(),
    pr: z.number().int().nullable(),
    status: z.enum(['planned', 'in-progress', 'signed-off']),
    signedOff: z.coerce.date().nullable(),
    criteria: z.array(
      z.object({
        id: z.string(),
        kind: z.enum(['machine', 'human']),
        passed: z.boolean(),
        evidence: z.string().nullable(),
      }),
    ),
  }),
});

export const collections = { plan, steps };
