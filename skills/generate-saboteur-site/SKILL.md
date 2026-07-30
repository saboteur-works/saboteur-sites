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
9. `$SITES/tech/seo.md`
10. `$SITES/compliance/policy-tooling.md`

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
| `og_image_alt` | What the card shows. Required when `og_image_path` is supplied. | `The OffBeat-FM wordmark on black.` |
| `site_name` | Site name as a person says it, for `og:site_name`. Defaults to `product_name`. | `OffBeat-FM` |
| `same_as` | URLs of profiles genuinely belonging to the entity, for JSON-LD `sameAs`. Parent variant. | `https://github.com/saboteur-works` |
| `application_category` | schema.org category for the product's JSON-LD. Product variant. | `MultimediaApplication` |

**Optional inputs (`product` variant only):**

| Input | Description | Example |
|---|---|---|
| `include_demo` | Whether to include a Demo section (`yes`/`no`). Default: `no`. | `no` |
| `demo_image_path` | Path to a screenshot for the Demo section. If `include_demo` is `yes` but this is omitted, the section renders the placeholder snippet from [`compliance/snippets/image-placeholder.html`](../../compliance/snippets/image-placeholder.html). | `./assets/demo-library-view.png` |
| `demo_alt` | `alt` text for the Demo image. Required when `demo_image_path` is supplied. Describes what the image *shows*, not a marketing line. | `OffBeatFM library view — three columns showing artists, releases, and a now-playing pane.` |

Images follow the rules in [`$SITES/sections/SHARED-image-rules.md`](../../sections/SHARED-image-rules.md). Never reference an external image host (placehold.co, Unsplash, Cloudinary, etc.) — those break the cookieless posture. If the user describes an image for a forbidden section (Hero, Mission, Principles, Features, Products preview, Status, Contact, Legal footer, Nav), surface the conflict rather than insert it.

**Mission body pattern:**

> *[The dominant category] [two or three specific things it does wrong]. [White pivot — usually "I build the opposite." or "I made something else."] [Positive prescription.]*

### Step 5 — Copy starter files

Copy everything from `$SITES/scaffolding/new-landing-page/starter-files/` into the current directory. Do not overwrite files that already exist unless they are the scaffold's generic placeholders (package.json, astro.config.mjs, robots.txt, README.md).

### Step 6 — Customize boilerplate files

**`package.json`** — replace `"name": "PRODUCT-site"` with the kebab-cased product name (e.g. `"offbeat-fm-site"`). Replace the description TODO.

**`astro.config.mjs`** — replace `"https://TODO.com"` with `"https://<domain>"`.

**`public/robots.txt`** — replace `https://TODO.com` with `https://<domain>`. Leave the allow-all rule and the AI-crawler comment as they are unless the user explicitly asks to block crawlers.

**`public/_headers`** — ships with security headers and the `pages.dev` noindex rules already correct; they need no per-site edit. Resolve the two CSP TODO comments: add the Cloudflare Web Analytics origins only if the user wants analytics, and add the Worker origin to `form-action` if the site has a contact form.

**`src/layouts/Base.astro`** — replace `const SITE_NAME = "TODO"` with `site_name` (defaulting to `product_name`). Leave the rest of the layout alone; it already emits the full metadata contract from [`$SITES/tech/seo.md`](../../tech/seo.md).

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
- Closing line: *"I read everything. I reply to most of it."*

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
- Set `<Base title="..." description="...">` using the product name and tagline. Title pattern: `{Product} — {short descriptor}`, under 60 characters. Description: 140–160 characters, in voice.
- Build the JSON-LD object in the frontmatter and pass it as `jsonLd={jsonLd}`. Use the exact shape for the variant from `$SITES/tech/seo.md` — `Organization` for parent, `SoftwareApplication` with a `publisher` block for product. **Include only properties describing content actually on the page.** Never emit `AggregateRating`, `Review`, `FAQPage`, or an `Offer` with a price the page doesn't state.
- If `og_image_path` was supplied, pass `ogImage="/assets/<filename>"` and `ogImageAlt="<og_image_alt>"`. The layout already emits the image tags, dimensions, and the `summary_large_image` card — do not add head tags by hand. Copy the file into `public/assets/` (kebab-case the filename if needed).
- If `og_image_path` was *not* supplied, leave both props off and add a `// TODO: og image — see sections/SHARED-image-rules.md` comment in the frontmatter. The layout degrades `twitter:card` to `summary` on its own.
- Compose sections in order: Nav → Hero → Mission → (Features) → (Demo) → (ProductsPreview) → (Status) → (Contact) → LegalFooter

