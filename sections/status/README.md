# Status

An honest list of where each project or product stands. **Optional**, used on parent / sub-brand pages where multiple products are in different stages of development.

## Purpose

Set expectations. Visitors who land on `saboteur.dev` see *OffBeat-FM Live*, *GetWrite In development*, *SAB/labs Pre-production* — and that's it. No vapor, no roadmaps, no "coming soon!" marketing. The list is honest about where things are.

## Variants

| File | When to use |
|---|---|
| [`example.html`](example.html) | Default. Intro line + flat list of rows. Matches the live `saboteur.dev`. |

## Anatomy

Standard section grid (140px label + 1fr content). Content is an intro line followed by a vertical list of status rows.

```
┌──────────────────────────────────────────────────────────────────┐
│  STATUS       Both products are in active development under     │
│               SAB/works.                                          │
│                                                                  │
│               ──────────────────────────────────────────────     │
│               ● OffBeat-FM                            [ LIVE ]    │
│               ──────────────────────────────────────────────     │
│               ● GetWrite                       [ IN DEVELOPMENT ] │
│               ──────────────────────────────────────────────     │
│               ○ SAB/labs                      [ PRE-PRODUCTION ] │
│               ──────────────────────────────────────────────     │
└──────────────────────────────────────────────────────────────────┘
```

### Row

- **Layout** — flex row, `gap: 14px`. Top hairline rule on every row; bottom rule on the last row only.
- **Dot** — `6px × 6px`, `border-radius: 50%`. `bg-brand-red` for live items; `bg-brand-dim` for pre-launch / inactive.
- **Name** — display family (IBM Plex Sans Condensed 700), 15px, tracking `-0.01em`, `text-brand-white`. Flex-grows to fill the row.
- **Badge** — mono 9px tracking `0.12em` uppercase, hairline outlined. Live badges use `text-brand-red border-brand-red` with `opacity: 0.9`; pre-launch use `text-brand-mid border-brand-dim`.

### Intro line

- Sans 13px, leading `1.8`, `brand-mid`.
- `margin-bottom: 18px` before the row list.
- One sentence, honest about what's being shown.

## Rules

1. **Three statuses only:** `Live` · `In development` · `Pre-production`. Don't invent new ones (*Coming soon*, *Beta*, *MVP*, *Stealth*) — the small vocabulary is the discipline.
2. **The dot color matches the status meaning.** Live = red. Anything else = dim. No yellow / orange / green semantic colors.
3. **Order from most-shipped to least-shipped.** The first row should be the thing closest to *Live*.
4. **No "launching soon" copy.** If a product is launching soon, the badge says `In development`, not `Coming this fall!`. Specific dates belong on the product's own page, not in this section.
5. **Status section appears on parent / sub-brand pages only.** A product's own landing page doesn't need a status row about itself.
6. **No links from this section.** It's a label, not a navigation surface. To dive into a product, the visitor uses the Products section above.

## Copy patterns

The intro line states the overarching context:

> *Both products are in active development under SAB/works.*

A SAB/labs page might say:

> *Three experiments. One ships, two don't.*

Avoid:

- *Stay tuned for updates!*
- *We can't wait to show you what we're building.*
- *More on this soon.*

The list itself is the update.
