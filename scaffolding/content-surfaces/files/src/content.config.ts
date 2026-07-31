// Content collections for the optional /blog and /changelog surfaces.
//
// Only define the collections the site actually has. A site with a blog and no
// changelog deletes the `changelog` collection and its export entry — an empty
// collection renders an empty page, which is worse than no page.
//
// See: saboteur-sites/sites/landing-page/content-surfaces.md

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// `[^_]*` keeps underscore-prefixed files out of the build. That is what makes
// _TEMPLATE.md safe to keep in the content directory as a reference.
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/[^_]*.md" }),
  schema: z.object({
    /** Post title. Becomes the <h1> and the first half of <title>. */
    title: z.string().min(1).max(70),

    /**
     * The page's meta description and the RSS summary. Aim for 140–160
     * characters per saboteur-sites/tech/seo.md; 160 is a hard cap because
     * Google truncates past it. Write it as the post's opening line, in voice
     * — not a keyword list.
     */
    description: z.string().min(50).max(160),

    /** Publication date. ISO (2026-07-31) in frontmatter; no time, no zone. */
    pubDate: z.coerce.date(),

    /** Set only when a published post is materially revised. */
    updatedDate: z.coerce.date().optional(),

    /**
     * Drafts render in `astro dev` and are dropped from `astro build`. Wire
     * `saboteur-check-drafts` into the site's ci script and the build fails if
     * one reaches dist/ anyway — which happens when dist/ is stale rather than
     * when the filter is wrong.
     */
    draft: z.boolean().default(false),

    /** Self-hosted 1200×630 card under /assets/. Never a third-party host. */
    ogImage: z.string().optional(),
    /** What the card shows. Required by the metadata contract when ogImage is set. */
    ogImageAlt: z.string().optional(),
  }).refine(
    (data) => !data.ogImage || !!data.ogImageAlt,
    { message: "ogImageAlt is required whenever ogImage is set (tech/seo.md)." },
  ),
});

// Changelog entries are authored one file per release but render onto a single
// /changelog page as anchored <h2> sections. One page per release note would be
// a set of near-identical thin URLs — the scaled-content pattern in
// saboteur-sites/tech/seo.md §6.
const changelog = defineCollection({
  loader: glob({ base: "./src/content/changelog", pattern: "**/[^_]*.md" }),
  schema: z.object({
    /** Release identifier as you'd say it out loud: "0.4.0", "2026.07". */
    version: z.string().min(1),

    /** Release date. ISO (2026-07-31). Sorts the page, newest first. */
    date: z.coerce.date(),

    /** One line naming what this release is about. Optional but preferred. */
    summary: z.string().max(160).optional(),

    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, changelog };
