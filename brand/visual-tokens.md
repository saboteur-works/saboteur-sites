# Saboteur — visual tokens

The canonical token set and visual composition rules live in the **`saboteur-styles` repo**, which now contains a `docs/` directory written explicitly for AI agent consumption. This file is a pointer index — read the source files below, not this page, for authoritative detail.

## Source

```
saboteur-works/saboteur-styles
├── styles/saboteur-base.css   ← canonical token CSS (Tailwind v4 @theme)
└── docs/
    ├── tokens.md              ← complete token reference (values, utilities, roles)
    ├── color-rules.md         ← structural vs text split, WCAG rules, Signal Red
    ├── typography-rules.md    ← typeface assignments, weights, tracking, forbidden combos
    ├── mark-usage.md          ← exact specs for every mark variant and the avatar system
    └── products.md            ← per-product constraints and theme file conventions
```

**Local mirror (CSS only):** [`inputs/saboteur-base.css`](inputs/saboteur-base.css)
**Mirror freshness:** [`inputs/STYLES_SYNCED`](inputs/STYLES_SYNCED) — check this before generating token-sensitive code. Run `bash scripts/sync-styles.sh` to refresh.

If `saboteur-styles` is cloned locally, load the docs directly from `../saboteur-styles/docs/`. The README of that repo is also written for agents and explains the full system.

## How sites consume the tokens

`saboteur-styles` is pulled as a **git dependency**. In a new landing-page repo:

```jsonc
// package.json
{
  "dependencies": {
    "saboteur-styles": "github:saboteur-works/saboteur-styles"
  }
}
```

```css
/* src/styles/global.css */
@import "tailwindcss";
@import "saboteur-styles/styles/saboteur-base.css";
```

Product-specific theme files extend the base — they never redefine existing tokens. New product tokens use the `--color-[product]-*` namespace.

> **Note on `saboteur-styles` package.json:** the repo needs a `package.json` (name, version, files including `styles/`) for `npm install github:…` to work. Until that is added, scaffold by vendoring `saboteur-base.css` at scaffold time.

## Token families (summary)

The full catalog is in `docs/tokens.md`. Key families:

| Family | Token prefix | Role |
|---|---|---|
| Structural backgrounds | `--color-brand-*` | Backgrounds, borders, fills. **Never `color:` on text.** |
| Dark-surface text | `--color-fg-*` | The only legal `color:` values on dark surfaces. |
| Light-surface text | `--color-fg-inv-*` | `color:` values on `brand-white` and light surfaces. |
| Interactive states | `--color-interactive`, `--color-surface-hover/active` | Semantic interaction tokens. |
| Typography | `--font-*`, `--tracking-*`, `--leading-*` | Font families, letter-spacing, line-height. |
| Spacing | `--spacing-*` | 4px-base unit scale. |
| Radii | `--radius-*` | Hard edges default; radii are the exception. |
| Borders | `--border-width-*` | Hairline, thin, bar, mark. |
| Transitions | `--transition-fast/normal` | Motion — always use for color/opacity/layout changes. |

## Critical rule (see `docs/color-rules.md` for full detail)

`brand-mid`, `brand-dim`, and `brand-rule` are **structural tokens** — never use them as `color:` on text. They fail WCAG AA at any text size on `brand-black`. Use `fg-secondary` / `fg-tertiary` / `fg-faint` instead.
