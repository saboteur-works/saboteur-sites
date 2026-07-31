---
name: write-saboteur-post
description: >
  Write a blog post or a changelog entry for a Saboteur LLC site that has a
  content surface. Use this skill when the user wants to draft, write, or add a
  post to a Saboteur site's /blog, or add a release entry to its /changelog —
  including requests like "write a post about X", "draft a blog post for
  saboteur.dev", "add a changelog entry for 0.4.0", or "turn these notes into a
  post". Produces the markdown file with correct frontmatter, in long-form brand
  voice. Invoke as /write-saboteur-post, optionally passing a repository path
  and a topic.
argument_hint: repository topic
---

# Write a Saboteur post

Writes a `/blog` post or a `/changelog` entry as a markdown file with schema-valid frontmatter, in the long-form brand voice.

This skill writes **content**. It does not wire up the surface — if the site has no `/blog` yet, that is [`scaffolding/content-surfaces/README.md`](../../scaffolding/content-surfaces/README.md) first.

## Usage

```
/write-saboteur-post [repository] [topic]
```

- `repository` — local path to the Saboteur site repo
- `topic` — what the post is about, in a sentence

Missing arguments are collected interactively.

---

## Instructions

### Step 1 — Resolve the repository and the surface

Expand and verify `repository`. Confirm it is a Saboteur site (the marker list in `assess-saboteur-site` Step 3), then confirm the surface exists:

- Blog post → `src/pages/blog/` and a `blog` collection in `src/content.config.ts`
- Changelog entry → `src/pages/changelog.astro` and a `changelog` collection

If the surface is missing, stop and say so. Offer to add it via the scaffolding guide. Do not create a content file for a collection that nothing renders — it will not build, and if it does it will not be reachable.

### Step 2 — Locate saboteur-sites and load the voice

```bash
find ~/Repositories ~/repos ~/code ~/dev ~/Projects ~/projects ~/workspace ~/src -maxdepth 4 -name "AGENT.md" -path "*/saboteur-sites/*" 2>/dev/null | head -1
```

Store as SITES. Read, in this order:

1. `$SITES/brand/identity.md` §Voice
2. `$SITES/skills/write-saboteur-post/references/long-form-voice.md`
3. `$SITES/sites/landing-page/content-surfaces.md`

Then read **two existing posts from this repo** if any exist (`src/content/blog/*.md`, skipping `_`-prefixed files). The site's own published voice outranks a general reading of the brand docs — match what is actually there.

### Step 3 — Collect inputs

**For a blog post**, ask in a single block:

| Input | Notes |
|---|---|
| `topic` | The problem actually solved. If the answer is a subject area rather than a problem, push back — see Hard constraint 2. |
| `material` | The real substance: what broke, what was tried, what the numbers were, what the code was. A post cannot be written without this. |
| `slug` | Becomes the permanent URL. Propose one from the topic; confirm it. |
| `pubDate` | Default today. |

**For a changelog entry:**

| Input | Notes |
|---|---|
| `version` | As you'd say it out loud: `0.4.0`, `2026.07`. |
| `date` | Default today. |
| `changes` | What changed **for a reader**. Ask explicitly whether anything on the list is internal churn, and drop it if so. |

If `material` comes back thin — a topic and no specifics — say plainly that there is no post here yet and ask for the substance. Writing around missing material produces exactly the generic engineering-blog prose the voice check rejects. This is the most common way this skill fails.

### Step 4 — Draft

Write the body first, frontmatter second — the description is easier to write once the post exists.

Follow `long-form-voice.md` throughout. The rules most often missed:

- Open on the problem. No runway.
- Vary sentence length; the clipped line is punctuation, not the default register.
- Show the work, don't defend the stance.
- First person singular, and no `you should`.
- Stop at the last real point. No summarising conclusion.
- Headings start at `##` and are labels, not teasers.
- Changelog entries carry no headings at all.

### Step 5 — Frontmatter

Match the schema in `src/content.config.ts` exactly — it is enforced at build time.

Blog: `title` (≤70), `description` (50–160, aim 140–160), `pubDate` (ISO day), `draft`. `ogImage` requires `ogImageAlt`.

Changelog: `version`, `date` (ISO day), optional `summary` (≤160), `draft`.

**Set `draft: true`.** A skill does not decide that something is ready to publish. Say so in the report and let the user flip it.

### Step 6 — Write the file

- Blog: `src/content/blog/<slug>.md`
- Changelog: `src/content/changelog/<version-with-dashes>.md`

Never overwrite an existing file — if the path is taken, stop and ask.

### Step 7 — Verify before reporting

- [ ] Frontmatter satisfies the schema; `description` is ≤160 characters (count it, don't estimate)
- [ ] `draft: true`
- [ ] No marketing verbs, no exclamation marks, no emoji
- [ ] No corporate "we" — first person singular
- [ ] No `you should` / `best practice` advice register
- [ ] Body starts at `##`; changelog entry has no headings
- [ ] No `In this post` opener, no summarising final paragraph
- [ ] Any image is self-hosted under `/assets/` with real `alt`; no third-party embed
- [ ] **The doorway check** — no paragraph would read correctly on another company's engineering blog with the name swapped
- [ ] `npm run build` succeeds (the post won't render while `draft: true`, but the schema still validates)

### Step 8 — Report

Print the file path, the title, the description with its character count, and:

```
This is a draft. Set draft: false when you want it live.
Filename is permanent once published — the slug is the URL.
```

---

## Hard constraints

1. **Never invent the material.** No fabricated benchmarks, incidents, dates, or quotes. If the substance isn't supplied, the post doesn't exist yet — say so rather than producing something plausible.
2. **Never write a post for a keyword.** If the only reason a topic is on the list is search volume, decline it and say why. This is the rule that turns a content surface into the thing it was built to avoid.
3. **Always `draft: true`.** Publishing is the user's decision.
4. **All landing-page voice rules apply unchanged.** Long form is not a licence for marketing verbs, hedging, or SaaS-template phrasing.
5. **One domain per post.** Never publish the same post on two Saboteur sites. If a topic serves two products, it lives on one and the other links to it.
6. **Cookieless posture holds in post bodies.** No third-party embeds, no external image hosts, no analytics snippets, no web fonts.
