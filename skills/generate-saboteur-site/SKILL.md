---
name: generate-saboteur-site
description: >
  Scaffold and generate a complete, customized Saboteur LLC landing page in the
  current directory. Use this skill whenever the user wants to build, start, or
  set up a Saboteur product site or parent landing page — including requests like
  "generate a site for X", "make a landing page for Y", "set up the OffBeat-FM
  site", or "create the saboteur.dev page". It reads the saboteur-sites reference
  docs, collects brand and product inputs, and writes all Astro component files,
  global CSS, config, and boilerplate. Invoke as /generate-saboteur-site from a
  fresh site repo, optionally passing variant, product name, and domain as
  arguments.
---

# Generate Saboteur Landing Page

Scaffold and generate a complete, customized Saboteur LLC landing page in the current directory. Reads brand, section, compliance, and stack docs from the `saboteur-sites` reference repo, then writes all project files.

## Usage

```
/generate-saboteur-site [variant] [product-name] [domain]
```

- `variant` — `product` or `parent` (default: `product`)
- `product-name` — e.g. `OffBeat-FM` (used verbatim in headings; get the casing right)
- `domain` — e.g. `offbeat-fm.com`

All arguments are optional; missing values are collected interactively.

---

## Instructions

You are generating a Saboteur LLC landing page. Follow these steps exactly, in order.

### Step 1 — Parse arguments

`$ARGUMENTS` may contain up to three space-separated tokens: `[variant] [product-name] [domain]`. Extract what's there; note what's missing.

### Step 2 — Locate saboteur-sites

Run this to find the `saboteur-sites` reference repo:

```bash
find ~/Repositories ~/repos ~/code ~/dev ~/Projects ~/projects ~/workspace ~/src -maxdepth 4 -name "AGENT.md" -path "*/saboteur-sites/*" 2>/dev/null | head -1
```

If not found there, try `../saboteur-sites/AGENT.md` relative to the current directory. If still not found, ask the user where they cloned https://github.com/saboteur-works/saboteur-sites before continuing.

Store the resolved path as SITES (e.g. `~/code/saboteur-works/saboteur-sites`).

### Step 3 — Load saboteur-styles docs

The `saboteur-styles` repo has a `docs/` directory written for AI agents — the authoritative source for all token and color guidance. You need `tokens.md` and `color-rules.md` before generating any markup.

**1. Check for a local clone:**

```bash
find ~/Repositories ~/repos ~/code ~/dev ~/Projects ~/projects ~/workspace ~/src -maxdepth 4 -name "tokens.md" -path "*/saboteur-styles/docs/*" 2>/dev/null | head -1
```

If found, store the parent `docs/` path as STYLE_DOCS and read the files from there.

**2. If not found locally**, ask the user in one message:

> "I didn't find `saboteur-styles` locally. Do you have a local clone you'd like me to use? If not, I'll fetch the style docs from GitHub — that works fine too."

- If they provide a path, use it as STYLE_DOCS.
- If they don't have one locally (or prefer GitHub), fetch from the canonical repo:

```bash
gh api repos/saboteur-works/saboteur-styles/contents/docs/tokens.md --jq '.content' | base64 -d
gh api repos/saboteur-works/saboteur-styles/contents/docs/color-rules.md --jq '.content' | base64 -d
```

Hold these file contents in context as TOKENS_DOC and COLOR_RULES_DOC. There is no STYLE_DOCS path in this case.

**3. Last resort** — if `gh` is unavailable and no local clone exists, fall back to `$SITES/brand/inputs/saboteur-base.css` and `$SITES/brand/visual-tokens.md`. Read `$SITES/brand/inputs/STYLES_SYNCED` and warn the user if `last_synced` is more than a few days old.

Read all of these before generating anything:

1. `$SITES/brand/identity.md`
2. `tokens.md` (from STYLE_DOCS, GitHub fetch, or fallback CSS)
3. `color-rules.md` (from STYLE_DOCS, GitHub fetch, or fallback `visual-tokens.md`)
4. `$SITES/compliance/cookieless-by-default.md`
5. `$SITES/sites/landing-page/README.md`
6. `$SITES/sites/landing-page/required-sections.md`
7. `$SITES/sites/landing-page/optional-sections.md`
8. `$SITES/sections/SHARED-image-rules.md`

### Step 4 — Collect per-product inputs

If any of the following are still missing after parsing `$ARGUMENTS`, ask for them **in a single question block** (do not ask one by one). Present sensible examples for each.

**Required for all variants:**

