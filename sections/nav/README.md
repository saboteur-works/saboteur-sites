# Nav

The top navigation strip. **Required** on every Saboteur landing page.

## Purpose

Identify the site (mark, left-aligned) and link to the page's other sections or to related sites. Nav on a Saboteur landing page is intentionally sparse: 2–4 mono uppercase links in `brand-mid`, no dropdowns, no prominent CTA button. The mark is the focal point; the links are quiet.

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
- **Mark (left).** Reduced mark — wordmark + Japanese inline. Wordmark is condensed bold 17px in white; Japanese is sans bold 10px in `brand-mid`. 3px red bar to the left.
- **Links (right).** Mono uppercase, 10px, `text-brand-mid` (mid grey), `hover:text-brand-white`. Letter-spacing `0.14em`. 20px gap between links.

## Rules

1. **No dropdowns.** A landing-page nav with a dropdown has outgrown the format.
2. **Links are mid grey, not white.** White-on-hover. This keeps the nav quiet by default and makes hover legible without being loud.
3. **Japanese in the mark is mid grey too.** In the *hero* mark the Japanese is white; in the *nav* mark it's reduced to mid. The descriptor tier is dropped entirely from the nav.
4. **Mark is always a link to `/`.** Even on a single-page landing site.
5. **At most one button.** A small outlined mono button (10px, `brand-white` text, `brand-dim` border, `padding: 6px 12px`) is permitted at the right end of the links when the page has one obvious next action. Use sparingly — most Saboteur landing pages skip it.
6. **Mobile.** The minimal variant assumes few enough links to fit on a phone without a hamburger. Below ~600px width, swap to a hamburger that opens a vertical menu styled identically (mono uppercase, hairline rules between items).

## Copy patterns

Link labels are short, uppercase mono, no industry jargon. Live examples:

- `MISSION`
- `PRODUCTS`
- `GET IN TOUCH`

Avoid: `SOLUTIONS`, `RESOURCES`, `PLATFORM`, `WHY US`, `FEATURES`.
