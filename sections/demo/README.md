# Demo

A single static screenshot of the product's actual surface. **Optional**, used on a product landing page when an image materially helps a visitor picture what the product is.

## Purpose

Show the product. One screenshot, large enough to read, with a hairline border so it sits inside the page's typographic grid instead of floating over it. The Demo section is the only place on a product landing page where a screenshot is allowed — see [`../SHARED-image-rules.md`](../SHARED-image-rules.md) for the full image policy.

## Variants

| File | When to use |
|---|---|
| [`example.html`](example.html) | Default. Section grid + full-width image (or placeholder during generation). |

A click-to-load embed variant (for Vimeo / YouTube / Loom) is described in [`../../sites/landing-page/optional-sections.md`](../../sites/landing-page/optional-sections.md) §Demo and the wrapper lives at [`../../compliance/snippets/click-to-load-embed.html`](../../compliance/snippets/click-to-load-embed.html). It does not have a dedicated example file yet — add one when a real product needs it.

## Anatomy

Standard section grid (140px label + 1fr). The right column is one image at `aspect-[16/9]` with `max-width: 100%` and `border border-brand-dim`. No carousel, no caption above, no decorative chrome.

```
┌──────────────────────────────────────────────────────────────────┐
│  DEMO         ┌────────────────────────────────────────────┐    │
│               │                                            │    │
│               │            [ SCREENSHOT · 16/9 ]           │    │
│               │                                            │    │
│               └────────────────────────────────────────────┘    │
│               OffBeat-FM library view.  ← optional figcaption   │
└──────────────────────────────────────────────────────────────────┘
```

### Image

- **Aspect ratio** — `16/9` by default (matches product UI screenshots and the placeholder). `4/3` is allowed for older / narrower captures. Don't go portrait; the section grid is wide.
- **Border** — hairline `border border-brand-dim`. No shadow, no rounded corners, no frame chrome.
- **Width** — fills the right column (`w-full`, capped by the section's `max-w-2xl`-equivalent if used on a product page; the example below leaves it uncapped to fill the column).
- **Self-hosted** — under `public/assets/`. Never reference an external host. See [`../SHARED-image-rules.md`](../SHARED-image-rules.md) §"What to never do".
- **Alt text** — required. Names what the image *shows*, not what the product *does*. "OffBeat-FM library view — three columns showing artists, releases, and a now-playing pane." Not "Discover music you'll love."
- **`@2x` variant** — provide via `srcset` for any image that displays wider than ~600px.

### Caption (optional)

A single line below the image, inside the `<figure>`, as a `<figcaption>`. Use it when the screenshot needs framing beyond the alt text — e.g., to name the view the visitor is looking at when the product has multiple surfaces.

- **Style** — `font-mono text-[10px] tracking-[0.2em] text-fg-tertiary uppercase` with `mt-3`.
- **Copy** — names the surface in flat language. *"Library view. Three columns."* Not *"See how it all comes together!"*.
- **Default is no caption.** Add one only if the image needs labeling. The section header already says DEMO; the alt text already describes the image; the caption is for *naming the view*, not for selling it.

### Placeholder

When generation runs without a real asset, drop in [`../../compliance/snippets/image-placeholder.html`](../../compliance/snippets/image-placeholder.html) at `aspect-[16/9]` with a label like `[ SCREENSHOT · 1440×810 ]`. The placeholder reads as a hairline-bordered block with a mono caption — impossible to mistake for a finished image in review.

## Rules

1. **One image, never a carousel or gallery.** If you find yourself wanting three screenshots, the Features section is the right tool — three plain-prose feature rows usually carry more weight than three thumbnails.
2. **Static raster only.** PNG or WebP. No autoplay video. No animated GIF. Any video belongs behind the click-to-load wrapper (see Variants above).
3. **No decorative imagery.** If the alt text can't honestly describe a product surface, the image doesn't belong here. Stock photography, abstract gradients, people-on-laptops — none of it is on a Saboteur page.
4. **Skip the section on pre-launch products with no real UI.** A placeholder shipped to production is dishonest; it's better to omit the section than to ship `[ SCREENSHOT · 1440×810 ]` to a visitor. The Status section carries the "pre-production" signal instead.
5. **Skip the section if Mission and Features already carry the weight.** A typography-driven page often doesn't need a screenshot at all. The visitor already knows what the product is from the prose. Add Demo when the surface is genuinely the differentiator (e.g., a writing app where the layout matters), not by default.
6. **Demo sits after Features, before Status / Contact.** On a product page without a Features section, Demo sits directly after Mission.

## Copy patterns

There is almost no copy in this section. The label is `DEMO`. The image carries the meaning. The figcaption (optional) is one line naming the view.

Good:

> *Library view. Three columns: artists, releases, now-playing.*

> *Editor surface. Local file tree on the left, prose on the right.*

Avoid:

> *See how it all comes together!*

> *A clean, modern interface designed for focus.*

> *Built with creators in mind.*

If the caption is doing more work than naming the view, it's drifting into marketing copy. Cut it back to a noun phrase.
