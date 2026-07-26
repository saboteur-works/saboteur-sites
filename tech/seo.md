# SEO

How a Saboteur page gets found, and what would get it suppressed.

The honest starting point: a single-page site with four hundred words of deliberately terse, marketing-verb-free copy will rank for its own name and very little else. That is arithmetic, not a flaw in the voice rules. So this doc splits into two jobs that are genuinely different:

1. **Own the brand queries.** Someone types *offbeat fm* or *saboteur llc* and lands on the right page, with the right entity attached to it. This is cheap, permanent, and entirely compatible with the brand constraints.
2. **Earn non-brand traffic.** This needs a content surface — a changelog, a handful of real engineering posts. It cannot be bought by rewriting the hero. Attempting it there produces exactly the SaaS-template voice the brand rejects, *and* underperforms.

Everything below serves job 1 by default. Job 2 is a deliberate project, covered at the end.

---

## The metadata contract

`Base.astro` in the scaffold emits all of this. Do not hand-roll head tags in a page — pass props to the layout so every page stays consistent.

| Tag | Rule |
|---|---|
| `<title>` | `{Product or page} — {short descriptor}`. Under 60 characters or Google truncates it. The product name comes first: it's the query being won. |
| `<meta name="description">` | 140–160 characters, in brand voice, one or two declarative sentences. Not a ranking factor; it *is* the snippet a human decides on. Write it as the page's opening line, not a keyword list. |
| `<link rel="canonical">` | Absolute, per-page, always on the production origin. Built from `Astro.url.pathname`, never `Astro.site` alone. |
| `og:site_name` | The site's name as a person says it (`OffBeat-FM`), not the domain. |
| `og:title` / `og:description` | Mirror `<title>` and the meta description. |
| `og:url` | The canonical, same value. |
| `og:type` | `website` for a landing page, `article` for a post. |
| `og:image` | Self-hosted, 1200×630, under `/assets/`. Never a third-party image host — that breaks the cookieless posture (see [`../compliance/cookieless-by-default.md`](../compliance/cookieless-by-default.md)). |
| `og:image:alt` | Required whenever `og:image` is set. |
| `twitter:card` | `summary_large_image` **only if** an image exists; otherwise `summary`. Claiming a large image with no image renders a broken embed. |
| `theme-color` | `#0A0A0A`. The one place a hex literal is allowed in markup — meta `content` can't read a CSS token. Section 3 of the pre-launch checklist has an explicit carve-out for it. |

### Title patterns by variant

| Page | Title |
|---|---|
| Parent | `Saboteur — Creator-first software` |
| Product | `OffBeat-FM — Independent music discovery` |
| Privacy | `Privacy — OffBeat-FM` |
| Terms | `Terms — OffBeat-FM` |
| 404 | `Not found — OffBeat-FM` |

Legal and utility pages put the page name first because the product name is already established by the time someone is on them.

---

## Structured data

One JSON-LD block per page, passed to `Base.astro` as the `jsonLd` prop. Two shapes cover every current page.

### Parent variant — `Organization`

This is the load-bearing one. `sameAs` is the signal that ties the products' separate domains back to a single publisher; without it, search engines have no reason to connect them.

```js
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Saboteur LLC",
  alternateName: "Saboteur",
  url: "https://saboteur.dev",
  description: "…same sentence as the meta description…",
  sameAs: ["https://github.com/saboteur-works"],
};
```

Add every profile that genuinely belongs to the entity to `sameAs` — GitHub org, and any social account actually in use. Do not list profiles that don't exist.

### Product variant — `SoftwareApplication`

```js
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OffBeat-FM",
  description: "…same sentence as the meta description…",
  url: "https://offbeat-fm.com",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  publisher: {
    "@type": "Organization",
    name: "Saboteur LLC",
    url: "https://saboteur.dev",
  },
};
```

The nested `publisher` is the other half of the entity link. Every product page carries it.

### The rule that keeps this safe

**Structured data may only describe what a visitor can see on the page.** That single rule is what separates legitimate markup from the most common cause of a manual action.

Specifically, never emit:

- `AggregateRating` or `Review` — there are no reviews on a Saboteur landing page.
- `FAQPage` — unless the questions and answers are literally rendered in the markup.
- `Offer` with a price the page doesn't state.
- `Event`, `Product`, or `Recipe` on a page that is none of those things.

A pre-launch product is `SoftwareApplication` with no `offers` block. It is not a `Product` with a fabricated availability.

