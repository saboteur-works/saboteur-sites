# Saboteur — visual tokens

The canonical token set for Saboteur web properties: colors, typography, spacing, radii, borders, motion. Tokens are defined in a **separate repo** and consumed by generated sites as a stylesheet dependency. A read-only mirror of the source file lives at [`inputs/saboteur-base.css`](inputs/saboteur-base.css) so AI agents reading this repo can see the tokens without an external fetch — the mirror is documentation, never the source of truth. Update the canonical repo, then re-mirror.

For voice, hierarchy, and the rules behind the tokens, see [`identity.md`](identity.md). For the full visual system in rendered form, see [`inputs/saboteur-brand-system-v06.html`](inputs/saboteur-brand-system-v06.html).

## Where the tokens live

- **Canonical source:** [`saboteur-works/saboteur-styles`](https://github.com/saboteur-works/saboteur-styles) → `styles/saboteur-base.css`
- **Local mirror (read-only):** [`inputs/saboteur-base.css`](inputs/saboteur-base.css) — snapshot for agent reference. Check [`inputs/STYLES_SYNCED`](inputs/STYLES_SYNCED) for the last-sync date and commit. If stale, run `bash scripts/sync-styles.sh` to refresh.
- **Format:** Tailwind v4 `@theme` block exposing CSS custom properties.

## How generated sites consume them

`saboteur-styles` is not published to npm. Sites pull it as a **git dependency**. In a new landing-page repo:

```jsonc
// package.json
{
  "dependencies": {
    "saboteur-styles": "github:saboteur-works/saboteur-styles"
  }
}
```

Then import the base before any site-specific theme file:

```css
/* src/styles/global.css */
@import "saboteur-styles/styles/saboteur-base.css";
@import "./theme.css"; /* product- or page-specific overrides */
```

Product-specific theme files **extend** the base — they never redefine tokens that already exist.

> **Prerequisite:** the `saboteur-styles` repo currently has no `package.json`, which `npm install github:…` requires. Add a minimal `package.json` to that repo (name, version, files including `styles/`) before relying on this consumption pattern. Until then, scaffolding can vendor `saboteur-base.css` at scaffold time as a fallback.

## Token catalog

These are the names exposed by the `@theme` block in `saboteur-base.css`. Use them via Tailwind utilities (`bg-brand-black`, `font-display`, `tracking-wordmark`, …) or as raw CSS custom properties (`var(--color-brand-red)`).

### Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-brand-black` | `#0A0A0A` | Primary background, dark UI surfaces. |
| `--color-brand-white` | `#F5F4F0` | Primary text on dark, light UI background. **Warm — never `#FFFFFF`.** |
| `--color-brand-red` | `#D44040` | Signal Red. **Structure and interaction only** — never body text, decorative fill, or arbitrary accent. |
| `--color-brand-mid` | `#6A6864` | Secondary text, descriptors, muted labels. |
| `--color-brand-dim` | `#2E2E2C` | Borders, rules, tertiary text. |
| `--color-brand-rule` | `#1A1A18` | Divider lines, hairlines on dark surfaces. |
| `--color-brand-surface` | `#111110` | Raised dark surfaces (cards, panels). |
| `--color-brand-surface2` | `#161614` | Deeper dark surfaces. |

GetWrite editor adds `--paper` (`#F0EDE6`) and `--ink` (`#1A1916`) — those live in the GetWrite theme file, not the base.

### Typography

The brand uses **IBM Plex** — four faces, each with a strictly defined role.

| Token | Family | Role |
|---|---|---|
| `--font-display` | IBM Plex Sans Condensed | Wordmarks and major headings only. |
| `--font-sans` | IBM Plex Sans | UI, body, navigation, labels — the default. |
| `--font-mono` | IBM Plex Mono | Descriptors, metadata, technical labels — always with letter-spacing. |
| `--font-serif` | IBM Plex Serif | **GetWrite editor surface only.** Never elsewhere. |

Weights: `--font-weight-regular` (400), `--font-weight-medium` (500), `--font-weight-bold` (700).

Letter-spacing (load-bearing in this brand):

| Token | Value | Use |
|---|---|---|
| `tracking-wordmark` | -0.04em | Condensed hero wordmark. |
| `tracking-display` | -0.03em | Display headings. |
| `tracking-heading` | -0.02em | h1-level headings. |
| `tracking-body` | 0 | Body text. |
| `tracking-label` | 0.14em | Mono labels. |
| `tracking-label-wide` | 0.18em | Mono descriptors. |
| `tracking-label-xl` | 0.22em | Mono hero descriptors. |
| `tracking-micro` | 0.1em | Small mono. |

Line height: `leading-tight` (1.05), `leading-snug` (1.3), `leading-normal` (1.6), `leading-relaxed` (1.8), `leading-editorial` (2.0).

### Spacing

4px base. Tokens: `spacing-1` (4) · `spacing-2` (8) · `spacing-3` (12) · `spacing-4` (16) · `spacing-5` (20) · `spacing-6` (24) · `spacing-8` (32) · `spacing-10` (40) · `spacing-12` (48) · `spacing-16` (64) · `spacing-20` (80).

### Radii

`radius-sm` (3px) · `radius-md` (5px) · `radius-lg` (8px) · `radius-xl` (12px) — tags / buttons / cards / modals respectively.

These exist so that when a rounded corner *is* needed, it's drawn from the system rather than improvised. **Hard edges are the default** — see *Hard edges by default* in the rules below.

### Borders

`border-hairline` (0.5px) · `border-thin` (1px) · `border-bar` (3px — sub-brand left bars) · `border-mark` (4px — primary mark left bar).

### Motion

`transition-fast` (150ms ease) for color/border/opacity. `transition-normal` (200ms ease) for layout/transform. Nothing slower without justification.

## Rules of use

These are constraints, not preferences. Flag violations before generation, not after.

1. **Red marks structure, identity, and active state.** Never body text. Never decorative fill. Never arbitrary accent. If red feels like visual interest, the answer is no — use the bar, the active state, or no color at all.
2. **Warm off-white, never pure white.** `#F5F4F0` on dark, lightest surface on light. `#FFFFFF` is wrong here.
3. **Left-align by default.** Marks, headings, content. Centering is wrong outside intentional inverted blocks.
4. **Surfaces are flat.** No gradients as decoration. Separation comes from hairlines, not fills.
5. **Hard edges by default.** Radii are defined in the tokens (`radius-sm` … `radius-xl`) but **used sparingly**. Cards, sections, and section dividers stay square. Reach for a radius only when the element genuinely demands softening — small chips/tags (`radius-sm`), form inputs and buttons (`radius-md`). Avoid `radius-lg`/`radius-xl` unless there's a clear reason; the brand reads sharp, not friendly.
6. **Type roles don't mix within one element.** Condensed is wordmarks. Mono is technical labels. Serif is GetWrite editor only. Sans is everything else.
7. **No browser blue for interactive elements.** Reach for red (active) or the existing palette — never platform defaults.
8. **Fonts ship from the site's own origin.** Self-host IBM Plex via `@fontsource/*`; never load from `fonts.googleapis.com`. See [`../compliance/cookieless-by-default.md`](../compliance/cookieless-by-default.md).

## What lives in this layer

- This file — token reference and rules.
- [`identity.md`](identity.md) — voice, hierarchy, what Saboteur is.
- [`inputs/saboteur-base.css`](inputs/saboteur-base.css) — read-only mirror of the canonical token source.
- [`inputs/saboteur-brand-system-v06.html`](inputs/saboteur-brand-system-v06.html) — full brand system reference (rendered HTML).
- *(Phase 2)* `voice-examples.md` — annotated copy do/don'ts.
- *(Phase 2)* `assets/` — logos, favicons, OG images, the `員` glyph.
