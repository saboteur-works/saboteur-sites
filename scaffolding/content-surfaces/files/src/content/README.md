# Writing for this site

Everything published at `/blog` (and `/changelog`, if this site has one) is a markdown file in this directory. There is no CMS and no admin login — you write a file, you commit it, it goes live.

This README is for the person writing. The design rules behind it are in `saboteur-sites/sites/landing-page/content-surfaces.md`; the voice rules are in `saboteur-sites/skills/write-saboteur-post/references/long-form-voice.md`.

---

## Write a blog post

### 1. Copy the template

```bash
cp src/content/blog/_TEMPLATE.md src/content/blog/why-the-changelog-is-one-page.md
```

**The filename is the URL.** `why-the-changelog-is-one-page.md` → `/blog/why-the-changelog-is-one-page`.

Pick it deliberately: once a post is published and someone links to it, renaming the file breaks that link. Lowercase, hyphens, no dates in the name.

### 2. Fill in the frontmatter

The block between the `---` fences at the top:

```yaml
---
title: Why the changelog is one page
description: One page per release note would put dozens of near-identical thin URLs on a domain with under a dozen pages. Here is the arithmetic.
pubDate: 2026-07-31
draft: true
---
```

That is all four required fields. See the reference table below for the rules and the optional ones.

### 3. Write

Plain markdown below the frontmatter. Start your sections at `##` — `#` is reserved for the title, which the page renders for you from the frontmatter.

Nothing to style. Headings, lists, links, quotes, tables, and code blocks are all styled automatically.

### 4. Read it in a browser

```bash
npm run dev
```

Open `localhost:4321/blog/<your-filename>`. Drafts are visible here — that is the point of `npm run dev`. It also shows up on `/blog` so you can see how it reads in the list.

### 5. Publish

Change `draft: true` to `draft: false`, then commit and push:

```bash
git add src/content/blog/why-the-changelog-is-one-page.md
git commit -m "Add post: why the changelog is one page"
git push
```

Cloudflare builds and deploys. The post is then live, listed on `/blog`, in the sitemap, and in the RSS feed.

### To unpublish

Set `draft: true` and push again. Check the deploy actually rebuilt — the build gate (`saboteur-check-drafts`) fails if the old page is still sitting in the build output.

---

## Frontmatter reference

| Field | Required | Rules |
|---|---|---|
| `title` | yes | 70 characters max. Becomes the page heading and the browser title. |
| `description` | yes | **50–160 characters.** This is the Google result snippet, the social-card text, and the RSS summary. Write it as the post's opening line, not a summary of the post. |
| `pubDate` | yes | `2026-07-31`. Date only — no time, no timezone. |
| `draft` | yes | `true` while writing, `false` to publish. |
| `updatedDate` | no | Only when you materially revise a published post. Not for typos. |
| `ogImage` | no | Social card, 1200×630, in `public/assets/`. Write it as `/assets/name.png`. |
| `ogImageAlt` | no* | *Required if `ogImage` is set. Describes what the image shows. |

**These are enforced at build time.** A 200-character description or a missing `ogImageAlt` fails the build with a message naming the file. That is deliberate: it is cheaper to fix now than after Google has truncated your description.

---

## Things that will bite you

**The filename is permanent.** Decide the slug before you publish, not after.

**`description` has a hard 160-character ceiling.** Count it. Most first drafts run long and the build will reject them.

**Don't use `#` in the body.** The layout already renders the title as the page's `#`. Starting a body section with `#` produces two top-level headings, which breaks the page for screen readers.

**Images go in `public/assets/`, never a URL from elsewhere.** No Imgur, no Unsplash hotlinks, no YouTube embeds. This site loads nothing from third parties by design — that is the whole cookieless posture, and one embed breaks it. Every image needs alt text describing what it shows.

**One post, one site.** Never publish the same post on two Saboteur domains. If it serves both, publish on one and link from the other.

---

## Voice, briefly

The full rules are in `long-form-voice.md`, but the short version:

- First person singular. *I*, never *we*.
- Open on the problem. No *In this post I'll cover…*.
- Stop at the last real point. No summarising final paragraph.
- No marketing verbs, no exclamation marks, no *you should*.
- Write about a problem you actually solved. Never write a post because a phrase gets searched.

The test: would this paragraph read the same on any other company's engineering blog with the name swapped? If yes, it isn't finished.

---

## Or let the skill draft it

```
/write-saboteur-post
```

It collects the material, writes the file with valid frontmatter in the right voice, and always leaves `draft: true` — publishing stays your call. It will tell you there's no post yet rather than padding out a thin topic, which is the correct answer more often than it sounds.

---

## Changelog entries

Release notes work differently — they all render onto a single `/changelog` page rather than getting a URL each. Conventions are in `src/content/changelog/_TEMPLATE.md`.
