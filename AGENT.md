# AGENT.md — entry point for AI agents

You are reading the AI entry point for the `saboteur-sites` repository. This file is a **map**, not a manual. Its job is to tell you which slices of the repo to load for a given task, in what order, and what constraints to respect throughout. Read this first; load further files based on the task.

## What this repo is

The single source of truth for **how a Saboteur LLC website or page is built**. Brand, voice, tokens, page anatomy, sections, compliance, and stack — codified for AI consumption. It is *not* a website. It is the documentation and patterns a generated Saboteur site repo draws from.

## Always-load context (small)

These files are short and load-bearing for any Saboteur web task. Load all three before doing anything else:

1. [`brand/identity.md`](brand/identity.md) — who Saboteur is, the three-tier hierarchy, voice rules.
2. [`compliance/cookieless-by-default.md`](compliance/cookieless-by-default.md) — the four hard rules every Saboteur site must satisfy.
3. [`tech/stack.md`](tech/stack.md) — Astro + Tailwind v4 + Cloudflare Pages, and what *not* to use.

## Style guidance — load from saboteur-styles

The `saboteur-styles` repo (`saboteur-works/saboteur-styles`) contains a `docs/` folder written explicitly for AI agents. It is the authoritative source for all token, color, typography, mark, and product style guidance. Load from it directly when the repo is available locally.

**Locate it:**
```bash
find ~/Repositories -maxdepth 4 -name "tokens.md" -path "*/saboteur-styles/docs/*" 2>/dev/null | head -1
```

**Load by task:**

| Task | Load these |
|---|---|
| Any token-sensitive generation (components, theme files) | `docs/tokens.md` + `docs/color-rules.md` |
| Mark, logo, avatar work | `docs/mark-usage.md` |
| Typography decisions | `docs/typography-rules.md` |
| Product-specific work | `docs/products.md` |
| Full brand context | all five docs files |

If `saboteur-styles` is not available locally, fall back to the local mirror at [`brand/inputs/saboteur-base.css`](brand/inputs/saboteur-base.css) and check [`brand/inputs/STYLES_SYNCED`](brand/inputs/STYLES_SYNCED) for freshness. If stale, run `bash scripts/sync-styles.sh`.

**Important:** `brand/visual-tokens.md` in this repo is now a thin pointer index, not the full reference. Always prefer `saboteur-styles/docs/` for detail.

## Task-specific loads

### "Generate a Saboteur landing page for product X"

Load **in addition to the always-load context**:

1. [`sites/landing-page/README.md`](sites/landing-page/README.md) — variant, anatomy, decision flow.
2. [`brand/visual-tokens.md`](brand/visual-tokens.md) — tokens to style with, rules to respect.
3. [`brand/inputs/saboteur-base.css`](brand/inputs/saboteur-base.css) — the actual token names available to Tailwind utilities.
4. The relevant section files under [`sections/`](sections/) — required: `nav/`, `hero/`, `mission/`, `legal-footer/`; optional per [`sites/landing-page/optional-sections.md`](sites/landing-page/optional-sections.md).

Then collect the per-product inputs the page needs:

- Product name and one-line descriptor (e.g., *INDEPENDENT MUSIC DISCOVERY*).
- Product domain (each Saboteur product currently gets its own).
- Tagline (one sentence, declarative, in voice).
- Mission statement (one paragraph, what the product is in opposition to).
- Three to five plain features. No marketing verbs.
- Status (pre-launch / in development / live).
- Whether the page needs a contact form. If yes, the data flow disclosure for the privacy policy.

### "Generate the parent / sub-brand landing page"

Same as above, but the variant in [`sites/landing-page/README.md`](sites/landing-page/README.md) is *parent* — hero uses the parent mark, the page includes a products-preview section, and the footer signs as Saboteur LLC.

The live `saboteur.dev` is the reference for this variant.

### "Update the brand layer"

Load [`brand/identity.md`](brand/identity.md), [`brand/visual-tokens.md`](brand/visual-tokens.md), and the rendered brand system at [`brand/inputs/saboteur-brand-system-v06.html`](brand/inputs/saboteur-brand-system-v06.html). Token changes belong in the canonical [`saboteur-styles`](https://github.com/saboteur-works/saboteur-styles) repo first; this repo's mirror gets re-synced after.

### "Add a new site type"

Read [`sites/README.md`](sites/README.md) for the composition model. A new site type goes in `sites/<type>/` with the same shape as `landing-page/` (anatomy, decision flow, references to required and optional sections). It does **not** redefine brand, sections, or compliance — it composes from them.

## Constraints that apply to every generation

These are not preferences. Violations break the site's compliance posture or its brand integrity.

1. **Static output only.** Astro static, no SSR. No long-running server. If server behavior is genuinely needed, route the request to a Cloudflare Worker.
2. **No cookies, no consent banner, no client storage by default.** Honor every rule in [`compliance/cookieless-by-default.md`](compliance/cookieless-by-default.md).
3. **Self-host fonts.** IBM Plex via `@fontsource/*`. Never `fonts.googleapis.com`, even though the brand-system reference HTML uses it (that file is internal reference only — don't replicate the import in a deployed site).
4. **Red is structure, identity, active state.** Never body text, never decorative fill, never arbitrary accent.
5. **Warm off-white `#F5F4F0`, never pure `#FFFFFF`.**
6. **Left-aligned by default.** Centering is a deliberate exception.
7. **No marketing verbs.** No *unleash*, *supercharge*, *delight*, *empower*. No exclamation marks. No emoji in voice copy.
8. **Brand tokens come from `saboteur-styles`.** Sites consume it as a git dependency. The local mirror at [`brand/inputs/saboteur-base.css`](brand/inputs/saboteur-base.css) is documentation; it is not the source.

## External references

- **Live parent landing page:** [`saboteur.dev`](https://saboteur.dev) — the canonical worked example of the parent variant.
- **Brand-tokens canonical source:** [`saboteur-works/saboteur-styles`](https://github.com/saboteur-works/saboteur-styles).
- **Brand system reference (rendered):** [`brand/inputs/saboteur-brand-system-v06.html`](brand/inputs/saboteur-brand-system-v06.html).

## What's *not* here yet

Phase 2 is complete. The following are deliberately deferred and should not be invented from scratch — wait for them, or surface the gap when you hit it:

- **Scaffolding starter files** — complete. See [`scaffolding/new-landing-page/`](scaffolding/new-landing-page/) for the bootstrap guide, first-time checklist, and starter files.
- **`features/` and `demo/` sections** — no canonical HTML yet. `optional-sections.md` documents the expected patterns; generate from those descriptions until the files exist.
- **The skill that consumes this repo** — complete. `/generate-saboteur-site` lives in [`skills/generate-saboteur-site.md`](skills/generate-saboteur-site.md), symlinked globally. Invoke it from a new site repo to scaffold and generate a complete landing page from this repo's docs.

If a task requires content that isn't here, stop and surface the gap rather than fabricating it.
