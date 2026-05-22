# Products preview

A short intro line followed by side-by-side product cards. **Optional**, and used only on the parent / sub-brand landing page where multiple products need previewing.

## Purpose

Introduce the products that belong to Saboteur LLC (parent page) or a sub-brand (SAB/works, SAB/labs landing pages) without going deeper than a single card per product. Each card is a tiny landing page: a mark, a descriptor, a body paragraph, tag chips, and one action.

A product's *own* landing page does not include this section — its own page is the deep treatment.

## Variants

| File | When to use |
|---|---|
| [`example.html`](example.html) | Default. Section intro + 2-up product card grid. Matches the live `saboteur.dev`. |

## Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│  PRODUCTS    Two products. Same philosophy. Different audiences. │   section-inner
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│ │ OffBeatFM           │  │ │ GetWrite           │
│ │ ─────────           │  │ │ ────────           │       full-width product-grid
│ │ INDEPENDENT MUSIC … │  │ │ LOCAL-FIRST WRIT…  │
│                       │  │                      │
│ Music discovery for … │  │ A writing environ… │
│ No algorithms. No     │  │ Local-first. …       │
│ editorial committees. │  │                      │
│                       │  │                      │
│ [INDEPENDENT] [DISC…] │  │ [LOCAL-FIRST] [LO…]  │
│                       │  │                      │
│ [LEARN MORE →]        │  │ [COMING SOON]        │
└──────────────────────┘  └──────────────────────┘
```

The intro line uses the standard section grid (140px label + 1fr content). The product card grid sits below the section-inner and spans the full section width.

### Card

- Background: `bg-brand-surface` (`#111110`).
- Padding: `36px 28px 32px` (use `p-9` or arbitrary).
- Cards separated by **2px gaps** with `bg-brand-rule` showing through (`gap-[2px] bg-brand-rule` on the grid).
- **Mark** — 3px red bar, `pl-4`. Wordmark in display 700, `clamp(24px, 5vw, 36px)`. Mono descriptor below, `9px`, `brand-mid`, tracking `0.16em`, with hairline top rule. **On the parent page, the descriptor's domain is the sub-brand (e.g., `— SAB/works`), not the product domain.**
- **Body** — sans 13px, leading `1.8`, `brand-mid`. The middle clause is lifted to `brand-white` via `<em class="not-italic">`.
- **Tags** — `9px` mono uppercase, tracking `0.12em`, `brand-mid`, hairline border `border-brand-dim`. Padding `3px 7px`. 5px gap between tags.
- **Action** — outlined mono button. 10px tracking `0.14em` uppercase. Border `brand-dim`, padding `8px 14px`. `hover:text-brand-white hover:border-brand-mid`. For pre-launch products, the button reads `Coming Soon` and is disabled.

## Rules

1. **Sub-brand attribution on the parent page.** On `saboteur.dev`, product descriptors end with `— SAB/works` or `— SAB/labs`, **not** the product's own domain. On a product's own page, the hero's descriptor uses the product domain. The descriptor's suffix is the *attribution context*.
2. **One action per card.** Either a `Learn more →` link to the product site (live products) or a disabled `Coming Soon` button (pre-launch).
3. **Cards are visual peers.** Both cards same size, same column. Don't size-vary to signal hierarchy — the live product reads as "live" via its action, not via card size.
4. **Two to three tags per card.** More than three reads like a feature list; tags should pick out a *posture* (independent, local-first, no algorithms) not a feature dump.
5. **Tag labels are nouns or compound nouns, not sentences.** *Local-first*. *No algorithms*. *Revision control*. Not *We use local-first storage*.
6. **No images of the product surface in the card.** A card is a label, not a screenshot. A separate Demo section is where a screenshot belongs (when needed).
