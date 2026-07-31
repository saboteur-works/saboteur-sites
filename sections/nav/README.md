# Nav

The top navigation strip. **Required** on every Saboteur landing page.

## Purpose

Identify the site (mark, left-aligned) and link to the page's other sections or to related sites. Nav on a Saboteur landing page is intentionally sparse: 2–4 mono uppercase links in `fg-tertiary`, no dropdowns, no prominent CTA button. The mark is the focal point; the links are quiet.

## Variants

| File | When to use |
|---|---|
| [`variant-minimal.html`](variant-minimal.html) | Default. One mark, 2–4 text links. Works for both product and parent landing pages — swap the mark to match the tier. |

Additional variants (with a prominent outlined CTA button, with breadcrumbs, etc.) get added only when a real page needs them.

## Anatomy

```
┌────────────────────────────────────────────────────────────────────┐
│  │ SABOTEUR サボタージ員                    MISSION · PRODUCTS · …  │   52px tall
└────────────────────────────────────────────────────────────────────┘
       └─ red bar (3px)                       └─ font-mono, 10px, mid, uppercase
```

- **Height: 52px.** Tight. The nav is a label strip, not a section.
- **Sticky.** `position: sticky; top: 0;` so it stays available on scroll.
- **Mark (left).** Reduced mark — wordmark + Japanese inline. Both tiers use `fg-primary` — the mark is a single identity unit. 3px red bar to the left.
- **Links (right).** Mono uppercase, 10px, `text-fg-tertiary`, `hover:text-fg-primary`. Letter-spacing `0.14em`. 20px gap between links.

## Two kinds of link

The nav mixes two things that look identical and behave differently:

| Kind | Example | Where it works |
|---|---|---|
| **Section anchor** | `#mission`, `#contact` | The landing page only — the anchor has to exist |
| **Site route** | `/blog`, `/changelog` | Every page |

`Nav.astro` takes `showSections`, defaulting to true. It means **"render the anchor links"**, not "render any links". A standalone page — `/privacy`, `/terms`, a post, the 404 — passes `showSections={false}`, which drops the anchors and keeps the routes. Shipping `#mission` on `/privacy` puts a control on the page that looks live and does nothing; dropping `/blog` there strands the reader with only the mark to get back.

Sites with no content surfaces have no route links, and `showSections={false}` leaves the mark alone — which is the original behaviour, unchanged.

## Rules

1. **No dropdowns.** A landing-page nav with a dropdown has outgrown the format.
2. **Links are fg-tertiary, not fg-primary.** `fg-primary`-on-hover. This keeps the nav quiet by default and makes hover legible without being loud.
3. **Japanese in the mark uses fg-primary.** Both wordmark and Japanese are fg-primary in the nav — the mark is treated as a single unit. The descriptor tier is dropped entirely from the nav.
4. **Mark is always a link to `/`.** Even on a single-page landing site.
5. **At most one button.** A small outlined mono button (10px, `fg-primary` text, `brand-dim` border, `padding: 6px 12px`) is permitted at the right end of the links when the page has one obvious next action. Use sparingly — most Saboteur landing pages skip it.
6. **Mobile.** The minimal variant assumes few enough links to fit on a phone without a hamburger. Below ~600px width, swap to a hamburger that opens a vertical menu styled identically (mono uppercase, hairline rules between items).
7. **Four links maximum.** Anchors and routes counted together. This is what keeps rule 6 true — five mono links at 0.14em tracking overflow a 375px viewport, and the fix is fewer links, not a hamburger. A nav that wants a fifth link is a page that has outgrown the landing-page format.

## Copy patterns

Link labels are short, uppercase mono, no industry jargon. Live examples:

- `MISSION`
- `PRODUCTS`
- `GET IN TOUCH`
- `BLOG`
- `CHANGELOG`

Avoid: `SOLUTIONS`, `RESOURCES`, `PLATFORM`, `WHY US`, `FEATURES`. Also avoid `WRITING`, `NOTES`, `JOURNAL` for the blog — the route is `/blog` and the label should match it. A reader guessing a URL guesses `/blog`.

**Four links is the ceiling** (rule 7 below). A parent page with both surfaces is already there: `MISSION · BLOG · CHANGELOG · GET IN TOUCH`. If a fifth is wanted, drop `MISSION` — the hero sits directly above it, and no one has ever needed a link to scroll one screen.