| Input | Description | Example |
|---|---|---|
| `variant` | `product` or `parent` | `product` |
| `product_name` | Verbatim product name | `OffBeat-FM` |
| `domain` | Production domain | `offbeat-fm.com` |
| `descriptor` | All-caps mono tag line after `—` in the mark | `INDEPENDENT MUSIC DISCOVERY` |
| `sub_brand` | `SAB/works` or `SAB/labs` | `SAB/works` |
| `tagline` | Hero body — opener clause (before the stance) | `Music discovery for people who actually listen.` |
| `stance` | Hero body — middle clause lifted to white | `No algorithms. No editorial committees. No playlist designed by a growth team.` |
| `closer` | Hero body — closing clause | `Just the music, and the people who make it.` |
| `mission_heading` | Mission section heading (one sentence, display font) | `Music without the machine.` |
| `mission_body` | Mission paragraph: diagnosis → white pivot → prescription | See pattern below. |
| `status_stage` | `Live`, `In development`, or `Pre-production` | `In development` |
| `has_contact` | Whether to include a contact form (`yes`/`no`) | `yes` |

**Required for `product` variant only:**

| Input | Description |
|---|---|
| `features` | 3–5 plain declarative statements about the product (one per line, no marketing verbs) |
| `cta_label` | Hero CTA label; omit if pre-launch with no action yet |

**Required for `parent` variant only:**

| Input | Description |
|---|---|
| `japanese` | Japanese text in the mark (default: `サボタージ員`) |
| `tenets` | Three principles: each has a headline (short, ends with period) and a body (one–two sentences) |
| `products` | 2–3 products to show in ProductsPreview; each has: name, descriptor, sub-brand suffix, body, tags (2–3), action label, action URL (or "Coming Soon") |
| `status_rows` | One status row per product: name + stage |

**Optional inputs (any variant):**

| Input | Description | Example |
|---|---|---|
| `og_image_path` | Path to a 1200×630 OG card image. If omitted, the head emits a `<!-- TODO og:image -->` comment instead of an `og:image` meta. | `./assets/og-card.png` |

**Optional inputs (`product` variant only):**

| Input | Description | Example |
|---|---|---|
| `include_demo` | Whether to include a Demo section (`yes`/`no`). Default: `no`. | `no` |
| `demo_image_path` | Path to a screenshot for the Demo section. If `include_demo` is `yes` but this is omitted, the section renders the placeholder snippet from [`compliance/snippets/image-placeholder.html`](../../compliance/snippets/image-placeholder.html). | `./assets/demo-library-view.png` |
| `demo_alt` | `alt` text for the Demo image. Required when `demo_image_path` is supplied. Describes what the image *shows*, not a marketing line. | `OffBeatFM library view — three columns showing artists, releases, and a now-playing pane.` |

Images follow the rules in [`$SITES/sections/SHARED-image-rules.md`](../../sections/SHARED-image-rules.md). Never reference an external image host (placehold.co, Unsplash, Cloudinary, etc.) — those break the cookieless posture. If the user describes an image for a forbidden section (Hero, Mission, Principles, Features, Products preview, Status, Contact, Legal footer, Nav), surface the conflict rather than insert it.

**Mission body pattern:**

> *[The dominant category] [two or three specific things it does wrong]. [White pivot — usually "We build the opposite." or "We made something else."] [Positive prescription.]*

### Step 5 — Copy starter files

Copy everything from `$SITES/scaffolding/new-landing-page/starter-files/` into the current directory. Do not overwrite files that already exist unless they are the scaffold's generic placeholders (package.json, astro.config.mjs, robots.txt, README.md).

### Step 6 — Customize boilerplate files

**`package.json`** — replace `"name": "PRODUCT-site"` with the kebab-cased product name (e.g. `"offbeat-fm-site"`). Replace the description TODO.

**`astro.config.mjs`** — replace `"https://TODO.com"` with `"https://<domain>"`.

**`public/robots.txt`** — replace `https://TODO.com` with `https://<domain>`.

**`README.md`** — fill in all TODO lines with the product name, one-line description, status, domain, and sub-brand.

### Step 7 — Generate component files

Create `src/components/` and write the following `.astro` files. Each file must start with a frontmatter block (`---`/`---`) even if empty.

#### Nav.astro

Use the minimal variant. For a **product** page:
- Mark: wordmark only (no Japanese). Red 3px left bar. `href="/"`.
- Links: derive from which sections are present. Typical product: `Mission`, `Get in touch`. Add `Status` if the status section is included.

For a **parent** page:
- Mark: wordmark + Japanese (`サボタージ員` or the provided value).
- Links: `Mission`, `Products`, `Get in touch`.

Reference: `$SITES/sections/nav/variant-minimal.html` for the exact class pattern.

#### Hero.astro

**Product variant:**
```
wordmark (no Japanese tier)
descriptor: <DESCRIPTOR> — <domain>
body: <tagline>. <em class="not-italic text-fg-primary"><stance></em> <closer>
CTA: outlined button (if cta_label provided)
```

