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

---

## Write a changelog entry

Release notes work differently from posts in one important way: **they all render onto a single `/changelog` page** rather than getting a URL each. You still write one file per release — that just keeps releases from colliding in git.

### 1. Copy the template, named for the version

```bash
cp src/content/changelog/_TEMPLATE.md src/content/changelog/0-4-0.md
```

### 2. Fill it in

```yaml
---
version: 0.4.0
date: 2026-07-31
summary: Blog and changelog surfaces.
internal:
  - Bumped Astro to 5.2.
  - Consolidated the prose CSS into one layer.
draft: true
---

- Added `/blog`, backed by a content collection.
- Added `/changelog`, rendered onto one page.
```

**The body is what changed for a reader. The `internal` list is everything else.**

That split is the whole design. The page shows the body by default and hides the internal list behind a *"show the full picture"* toggle, so the changelog is complete without burying what people actually care about.

Deciding where a line goes — *could a user notice this without being told?*

- Yes → the body.
- No → `internal`.
- Both → the body. When in doubt it's user-visible.

`internal` is optional. Plenty of releases won't have one, and the toggle only appears if at least one entry does.

### 3. Preview and publish

Same as posts: `npm run dev` shows drafts, `draft: false` publishes, commit and push.

### The version is permanent

`version` becomes the entry's link: `0.4.0` → `/changelog#v0-4-0`.

So **pick a scheme and stay with it.** Switching from `0.4.0` to `2026.07` later breaks every changelog link anyone has shared. Semver if the product has real releases; dates if it ships continuously and a version number would be theatre.

### If the product generates its own CHANGELOG.md

Some products (GetWrite) already generate a changelog from their commits. Don't retype it, and don't publish it as-is — it's written for developers, in commit-message voice.

Import it into the `internal` list instead:

```bash
# from a local checkout of the product repo
npx saboteur-import-changelog --changelog ../getwrite/CHANGELOG.md

# or fetch it first
gh api repos/saboteur-works/getwrite/contents/CHANGELOG.md --jq .content \
  | base64 -d > /tmp/CHANGELOG.md
npx saboteur-import-changelog --changelog /tmp/CHANGELOG.md --limit 1
```

That creates (or refreshes) the entry with `internal` filled in from the generated file. You then write the user-visible body and flip `draft: false`.

**It never overwrites your prose.** Re-running after each release refreshes only the `internal` list — your body, summary, and draft flag stay exactly as you left them. Use `--dry-run` to see what would change, and `--limit`/`--since` so you aren't handed 64 historical releases to write bodies for.

### Writing the entries

- Say what changed, not how you feel about it. *Search now matches on tags.* — not *Improved search!*
- Past tense for fixes, present for new behaviour. *Fixed a crash when…* / *Exports now include…*
- No headings inside an entry. The version is the heading; a `##` in the body breaks the page outline.
- No marketing verbs, no exclamation marks. A changelog is a record.

---

## Which surface does this site have?

Not every Saboteur site has both, and that's deliberate:

| Site | Blog | Changelog |
|---|---|---|
| `saboteur.dev` | yes | no — a landing page's changelog is a log of copy edits |
| `getwrite.app` | yes | yes |

If a surface isn't wired up here, the files for it simply aren't in this repo. Adding one is `saboteur-sites/scaffolding/content-surfaces/README.md`.
