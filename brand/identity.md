# Saboteur — brand identity

The reference for any Saboteur web property: who Saboteur is, the three-tier hierarchy, voice, and where the source-of-truth assets live.

For visual tokens (colors, type, spacing) see [`visual-tokens.md`](visual-tokens.md). For the full brand-system reference (rendered HTML), see [`inputs/saboteur-brand-system-v06.html`](inputs/saboteur-brand-system-v06.html).

## What Saboteur is

> **Creator-first software.** *saboteur.dev*

Software built in opposition to the dominant SaaS playbook — local-first where it can be, plain HTML where it should be, opinionated against lock-in. The brand is restrained, technical, and confrontational without being loud. Red marks structure and intent; it is never decoration.

## Three-tier hierarchy

Saboteur is a single LLC with two sub-brands and (so far) two products. **Products are siblings, not children** — each has its own identity that sits beside (not under) the sub-brand.

```
Saboteur LLC               (parent — neutral root)
├── SAB/labs   研究所       developer tools & knowledge
│   └── (future products)
└── SAB/works  製作所       creator & consumer products
    ├── OffBeat-FM         independent music discovery — offbeat-fm.com
    └── GetWrite           local-first writing studio — getwrite.io
```

Any landing page sits at exactly one tier. The mark in the hero, the avatar in nav, and the footer all depend on the tier:

| Tier | Mark in hero | Avatar | Footer signs as |
|---|---|---|---|
| Parent | `SABOTEUR / サボタージ員 / CREATOR-FIRST SOFTWARE` | Outlined white, `員` | Saboteur LLC |
| SAB/labs | `SAB/labs / 研究所 / developer tools & knowledge` | Outlined red, `員` | Saboteur LLC · SAB/labs |
| SAB/works | `SAB/works / 製作所 / creator & consumer products` | Red fill, `員` | Saboteur LLC · SAB/works |
| Product | Product mark with red structural bar | Product-specific | Saboteur LLC · product domain |

The parent mark appears in the footers and about pages of product sites — never as the primary mark *on* a product site.

## Voice — how Saboteur sounds

The voice is **declarative, restrained, and counter-platform**. It states things rather than persuades. It rejects industry vocabulary openly. It earns trust by being specific about what it *won't* do, not by promising what it will.

Reference phrases from the live site (saboteur.dev) and the brand system:

- *Software that gets out of the way.*
- *We build the opposite.*
- *No lock-in. No committees. No feature designed by a growth team.*
- *We read everything. We reply to most of it.*
- *INDEPENDENT MUSIC DISCOVERY — offbeat-fm.com*
- *LOCAL-FIRST WRITING STUDIO — getwrite.io*

### Do

- Lead with what the product *is* in a clipped descriptor (mono, uppercase, wide letterspacing).
- Use short declarative sentences. End sentences early.
- Name what you reject by name — *growth team*, *lock-in*, *the algorithm* — when it earns its place.
- Treat technical terms as ordinary. Don't soften *local-first* or *self-hosted* with explanation.
- Specific is better than reassuring. *"We reply to most of it"* beats *"We value every email."*

### Don't

- No marketing verbs that imply manipulation: *unleash*, *supercharge*, *delight*, *empower*.
- No hedged claims: avoid *might*, *can help you*, *designed to*.
- No SaaS-template phrasing: *trusted by thousands*, *the future of X*, *built different*.
- No exclamation marks. No emoji in voice copy.
- Don't explain the joke. If a stance is taken, let it stand.

## Visual identity — one-line summary

Black backgrounds (`#0A0A0A`), warm-off-white text and surfaces (`#F5F4F0`, **never `#FFFFFF`**), Signal Red (`#D44040`) used only as structure and active state, IBM Plex everywhere. Left-aligned by default. Surfaces are flat. Borders are hairline. See [`visual-tokens.md`](visual-tokens.md) for the full token set and rules.

## What lives in this layer

- This file — identity, hierarchy, voice.
- [`visual-tokens.md`](visual-tokens.md) — token catalog pointing at the canonical `saboteur-styles` repo.
- [`inputs/saboteur-brand-system-v06.html`](inputs/saboteur-brand-system-v06.html) — the canonical human-authored brand system (rendered HTML).
- [`inputs/saboteur-base.css`](inputs/saboteur-base.css) — mirror of the brand-tokens source.
- *(Phase 2)* `voice-examples.md` — annotated copy do/don'ts beyond the seed above.
- *(Phase 2)* `assets/` — logos, favicons, OG images, the `員` glyph used in avatars.