Wordmark size: `clamp(36px, 9vw, 72px)`. Vertical bar: 4px red.

**Parent variant:**
```
wordmark
Japanese
descriptor: CREATOR-FIRST SOFTWARE — <domain>
body: same three-clause pattern
(no CTA on parent)
```

Wordmark size: `clamp(48px, 12vw, 88px)`.

Reference: `$SITES/sections/hero/variant-product.html` and `variant-parent.html`.

#### Mission.astro

Grid: `grid-cols-1 gap-5 md:grid-cols-[140px_1fr] md:gap-10`. Section `id="mission"`.

Right column:
- `<h2>` display font `clamp(24px,5vw,32px)` tracking `-0.03em` leading `1.1`: `mission_heading`
- `<p>` 13px sans 400 leading `1.8` in `fg-secondary`, white pivot via `<em class="not-italic text-fg-primary">`: `mission_body`

**Parent variant** — add tenets list below the paragraph (using the provided `tenets`). Number in `text-brand-red`. Headline in `text-fg-primary font-bold`. Body in `text-fg-secondary`. Each row has `border-t border-brand-rule py-[13px]`; last row also has `border-b`.

**Product variant** — omit tenets unless explicitly provided.

Reference: `$SITES/sections/mission/example.html`.

#### Features.astro (product variant only, if `features` provided)

Section label: `FEATURES`. Same section grid. Right column: one row per feature, each with `border-t border-brand-rule py-[13px]`. 13px sans `fg-secondary`. No icons.

#### Demo.astro (product variant only, if `include_demo` is `yes`)

Section label: `DEMO`. Same section grid (140px label + 1fr) for the label and a one-sentence intro. Below the section-inner, a full-width image block.

Image block:

- **If `demo_image_path` is supplied:** write an `<img>` against that path with `class="w-full border border-brand-dim"`. Set `alt` to `demo_alt`. Copy the asset file from the supplied path into `public/assets/` (kebab-case the filename if needed). If `demo_alt` is missing, stop and ask the user.
- **If `demo_image_path` is omitted:** paste the placeholder snippet from `$SITES/compliance/snippets/image-placeholder.html` verbatim, with the caption updated to `[ SCREENSHOT · 1440×900 ]`. Leave a `<!-- TODO: replace with real screenshot -->` comment above it.

No carousel, no autoplay, no animated GIF. Static raster only. See `$SITES/sections/SHARED-image-rules.md`.

#### ProductsPreview.astro (parent variant only)

Section label: `PRODUCTS`. Intro line (1 sentence) above a 2-up card grid. Each card:
- `bg-brand-surface p-9`
- Mark with 3px red bar, display wordmark, mono descriptor ending in `— <sub_brand>`
- Body with `<em class="not-italic text-fg-primary">` on the stance clause
- Tags: 9px mono uppercase, `border-brand-dim`, `px-[7px] py-[3px]`
- Action: outlined mono button or disabled `Coming Soon`

Reference: `$SITES/sections/products-preview/example.html`.

#### Status.astro

Section label: `STATUS`. Intro line + flat list of rows.

Each row:
- `flex gap-[14px] items-center border-t border-brand-rule py-[13px]` (last row also `border-b`)
- Dot `w-[6px] h-[6px] rounded-full`: `bg-brand-red` if Live, `bg-brand-dim` otherwise
- Name: display 700 15px `text-fg-primary flex-1`
- Badge: 9px mono uppercase hairline outlined. Live: `text-brand-red border-brand-red opacity-90`. Others: `text-fg-tertiary border-brand-dim`

Reference: `$SITES/sections/status/example.html`.

#### Contact.astro (if `has_contact` is yes)

Full form per the canonical pattern. Derive topic options from the product's context (e.g. early access, partnerships). Include:
- Honeypot field (off-screen, `name="company"`)
- Name + Email 2-col row
- Regarding `<select>` with relevant topics
- Message `<textarea>`
- Submit: `bg-brand-red` filled, mono 10px
- Lawful-basis copy below submit
- Closing line: *"We read everything. We reply to most of it."*

Form `action`: `https://forms.saboteur.dev/contact` (placeholder; user replaces with their Worker URL).

**No `border-b` on this section** — it's the last content section.

Reference: `$SITES/sections/contact/form.html`.

#### LegalFooter.astro

Compact footer. Sign-off: `© 2026 Saboteur LLC · <domain>`. Privacy and Terms links (href `/privacy` and `/terms`).

Reference: `$SITES/sections/legal-footer/footer.html`.

### Step 8 — Wire up index.astro

