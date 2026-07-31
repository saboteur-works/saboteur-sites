# Content surfaces — blog and changelog

Optional, per-site additions to a landing page: `/blog` for long-form posts, `/changelog` for release notes. Both are static, both are markdown in the repo, both are opt-in.

A landing page does not need either one. Add a surface when there is something to put on it — an empty blog is worse than no blog, and a changelog nobody updates dates the product more precisely than having none.

## Why these exist

[`../../tech/seo.md`](../../tech/seo.md) splits discoverability into two jobs. Job 1 — owning the brand queries — is what the landing page and its metadata do. Job 2 — earning non-brand traffic — cannot be done on the landing page at all. A four-hundred-word page with no marketing verbs ranks for its own name and nothing else, and the correct response to that pressure is a content surface, not a denser hero.

These are that surface. They are also the only place on a Saboteur site where the writing runs longer than a paragraph.

## The two surfaces are shaped differently

| | `/blog` | `/changelog` |
|---|---|---|
| URLs | One page per post | **One page, total** |
| Authored as | One markdown file per post | One markdown file per release |
| Index | `/blog` lists posts, newest first | none — the page *is* the list |
| Entry length | 600+ words | 30–80 words |
| Feed | `/rss.xml` | none |
| JSON-LD | `BlogPosting` per post | none |

**The changelog is deliberately one page.** Release notes are short and structurally near-identical to each other. One URL per release would put dozens of thin, repetitive pages on a domain that otherwise has fewer than a dozen pages total — the scaled-content pattern in [`../../tech/seo.md`](../../tech/seo.md) §6, and the fastest way to make a small honest site look like a content farm. Entries are still authored one file per release so two releases never collide in git; they render onto `/changelog` as anchored `<h2>` sections, so `/changelog#v0-4-0` still links a specific release.

A post, by contrast, earns its own URL because it is substantive by rule. If a post would not, it should not be published — ten good posts beat a hundred thin ones, and the thin ones are an active liability.

## There is no surfaces config

The filesystem is the declaration. `src/pages/blog/` exists, so the site has a blog. There is no `surfaces: {...}` flag anywhere, deliberately: a flag that must be kept in sync with reality is a flag that eventually lies, which is the exact failure `policy.config.json`'s feature flags are audited for.

What must stay internally consistent — and what the assessor checks — is that a surface is either wholly present or wholly absent:

- `src/pages/blog/` ⇒ `blog` collection defined in `src/content.config.ts`, a `Blog` link in the nav, and `/rss.xml`.
- `src/pages/changelog.astro` ⇒ `changelog` collection defined, and a `Changelog` link in the nav.
- A collection defined in `content.config.ts` with no page rendering it, or a nav link to a route that doesn't exist, is a defect.

**Neither surface changes `policy.config.json`.** They add no data collection: no comments, no client storage, no third-party anything, and the feed is a static file. If a comment system is ever added, that is a processor and a policy change — and it is also a cookie, which the [cookieless charter](../../compliance/cookieless-by-default.md) does not permit by default.

## Files

Copy from [`../../scaffolding/content-surfaces/files/`](../../scaffolding/content-surfaces/files/). Take only the surfaces the site is actually getting, and delete the other collection from `content.config.ts`.

```
src/content.config.ts             Collection schemas. Blog and changelog.
src/layouts/Post.astro            Single post. h1 = post title.
src/pages/blog/index.astro        Post index, newest first.
src/pages/blog/[...slug].astro    One page per non-draft post.
src/pages/changelog.astro         Every release, one page.
src/pages/rss.xml.js              Blog feed. Needs @astrojs/rss.
src/content/blog/_TEMPLATE.md     Frontmatter reference. Never builds.
src/content/changelog/_TEMPLATE.md
src/content/README.md             Authoring guide for whoever writes the posts.
public/rss/styles.xsl             Makes the feed readable in a browser.
```

This document is the *design* reference — why the surfaces are shaped the way they are, and the invariants a generated site has to satisfy. `src/content/README.md` is the *authoring* guide, written for whoever sits down to write a post and shipped into the site repo so it's next to the files they edit. Keep them in their lanes: rules and reasoning here, the writing workflow there.

Two edits outside those files:

1. `npm i @astrojs/rss` — the only new dependency, and only if the site has a blog.
2. `Base.astro` — add the feed to the head so readers can discover it:
   ```html
   <link rel="alternate" type="application/rss+xml" title="Blog" href="/rss.xml" />
   ```

Underscore-prefixed files are excluded by the glob loader (`pattern: "**/[^_]*.md"`), which is what makes the templates safe to keep in the content directories.

## Rules

### Drafts never reach the build

`draft: true` in frontmatter. Every `getCollection` call filters on `!import.meta.env.PROD || !data.draft`, which means:

- **`npm run dev` renders drafts.** That is how you read a post while writing it.
- **`npm run build` drops them.** No page, no URL, no sitemap entry, no feed item — a draft cannot be found by someone who guesses the slug.

Never simplify the filter to `!data.draft`. That hides drafts from the author too, and the next person who wants a preview deletes the filter outright — which is how an unfinished post ships.

Wire the check into the site's `ci` script so the guarantee is enforced rather than trusted:

```json
"ci": "npm run policies:check && npm run build && npm run policies:audit && saboteur-check-drafts"
```

It exits non-zero if a draft slug appears anywhere in `dist/`. The case it actually catches is a **stale `dist/`** — a post built while published, then retracted by setting `draft: true`. The filter is irrelevant there; the old page is already on disk and, once deployed, already public. Rebuild clean.

