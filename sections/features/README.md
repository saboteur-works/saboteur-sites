# Features

A short list of plain declarative statements about what the product does. **Optional**, used on product landing pages as the primary differentiator. The parent / sub-brand page does not have a features section — products are introduced via [`../products-preview/`](../products-preview/).

## Purpose

Tell the visitor what the product actually *is*, in three to five sentences they can read in ten seconds. The brand voice is honest and concrete; the features section is where that voice does its most direct work. No icons, no cards, no columns — hairline-ruled rows of prose carry the weight.

## Variants

| File | When to use |
|---|---|
| [`example.html`](example.html) | Default. Section grid + 3–5 hairline-ruled rows. Label is `FEATURES` or a product-specific equivalent. |

## Anatomy

Standard section grid (140px label + 1fr). The right column is a vertical list of rows separated by hairline rules — same row mechanics as [`../principles/`](../principles/), minus the red number.

```
┌──────────────────────────────────────────────────────────────────┐
│  FEATURES     ──────────────────────────────────────────────     │
│               Your library lives on disk. No sync required.      │
│               ──────────────────────────────────────────────     │
│               Plays anything with a URL. No accounts, no DRM.    │
│               ──────────────────────────────────────────────     │
│               One window. Search, queue, playback, nothing else. │
│               ──────────────────────────────────────────────     │
└──────────────────────────────────────────────────────────────────┘
```

### Section label

- Default reads `FEATURES`. Product-specific equivalents are allowed when they read more honestly: `HOW IT WORKS`, `WHAT'S INSIDE`, `WHAT IT DOES`. The label is still mono `10px` tracking `0.2em` uppercase — only the word changes.
- Don't use marketing labels: no `WHY YOU'LL LOVE IT`, no `BENEFITS`, no `KEY FEATURES ★`.

### Row

- **Layout** — single flex/block row. Top hairline rule on every row; bottom rule on the last row only. `py-[13px]` for vertical padding. No prefix glyph, no number, no icon.
- **Type** — `font-sans text-[13px] leading-[1.6] text-fg-secondary`. Matches the row scale used by [`../principles/`](../principles/) so the page rhythm stays consistent across hairline-ruled lists.
- **Bold lift (optional)** — the first clause may be promoted to `font-bold text-fg-primary` to give the row a structural anchor, exactly like Principles. Use the lift consistently — either all rows have it or none. Mixed rows read as inconsistent emphasis.
- **No links inside a row.** A feature row is a statement, not a navigation surface. Deeper detail belongs on a sub-page or in the product itself.

## Rules

1. **Three to five rows.** Fewer than three and the section doesn't earn its keep — fold the content into Mission. More than five and the section becomes a feature dump — pick the differentiators and drop the rest.
2. **Plain declarative statements.** Each row is a sentence (or two short sentences). Subject + verb + thing. *"Your library lives on disk. No sync required."* Not *"Local-first storage"* (too terse — that's a tag chip) and not a paragraph (too long — that's Mission).
3. **No marketing verbs.** No *unleash*, *supercharge*, *delight*, *empower*, *transform*, *revolutionize*. No exclamation marks. No emoji. If the row reads like an App Store screenshot caption, rewrite it.
4. **No bullets, no icons, no cards, no columns.** Hairline-ruled rows are the layout. The structural discipline is the point.
5. **Each row fits one line (two at narrow widths).** If a row needs three lines on desktop, it's not a feature — it's a tenet. Move it to Principles or rewrite it shorter.
6. **No links from this section.** It's a description, not a nav surface. (Restated for emphasis — the urge to link is strongest here.)
7. **Features sits between Mission and Demo on a product page.** When there's no Demo, Features sits between Mission and Status / Contact. The parent / sub-brand page does not include Features.

## Copy patterns

Good — concrete, specific, voiced:

> *Your library lives on disk. No sync required.*

> *Plays anything with a URL. No accounts, no DRM.*

> *Local file tree on the left, prose on the right.*

> *Revisions are git commits, not opaque autosaves.*

Avoid — vague, marketing-toned, or feature-list-ish:

> *Beautifully designed for focus.*

> *Powerful tools to supercharge your workflow.*

> *Cloud sync across all your devices ✨*

> *Local-first* — *(too terse; this is a tag chip, not a feature row)*

> *Built with creators in mind.*

If a feature row could appear on any product's marketing page with a search-and-replace, it's not specific enough. The good rows above only make sense for the product they describe.
