# Hero

The first thing a visitor sees. **Required** on every Saboteur landing page. The hero is where the brand's posture is set: clipped, declarative, restrained.

## Purpose

Identify what the site is, state the stance in one paragraph, and (optionally) point at a single primary action. The hero carries the mark in its full three-tier form — this is the one place the descriptor (mono, wide letter-spacing) appears in full.

The hero **is not numbered**. Section eyebrows like `Mission`, `Products`, `Status`, `Contact` belong to *content sections* and start unnumbered. (Numbered items like `01 / 02 / 03` appear *inside* a content section — see [`../mission/`](../mission/).)

## Variants

| File | When to use |
|---|---|
| [`variant-parent.html`](variant-parent.html) | Parent or sub-brand landing page (e.g., `saboteur.dev`). Uses the `SABOTEUR / サボタージ員 / CREATOR-FIRST SOFTWARE` mark with the Japanese tier. |
| [`variant-product.html`](variant-product.html) | Product landing page (e.g., `offbeat-fm.com`). Product mark with no Japanese tier. Includes one primary CTA. |

See [`copy-patterns.md`](copy-patterns.md) for headline / stance / CTA copy guidance.

## Anatomy

```
│
│  S A B O T E U R                                    ← wordmark (display, condensed)
│  サボタージ員                                         ← Japanese (sans bold)        (parent only)
│  ─────────────────
│  CREATOR-FIRST SOFTWARE — saboteur.dev              ← mono descriptor

  We build tools for people who make things.          ← body — ONE paragraph, three clauses
  No lock-in. No committees. No feature designed
  by a growth team.   Just software that respects
  the work.
```

- **Vertical bar (4px red).** Structural anchor of the mark. Same color regardless of background.
- **Wordmark.** IBM Plex Sans Condensed 700, tracking `-0.04em`. Sized `clamp(48px, 12vw, 88px)` for parent, `clamp(36px, 9vw, 72px)` for product.
- **Japanese (parent / sub-brand only).** IBM Plex Sans 700, tracking `0.16em`. Sized `clamp(15px, 4vw, 28px)`. Omitted on product variants.
- **Mono descriptor.** Pattern: `DESCRIPTOR — domain`. 10px mono `brand-mid`, tracking `0.18em`, with hairline top rule (`border-t-[0.5px] border-brand-dim`).
- **Body (one paragraph, three clauses).** IBM Plex Sans 300 (**light**), `clamp(15px, 3.5vw, 18px)`, leading 1.7, tracking 0.01em. Color is `brand-mid`. The middle clause — the stance — is wrapped in `<em class="not-italic text-brand-white">` to lift it into `brand-white`. The visual effect: a quiet sentence, a sharp middle, a quiet closer.
- **Primary CTA (product variant).** Outlined mono button: `text-brand-white hover:text-brand-mid border border-brand-dim hover:border-brand-mid`, `padding: 8px 14px`, `font-mono text-[10px] tracking-[0.14em] uppercase`. At most one. Parent pages typically skip the CTA.

## Rules

1. **One mark per hero.** Never stack parent + sub-brand + product marks.
2. **Body is one paragraph, three clauses.** Positive opener · italicized-but-not-italic stance · positive closer. Don't break the stance into a separate paragraph — the inline structure is the voice.
3. **The stance clause uses `<em class="not-italic">`** — semantically emphasized, visually lifted via color (white), not italic style.
4. **Left-aligned. Always.** The hero is the test case for the left-align default.
5. **No background imagery.** No hero gradient, no product photography behind the mark, no animated particles. Background is `brand-black`.
6. **No marketing verbs.** See *Don't* in [`../../brand/identity.md`](../../brand/identity.md).
7. **At most one CTA, and on product variants only.** If you can't decide between two CTAs, the hero isn't ready.
8. **Hairline bottom rule** (`border-b border-brand-rule`) — separates the hero from the first content section. Always present.

## Sizing reference (matches live saboteur.dev)

| Element | Size | Weight | Tracking | Other |
|---|---|---|---|---|
| Wordmark (parent) | `clamp(48px, 12vw, 88px)` | 700 | `-0.04em` | display family |
| Wordmark (product) | `clamp(36px, 9vw, 72px)` | 700 | `-0.04em` | display family |
| Japanese | `clamp(15px, 4vw, 28px)` | 700 | `0.16em` | sans family |
| Descriptor | `10px` | 400 | `0.18em` | mono family, hairline rule |
| Body | `clamp(15px, 3.5vw, 18px)` | **300 (light)** | `0.01em` | sans family, leading 1.7 |

Section vertical padding for the hero: **72px top, 64px bottom**. Horizontal padding: 24px.

## What lives in this directory

- This file — anatomy, rules, sizing.
- [`variant-parent.html`](variant-parent.html) — parent / sub-brand hero.
- [`variant-product.html`](variant-product.html) — product hero (OffBeat-FM worked example).
- [`copy-patterns.md`](copy-patterns.md) — headline, stance, and CTA copy guidance.