Validate before launch at [validator.schema.org](https://validator.schema.org) and Google's Rich Results Test.

---

## Crawling and indexing

### `robots.txt`

Allow everything. The scaffold ships that. Disallow is for surfaces that genuinely shouldn't be indexed, and a landing page has none.

The `Sitemap:` line must point at a file that exists. `@astrojs/sitemap` is in the starter deps and emits `/sitemap-index.xml` — if the integration is ever removed from `astro.config.mjs`, remove the `Sitemap:` line with it. A robots.txt advertising a 404 is worse than no sitemap.

**AI crawlers** (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`) are allowed by default. A Saboteur page is a public statement of what a product is; being quotable by an assistant is distribution, not leakage. Blocking them is a legitimate per-site decision — make it explicitly, and note the reason in the site's README rather than letting it drift in silently.

### Preview deploys

Cloudflare Pages serves every branch and every commit at a `*.pages.dev` hostname. Those are near-exact duplicates of production and will compete with it if indexed. Two defenses, both already in the scaffold:

1. `public/_headers` sets `X-Robots-Tag: noindex, nofollow` on the `pages.dev` hostnames. Two match lines are required — a `_headers` placeholder stops at a period, so `:project.pages.dev` and `:alias.:project.pages.dev` are separate patterns.
2. The canonical is built from `Astro.site`, so even an indexed preview points at production.

Never remove either without replacing it.

### Per-page `noindex`

`Base.astro` takes a `noindex` prop. Use it on form thank-you pages and the 404. Not on anything else — a landing page with fewer than a dozen URLs has nothing worth hiding.

---

## What would get a page suppressed

Ranked by how easy it is to hit *from this architecture specifically*, not by how common it is in general.

### 1. Doorway pages — the real risk here

Each product gets its own domain, and every page is composed from the same section templates in [`../sections/`](../sections/). That makes it very easy to end up with three domains carrying the same mission paragraph with the product name swapped. That is the textbook doorway pattern, and it's a site-wide penalty, not a per-page one.

**The invariant:** every domain's Mission, Principles, and Features copy must be *substantively about that product*. Not a rephrasing. If a paragraph would read correctly on two Saboteur domains with only the noun changed, it is not finished.

The shared layer is structure, tokens, and voice. It is never sentences.

### 2. Hidden text

The palette is near-black on near-black by design. Any text set close to `brand-black` on `brand-black`, any `display: none` block "for keywords", any 0-opacity copy — all of it reads as cloaking to an automated check, regardless of intent. The accessibility contrast rules in [`../compliance/accessibility.md`](../compliance/accessibility.md) already forbid this; it has an SEO consequence too.

### 3. Fabricated structured data

Covered above. The single rule: markup describes only visible content.

### 4. Keyword stuffing

Not a live risk given the voice rules — *no marketing verbs, no SaaS-template phrasing* rules this out by construction. Noted because the pressure to "add keywords to the hero" is where it would enter. The answer to that pressure is a content surface, not a denser hero.

### 5. Link schemes

No paid links, no reciprocal-link arrangements, no directory submissions. Products linking to each other through the parent page is normal internal linking between properties of one owner and is fine — it's disclosed by the shared `Organization` markup.

### 6. Scaled content generation

Publishing volumes of low-value generated pages to catch long-tail queries. Not currently on the table, and the content-surface guidance below is deliberately narrow to keep it that way.

---

## Entity signals — the checklist that actually moves brand queries

These matter more than any on-page tweak for a site this small:

- [ ] `Organization` JSON-LD on the parent page, with accurate `sameAs`.
- [ ] `publisher` block on every product page pointing at `https://saboteur.dev`.
- [ ] The reduced parent mark in each product page's footer is a **link** to `saboteur.dev`, not a static image. Required by [`../sites/landing-page/required-sections.md`](../sites/landing-page/required-sections.md) to be present; make it clickable.
- [ ] The parent page's Products preview links out to each live product domain.
- [ ] Legal entity name written identically everywhere: `Saboteur LLC`.
- [ ] One contact email, consistent across every site's privacy policy.
- [ ] `www` → apex redirect in place, one hostname serving the site.

The bidirectional parent↔product links plus consistent `Organization` markup are what let search engines treat the domains as one entity rather than seven unrelated sites.

---

## The domain question

Each product currently gets its own domain ([`stack.md`](stack.md), [`../sites/landing-page/README.md`](../sites/landing-page/README.md) both note this may consolidate later). It's worth deciding deliberately, because the SEO cost is real and asymmetric:

**Separate domains** — every new product starts from zero authority and needs its own backlinks. Clean brand separation. Migration later costs redirects and a temporary ranking dip.

**Subfolders** (`saboteur.dev/offbeat-fm`) — every product inherits the parent's accumulated authority immediately. Weaker standalone brand presence. Cheaper by a wide margin for a small portfolio.

For a portfolio this size, subfolders would rank better, sooner. Separate domains are the right call only if each product is meant to stand fully apart from Saboteur as a brand. This is a positioning decision with an SEO price tag, not an SEO decision — but the price should be known before more domains are bought.

---

## Earning non-brand traffic

If and when this is wanted, the mechanism is a content surface, not landing-page changes.

Astro content collections are already in the stack. The minimum viable version:

- `/changelog` — real release notes, one entry per shipped change. Low effort, genuinely useful, and gives search engines a reason to crawl regularly.
- `/writing` — occasional posts about problems actually solved building the products. Ten good posts beat a hundred thin ones, and thin ones are an active liability under the scaled-content rules above.

Both use the same `Base.astro` with `ogType="article"`, and both get picked up by the sitemap automatically. Neither changes the landing page.

Voice rules apply unchanged. A post that reads like content marketing has failed twice over.

---

## Verification

Section 11 of [`../compliance/pre-launch-checklist.md`](../compliance/pre-launch-checklist.md) is the gate. The checks that are easy to get wrong:

```bash
npm run build

# Canonicals must differ per page and point at the production origin.
grep -r 'rel="canonical"' dist/

# The sitemap robots.txt advertises must exist.
test -f dist/sitemap-index.xml && echo ok

# No third-party image or font host anywhere in the output.
grep -rE 'og:image[^>]*(placehold|unsplash|cloudinary)|fonts\.(googleapis|gstatic)' dist/ || echo clean
```

Then, post-deploy: verify the property in Google Search Console, submit the sitemap, and check that the preview `*.pages.dev` URL returns `X-Robots-Tag: noindex` (`curl -sI https://<project>.pages.dev/ | grep -i robots`).
