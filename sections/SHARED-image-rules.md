# Image rules — cross-section

Where images are allowed on a Saboteur site, how they present, and what generation should produce when no real asset exists yet. This file is the single source the generate skill loads for any image decision.

The Saboteur design language is typography-driven. Most surfaces stay text-only by rule; the table below is the exhaustive list of where an image can live.

## Image-appropriate surfaces

| Surface | When | Asset type | Presentation |
|---|---|---|---|
| Demo section | Product page only, when a screenshot materially helps a visitor understand the product surface. Skip on pre-launch products with no real UI. | Static raster (PNG / WebP). | Full-width, `max-width: 100%`, hairline border `border-brand-dim`. See [`../sites/landing-page/optional-sections.md`](../sites/landing-page/optional-sections.md) §Demo. |
| OG / social card | Every page that wants a respectable social embed. | Static raster (PNG / JPG / WebP), 1200×630. | Set via `<meta property="og:image">`. Not visible on the page itself. |
| Favicon | Every page. | SVG preferred (`favicon.svg`); 32×32 PNG fallback only if a build target needs it. | `<link rel="icon">` in the head. |

That is the complete list. No other surface on any current section accepts an image.

## Forbidden surfaces

These sections are typography-only by brand rule. Generation must never insert an `<img>`, background image, decorative SVG, or icon glyph into them.

| Section | Why |
|---|---|
| Nav | Mark is text; nav links are mono text. No icon glyphs. |
| Hero | "No background imagery." Background is flat `brand-black`. The mark is typographic. |
| Mission | Section grid with typography; no visual furniture. |
| Principles | "No icons." Red number + headline + body, that is the whole element. |
| Features | "No icons, no cards, no columns." Hairline-ruled rows. |
| Products preview | "No screenshots, no product photography." The wordmark IS the mark — display-font typography rendered inline, not an asset. |
| Status | Stage badges are text. The dot is a colored circle, not an icon. |
| Contact | Form-only. |
| Legal footer | Text-only. |

If a section gets so flat that an image feels needed to break it up, the answer is **shorter copy**, not an image.

## Presentation types

The four patterns that are feasible under the brand rules.

### 1. Static raster image

For Demo and OG. PNG or WebP. No GIF, no autoplay video.

```html
<img src="/assets/demo-library-view.png"
     alt="OffBeatFM library view — three columns showing artists, releases, and a now-playing pane."
     class="w-full border border-brand-dim" />
```

- Self-host. Files go under the generated site's `public/assets/`.
- Always set a meaningful `alt`. The alt names what the image *shows*; it is not a caption and not a marketing line.
- Hairline `border-brand-dim` for the visible-on-page case (Demo). OG doesn't need styling — it's never rendered on the page.
- Provide a `@2x` variant via `srcset` for any image that displays wider than ~600px.

### 2. Inline SVG

For favicon, the `員` avatar glyph, and any future product mark that earns its place. Vector, hand-authored or exported clean.

- Optimize with SVGO before committing (strip metadata, hidden layers, default attrs).
- No `<script>` inside the SVG.
- Color via `currentColor` or a brand token. Never hardcoded hex.
- Prefer inline SVG over `<img src="...svg">` when the SVG needs to respond to color tokens.

### 3. Image placeholder

For generation-time stand-ins when no real asset exists. Snippet: [`../compliance/snippets/image-placeholder.html`](../compliance/snippets/image-placeholder.html).

The placeholder reads as a hairline-bordered block with a mono caption naming the asset type and the intended pixel dimensions (e.g., `[ SCREENSHOT · 1440×900 ]`). On replacement, the maintainer swaps the `<figure>` for an `<img>` and the dimensions are already documented inline.

Use the placeholder whenever generation runs without a supplied asset. Do not invent a filename and reference a file that does not exist — a broken `<img>` is harder to notice in review than an obviously labeled placeholder.

### 4. Click-to-load embed *(not strictly an image)*

If a product page genuinely needs a third-party media embed (Vimeo, YouTube, Loom), the click-to-load wrapper at [`../compliance/snippets/click-to-load-embed.html`](../compliance/snippets/click-to-load-embed.html) is the only permitted form. See [`../compliance/third-party-embeds.md`](../compliance/third-party-embeds.md) for the full rule.

## Asset conventions

- All raster assets live under `public/assets/` in the generated site. Astro does not process them — they ship as-is.
- Filenames are kebab-case and descriptive: `demo-library-view.png`, not `image1.png`.
- Maximum file size: 200 KB per image. Run through `cwebp -q 80` or equivalent before committing. Larger images usually signal the image is doing too much work.
- OG image: exactly 1200×630, under 300 KB. Filename `og-card.png` or `og-<product>.png`.

## What to never do

- **Never reference an external host.** Not Unsplash, not placehold.co, not Cloudinary, not Imgix, not a CDN that isn't your own origin. Every byte on the page loads from the site's own origin. This is the cookieless rule, restated.
- **Never `<img>` something that should be CSS.** A red hairline rule is `border-brand-red`, not a 1px PNG. A divider is `border-t`, not an illustration.
- **Never include decorative imagery.** If you can't write a useful `alt` for it, it doesn't belong on a Saboteur page.
- **Never autoplay video.** Static screenshot or click-to-load embed. Nothing else.
- **Never use stock photography.** The brand has no people-on-laptops photos, no abstract gradients, no UI mock-ups of products that don't exist.

## Generation behavior

When the generate skill produces a page:

1. If the user supplied a real asset path, write an `<img>` against that path.
2. If the user did not supply an asset but the section needs one (Demo, OG card), render the placeholder snippet with the appropriate aspect and label.
3. If the section is on the forbidden list above, never insert an image even if the user describes one — surface the conflict instead and ask whether the content belongs in a Demo section.
4. Always write a real `alt` from the supplied content. If no alt can be derived, surface the gap rather than ship a hollow `alt=""` or a marketing line in the alt slot.

Placeholders are intentionally plain so they are impossible to mistake for a finished image in a rendered preview. The first thing the maintainer does after generation is replace placeholders with real assets.