Rewrite `src/pages/index.astro`:
- Import `Base` layout
- Import every generated component
- Set `<Base title="..." description="...">` using the product name and tagline
- If `og_image_path` was supplied, pass `ogImage="/assets/<filename>"` to `Base` so the layout can emit `<meta property="og:image">`. If the Base layout does not yet accept an `ogImage` prop, extend it: add the prop and emit `<meta property="og:image" content={ogImage}>` (and the standard `og:image:width=1200` / `og:image:height=630`) when it is set.
- If `og_image_path` was *not* supplied, write `<!-- TODO og:image — see sections/SHARED-image-rules.md -->` inside the head so the omission is visible in source.
- Copy the supplied OG file into `public/assets/` (kebab-case the filename if needed).
- Compose sections in order: Nav → Hero → Mission → (Features) → (Demo) → (ProductsPreview) → (Status) → (Contact) → LegalFooter

Remove the scaffold's commented-out placeholder imports.

### Step 9 — Verify constraints

Before reporting done, check each item:

- [ ] No `#FFFFFF` in any generated file — only `brand-white` / `#F5F4F0`
- [ ] No `fonts.googleapis.com` reference
- [ ] No `<script>` tags that set cookies or write to `localStorage`
- [ ] Submit button is `bg-brand-red` — not outlined, not `brand-mid`
- [ ] Every section label is plain uppercase text (not `01 — SECTION`)
- [ ] LegalFooter has both Privacy and Terms links
- [ ] `astro.config.mjs` has the correct production URL (not the TODO placeholder)
- [ ] `package.json` name does not contain `PRODUCT`
- [ ] No external image host referenced (placehold.co, picsum.photos, Unsplash, Cloudinary, via.placeholder.com, etc.) — all `<img src>` values point at `/assets/...`
- [ ] No `<img>` in a forbidden section (Nav, Hero, Mission, Principles, Features, ProductsPreview, Status, Contact, LegalFooter)
- [ ] If Demo is included with no supplied image: the placeholder snippet is present with a visible `[ SCREENSHOT · ... ]` caption and a TODO comment above it
- [ ] If Demo is included with a supplied image: the file exists under `public/assets/`, the `<img>` has a real `alt`, and the surrounding `<figure>` uses `border-brand-dim`
- [ ] OG image: either `<meta property="og:image">` is set against `/assets/...`, or a `<!-- TODO og:image -->` comment is present in the head

Fix any violations before reporting.

### Step 10 — Report

List every file written. Then print the next-steps block:

```
Next steps
──────────
1. npm install && npm run dev — verify locally
2. Replace form action URL with your CF Worker endpoint
3. Add /privacy and /terms pages (from compliance/privacy-policy/template.md and terms-of-service/template.md)
4. Run compliance/pre-launch-checklist.md before going live
```

---

## Hard constraints

These constraints exist for specific reasons — get any of them wrong and you either break the site's EU compliance posture or violate the brand's core identity.

1. **Static output only.** Saboteur sites are hosted on Cloudflare Pages (free tier, no server). No SSR, no server imports, no `server:only`. If server behavior is needed, that's a Cloudflare Worker — a separate concern outside this skill's scope.
2. **No cookies, no client storage, no consent banner.** The entire brand promise is cookieless-by-default. A `localStorage` write or a cookie set would require a GDPR consent banner and undermine the brand's stated position.
3. **Self-host fonts.** `@fontsource/ibm-plex-*` packages are already in the scaffold. Using `fonts.googleapis.com` would be an external network request on page load, violating the cookieless charter and leaking visitor IP to Google.
4. **Red marks structure, not decoration.** Red (`brand-red`) signals identity (the mark's left bar), active state, and the single primary CTA (the contact submit button). Using it elsewhere dilutes the signal and confuses the visual hierarchy. The filled-red submit button is the one exception — it's the page's primary commit action.
5. **Warm off-white, not pure white.** `#F5F4F0` (`brand-white`) is the canonical white. Pure `#FFFFFF` looks harsh against `brand-black` and is explicitly excluded from the token set.
6. **Left-aligned body content.** The hero, mission, and section copy are always left-aligned. Centering body text signals a different brand personality — one Saboteur doesn't have.
7. **No marketing verbs in copy.** The brand voice is declarative and restrained. Words like *unleash*, *supercharge*, *delight*, *empower*, *transform* — and exclamation marks — undermine that. Write as if describing a fact, not selling a feature.
8. **Section labels are plain words.** `MISSION`, `PRODUCTS`, `STATUS` — not `01 — MISSION`. Numbered labels belong to documentation pages (like the brand-system reference HTML), not landing pages.
9. **Privacy and Terms links in the footer are required.** Even without cookies, server logs capture IP addresses — GDPR Article 13 disclosure obligations still apply. A footer without these links is non-compliant.
