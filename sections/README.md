# Sections

Reusable, framework-agnostic **HTML section snippets** — the smallest composable units of a Saboteur web property. A landing page is assembled from sections; a section is assembled from the brand tokens.

Sections in this directory are written as plain HTML (using brand-token classes like `bg-brand-black`, `font-display`, `tracking-wordmark`). They are *reference material*, not literal include files. A generated Astro site translates them into `.astro` components; a pure-HTML site can paste them verbatim. The canonical form stays framework-agnostic so an agent generating in any stack can use them.

## Current layout

```
sections/
├── README.md                  (this file)
├── nav/                       Required. 52px sticky strip, sparse mono uppercase links.
├── hero/                      Required. Mark + one-paragraph three-clause body.
├── mission/                   Required. Section grid + one paragraph + optional nested tenets.
├── principles/                Optional. Numbered tenets list (typically nested inside Mission).
├── products-preview/          Optional. Parent / sub-brand pages only. 2-up product cards.
├── features/                  Optional. Product pages only. 3–5 hairline-ruled prose rows.
├── demo/                      Optional. Product pages only. Single static screenshot.
├── status/                    Optional. Honest project/product stage list.
├── contact/                   Optional. Form posting to a CF Worker (see compliance/forms.md).
└── legal-footer/              Required. Compact sign-off + Privacy/Terms links.
```

Future sections (added only when a real page needs them):

- `pricing/` — pricing card grid for products that have pricing.
- `faq/` — short Q&A.

## Rules every section follows

1. **Token-only styling.** Colors come from `--color-brand-*`, fonts from `--font-*`, spacing from `--spacing-*`. No hex literals in section markup. No ad-hoc font stacks.
2. **Left-aligned by default.** Center alignment is a deliberate, documented exception (inverted blocks).
3. **No `#FFFFFF`.** White is `--color-brand-white` (`#F5F4F0`).
4. **Red marks structure or active state.** Never used as decorative fill in a section.
5. **No external network requests on render.** No Google Fonts, no third-party embeds without the click-to-load wrapper. See [`../compliance/cookieless-by-default.md`](../compliance/cookieless-by-default.md).
6. **Self-contained and self-explanatory.** Each section's `README.md` describes purpose, when to use, variants, and the copy patterns that fit the brand voice.

## Phase 1 status

Empty. Sections get built in Phase 2 — starting with the four required (nav, hero, mission, legal-footer), then the optional ones used by `saboteur.dev`.
