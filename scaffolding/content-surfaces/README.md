# Content surfaces — add-on guide

How to add `/blog`, `/changelog`, or both to an existing Saboteur landing page.

These are **not** part of the base scaffold. A landing page ships without them and stays correct. Add a surface when there is something to publish on it.

Semantics, rules, and the reasoning behind the shapes: [`../../sites/landing-page/content-surfaces.md`](../../sites/landing-page/content-surfaces.md). Read that first — this file is just the mechanics.

## Prerequisites

An existing site generated from [`../new-landing-page/`](../new-landing-page/), with `src/layouts/Base.astro`, `src/components/Nav.astro`, and `src/components/LegalFooter.astro` already in place. The surface pages import all three.

## Steps

### 1. Copy the files you need

From `files/`, into the site root. Take only the surfaces the site is getting.

**Blog:**
```
src/content.config.ts
src/layouts/Post.astro
src/pages/blog/index.astro
src/pages/blog/[...slug].astro
src/pages/rss.xml.js
src/content/blog/_TEMPLATE.md
src/content/README.md          <- the authoring guide. Copy it.
public/rss/styles.xsl
```

`src/content/README.md` is the human-facing "how to write and publish a post" guide, and it lives in the directory where posts are actually written. It sits above both collection directories, so the glob loader never tries to parse it as an entry. Copy it whichever surface you're adding.

**Changelog:**
```
src/content.config.ts
src/pages/changelog.astro
src/content/changelog/_TEMPLATE.md
```

If the site is getting only one surface, **delete the other collection from `src/content.config.ts`** and drop it from the `collections` export. A collection with no page rendering it is dead config that the assessor flags.

### 2. Install the feed dependency

Blog only:

```bash
npm i @astrojs/rss
```

Nothing else is needed. Content collections are built into Astro, and the prose styling already ships in the base scaffold's `global.css`.

### 3. Resolve the TODOs

Each copied file carries `TODO` markers. All of them:

| File | TODO |
|---|---|
| `src/layouts/Post.astro` | `SITE_NAME` — must match `Base.astro` |
| `src/pages/blog/index.astro` | `SITE_NAME`, the page description, the JSON-LD description, and the one-line intro |
| `src/pages/changelog.astro` | `SITE_NAME`, the page description, and the one-line intro |
| `src/pages/rss.xml.js` | feed title and description |

The intro lines are real copy, not filler. One sentence on what gets written here and what doesn't. Ship the placeholder and the page says `TODO` to every visitor.

### 4. Add the feed to the head

In `src/layouts/Base.astro`, inside `<head>` (blog only):

```html
<link rel="alternate" type="application/rss+xml" title="Blog" href="/rss.xml" />
```

### 5. Add the nav links

In `src/components/Nav.astro`, add the surface routes **outside** the `{showSections && ( … )}` block, so they render on standalone pages too:

```astro
<li>
  <a href="/blog" class="font-mono text-[10px] tracking-[0.14em] text-fg-tertiary hover:text-fg-primary uppercase transition-colors duration-150">
    Blog
  </a>
</li>
```

Section anchors stay inside the conditional. Four links is the cap — see [`../../sections/nav/README.md`](../../sections/nav/README.md).

### 6. Wire the draft check into CI

In `package.json`, append `saboteur-check-drafts` to the `ci` script:

```json
"ci": "npm run policies:check && npm run build && npm run policies:audit && saboteur-check-drafts"
```

`saboteur-sites` is already a dependency, so the binary is on the path. It fails the build if a draft slug appears in `dist/` — which is how a retracted post stays live off a stale build directory.

### 7. Write something, then build

Copy `_TEMPLATE.md` to a real filename, fill the frontmatter, write the post. It stays `draft: true` until you flip it.

```bash
npm run dev     # renders drafts — this is how you read a post while writing it
npm run build   # drops them
```

Then run the verification block in [`../../sites/landing-page/content-surfaces.md`](../../sites/landing-page/content-surfaces.md) §Verification.

## Deleting a surface later

Remove the pages, the collection from `content.config.ts`, the content directory, and the nav link — all four. Then add redirects for any URL that was live, in `public/_redirects`:

```
/blog/some-post  /blog  301
```

A published URL that starts 404ing is a broken promise to everyone who linked it. If the whole blog is going away, redirect the posts to `/`, not to a `/blog` that no longer exists.