Remove the scaffold's commented-out placeholder imports.

### Step 8b — Generate /privacy and /terms

The LegalFooter links `/privacy` and `/terms` on every page. Generate them now — shipping a footer whose links 404 is a defect, not a next step.

**Never write policy prose by hand and never copy it out of `compliance/`.** The pages are rendered by a script from shared bodies so that every Saboteur site stays in sync. Full semantics: `$SITES/compliance/policy-tooling.md`.

1. **Write `policy.config.json`** at the site root, based on `$SITES/compliance/policy.config.example.json`. This file is the site's legal facts, so every value must describe what the site *actually* does:
   - `tokens.site_name`, `site_domain`, `last_updated` (today, ISO) from the inputs already collected.
   - `tokens.contact_email` / `legal_email` — ask if not already known. Do not invent an address.
   - `features.contact_form` — true only if a Contact section was generated.
   - `features.analytics` — true only if an analytics snippet was actually added. Default false.
   - `features.embeds` — true only if a click-to-load embed was generated.
   - `processors` — the real ones. A processor called server-side (the form's email provider) gets `"hosts": []`; see the example config's notes.
   - `allowedHosts` — any domain the page *links* to (the parent mark, a GitHub link). An outbound link is not a data transfer.

2. **Render:**
   ```bash
   node $SITES/scripts/render-policies.mjs --config ./policy.config.json --out ./src/pages
   ```

3. **If the terms fail to render** — the starter config ships Saboteur LLC's real Utah jurisdiction and filed address, so this should not happen. If someone has blanked or placeholdered either value, do **not** invent a replacement. Instead:
   - Render privacy alone: append `--only privacy`.
   - Remove the Terms link from `LegalFooter.astro`, leaving Privacy.
   - Add the two missing facts to the next-steps block in Step 10.

   A missing Terms link is a smaller problem than a link to a 404, and far smaller than published terms naming the wrong court.

4. **Copy `Legal.astro`** into `src/layouts/` from the starter files if Step 5 didn't already. It imports `Nav` and `LegalFooter`, so it only works after Step 7.

5. **Audit** after the first successful build:
   ```bash
   npm run build
   node $SITES/scripts/audit-policy-processors.mjs --config ./policy.config.json --dist ./dist
   ```
   If it reports an undeclared host, resolve it — either the host is a real processor that belongs in the policy, or it's a link that belongs in `allowedHosts`. Do not silence it by deleting the check.

### Step 9 — Verify constraints

Before reporting done, check each item:

- [ ] No `#FFFFFF` in any generated file — only `brand-white` / `#F5F4F0`
- [ ] No `fonts.googleapis.com` reference
- [ ] No `<script>` tags that set cookies or write to `localStorage`
- [ ] Submit button is `bg-brand-red` — not outlined, not `brand-mid`
- [ ] Every section label is plain uppercase text (not `01 — SECTION`)
- [ ] LegalFooter has both Privacy and Terms links — **and both resolve to a generated page.** If terms could not be rendered (missing jurisdiction / mailing address), the Terms link is removed rather than left dangling.
- [ ] `policy.config.json` exists, and every `features` flag matches what was actually generated
- [ ] `src/pages/privacy.md` exists, carries the `GENERATED` banner, and was not hand-edited
- [ ] `audit-policy-processors.mjs` exits 0 against the build
- [ ] `astro.config.mjs` has the correct production URL (not the TODO placeholder)
- [ ] `package.json` name does not contain `PRODUCT`
- [ ] No external image host referenced (placehold.co, picsum.photos, Unsplash, Cloudinary, via.placeholder.com, etc.) — all `<img src>` values point at `/assets/...`
- [ ] No `<img>` in a forbidden section (Nav, Hero, Mission, Principles, Features, ProductsPreview, Status, Contact, LegalFooter)
- [ ] If Demo is included with no supplied image: the placeholder snippet is present with a visible `[ SCREENSHOT · ... ]` caption and a TODO comment above it
- [ ] If Demo is included with a supplied image: the file exists under `public/assets/`, the `<img>` has a real `alt`, and the surrounding `<figure>` uses `border-brand-dim`
- [ ] OG image: either `ogImage` is passed against `/assets/...` with a real `ogImageAlt`, or neither prop is set and a TODO comment is present
- [ ] `Base.astro` has no `SITE_NAME = "TODO"` left
- [ ] `public/robots.txt` and `astro.config.mjs` both carry the real domain — no `TODO.com` anywhere
- [ ] `public/_headers` exists and its two CSP TODO comments have been resolved or deliberately left with the default first-party policy
- [ ] `astro.config.mjs` still registers `sitemap()` — if it were removed, the `Sitemap:` line in `robots.txt` would point at a 404
- [ ] Exactly one `jsonLd` object, matching the variant's shape, with no `AggregateRating` / `Review` / `FAQPage` / `Offer`
- [ ] On a product page, the JSON-LD `publisher` points at `https://saboteur.dev` and the footer's parent mark is a working link to it
- [ ] **Mission, Features, and Principles copy is specific to this product** — no sentence that would read correctly on another Saboteur domain with only the name swapped. This is the doorway-page invariant in `$SITES/tech/seo.md`; violating it risks a site-wide penalty across every Saboteur domain.

Fix any violations before reporting.

### Step 10 — Report

List every file written. Then print the next-steps block:

```
Next steps
──────────
1. npm install && npm run dev — verify locally
2. Replace form action URL with your CF Worker endpoint
3. Confirm privacy@ and legal@ on this domain actually receive mail —
   the privacy policy publishes them as the data-subject request channel
4. Add a 1200x630 OG card at public/assets/og-card.png, then pass
   ogImage + ogImageAlt to <Base> (see tech/seo.md)
5. Run compliance/pre-launch-checklist.md before going live
6. After deploy: verify the domain in Google Search Console, submit
   /sitemap-index.xml, and confirm the *.pages.dev preview returns
   X-Robots-Tag: noindex
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
8. **Site copy is first person singular.** Saboteur is one person — write *I build*, *I read everything*, never the corporate *we*. The plural belongs only in `/privacy` and `/terms` (where the subject is Saboteur LLC as a legal entity) and in sentences naming the company outright. If *I* reads strangely on an interface string, drop the subject rather than reaching for *we*: *Your email is used only to reply.*
9. **Section labels are plain words.** `MISSION`, `PRODUCTS`, `STATUS` — not `01 — MISSION`. Numbered labels belong to documentation pages (like the brand-system reference HTML), not landing pages.
10. **Privacy and Terms links in the footer are required.** Even without cookies, server logs capture IP addresses — GDPR Article 13 disclosure obligations still apply. A footer without these links is non-compliant.
11. **Never reuse copy across Saboteur domains.** The section patterns supply structure, tokens, and voice — never sentences. Each product owns a separate domain, so near-duplicate Mission or Features paragraphs across them are the doorway-page pattern, and the resulting penalty is site-wide rather than per-page. If a paragraph would read correctly on another Saboteur domain with only the product name swapped, rewrite it around what this product specifically does. See `$SITES/tech/seo.md`.
12. **Structured data describes only visible content.** JSON-LD may state what a visitor can see on the page and nothing more. Fabricated ratings, reviews, FAQs, or prices are the most common cause of a search manual action.