### A published filename is permanent

The filename is the slug is the URL. Renaming a published post breaks every inbound link to it, and inbound links are the entire point of having posts. Pick the slug when you publish, not before.

### Headings

On a post page the `<h1>` is the **post title**. The landing page's "the hero mark is the `h1`" rule is scoped to the landing page — a post has no hero. Exactly one `h1` either way. See [`../../compliance/accessibility.md`](../../compliance/accessibility.md) §Headings.

Post bodies start their sections at `##`. Changelog entry bodies contain **no headings at all** — the `##` level belongs to the version, and a heading inside an entry skips a level and breaks the page outline. Lists and paragraphs only.

### Dates

Plain ISO days in frontmatter (`2026-07-31`), no time and no timezone. The layouts format in UTC, so a post never shifts a day for a reader in another zone. `updatedDate` is for a material revision, not a typo fix.

### Images

A post body is the **only authored surface on a Saboteur site where an image may appear** outside the Demo section and the OG card. Self-hosted under `/assets/`, real `alt` describing what it shows. See [`../../sections/SHARED-image-rules.md`](../../sections/SHARED-image-rules.md).

No third-party embeds — a YouTube iframe in a post is exactly the leak the cookieless posture exists to prevent, and the click-to-load wrapper is the only way in.

### Voice

Unchanged, and not relaxed for length. First person singular, declarative, no marketing verbs, no exclamation marks. A post that reads like content marketing has failed twice over — once against the brand and once against the search-quality guidance that motivated writing it. Long-form specifics: [`../../skills/write-saboteur-post/references/long-form-voice.md`](../../skills/write-saboteur-post/references/long-form-voice.md).

### Pagination

`/blog` is unpaginated. Past roughly twenty posts, paginate with Astro's `paginate()` — and give every page a **self-referential canonical**: `/blog/2` canonicalises to `/blog/2`, never back to `/blog`. Collapsing paginated canonicals to page 1 tells search engines every post past the tenth doesn't exist.

### What counts as a release note

The body of an entry is **what changed for a reader**. The `internal` frontmatter list is everything else — dependency bumps, build plumbing, refactors.

The deciding question is *could a user notice this without being told?* If yes, body. If it's genuinely both, it's user-visible; put it in the body. Internal churn is not dropped, because a changelog with gaps invites the question of what else is missing — it's just not what the page leads with.

`/changelog` renders the body of every entry and hides the internal lists behind a **"show the full picture" toggle**: a real `<input type="checkbox">` plus CSS sibling selectors. No JavaScript, no storage, no persisted preference. The page opens on what changed for a reader, which is the honest default; the toggle is there for whoever wants the rest.

Three things about it are load-bearing:

- **The input, the label, and `.entries` must remain siblings.** The CSS reaches from the checkbox across to the entries with `~`. Wrapping any of them in a div breaks the toggle silently — it still renders, it just stops working.
- **The toggle only renders when something is behind it** (`hasInternal`). A control that reveals nothing is worse than no control.
- **This is progressive disclosure, not hidden text.** The internal items are in the markup, indexable, and identical for a reader and a crawler; a visible control reveals them. That is the line between disclosure and the cloaking rule in [`../../tech/seo.md`](../../tech/seo.md) §2 — the violation is text a *user* can never reach, not text behind a control they can operate.

### Version identifiers

The schema takes a free string, deliberately: `0.4.0`, `2026.07`, and `Build 214` are all legitimate depending on the product.

**Pick one scheme per product and keep it.** The anchor is derived from the version — `0.4.0` → `/changelog#v0-4-0` — so a scheme change orphans every anchor anyone has already linked. That makes the choice effectively permanent from the first published entry, and it's worth a moment's thought before the first release rather than after the twentieth.

Semver for anything with real releases. Date-based for something shipped continuously where a version number would be theatre.

### Duplication

The doorway-page invariant applies to posts as it does to sections: no post is published on two Saboteur domains. If a topic genuinely serves two products, it goes on one and the other links to it.

## Nav

Section links are in-page anchors and only work on the landing page. Surface links are real routes and work everywhere, so they render on every page — including `/privacy`, `/terms`, and posts themselves, where `showSections={false}` strips the anchors but leaves the routes.

This is the change to `Nav.astro`: `showSections` no longer means "render no links", it means "render no *anchor* links". See [`../../sections/nav/README.md`](../../sections/nav/README.md).

The nav caps at four links. A parent page with both surfaces is at the ceiling — `MISSION · BLOG · CHANGELOG · GET IN TOUCH` — and something has to give if a fifth is wanted. Dropping `MISSION` is usually right: the hero is directly above it.

## Verification

```bash
npm run build

# Drafts must not exist in the output, under any name.
npx saboteur-check-drafts --content ./src/content --dist ./dist

# Canonicals differ per page and point at production.
grep -rho 'rel="canonical" href="[^"]*"' dist/ | sort -u

# Posts are articles; index pages are not.
grep -o 'og:type" content="[^"]*"' dist/blog/*/index.html

# Exactly one h1 per page.
for f in $(find dist -name '*.html'); do echo "$(grep -c '<h1' $f) $f"; done | grep -v '^1 '

# The feed's stylesheet reference resolves.
test -f dist/rss/styles.xsl && echo ok
```

## What this does not change

The landing page. Adding a blog does not add a section to `index.astro`, does not change the hero, and does not earn the hero more keywords. That separation is the point: the content surface exists so the landing page never has to become a content surface.
