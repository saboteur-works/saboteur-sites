# Mission

One section, one stance. **Required** on every Saboteur landing page.

## Purpose

State what the site (company, product, sub-brand) *is* and what it stands against. The mission follows the hero, expanding the stance the hero hinted at into a paragraph. On parent pages it usually carries an embedded tenets list (numbered principles) inside its right column.

Mission is intentionally narrow. It is not the *features* section or the *about* page. It is one paragraph (sometimes with an embedded tenets list) that answers: *why does this exist?*

## Variants

| File | When to use |
|---|---|
| [`example.html`](example.html) | Default. Includes the parent-page tenets pattern; tenets are easily removed for a product-page mission that doesn't need them. |

There's one variant — the section's shape is stable; copy and the optional tenets are the variation.

## Section structure (canonical for all content sections)

All Saboteur content sections — Mission, Products, Status, Contact — share the same outer structure:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  MISSION       Software that gets out of the way.                │
│                                                                  │
│                Most software is built for the platform, not the  │
│                person. It monetizes attention, fragments         │
│                ownership, and optimizes for retention over       │
│                output. We build the opposite. Tools that make    │
│                you more capable without making you dependent.    │
│                                                                  │
│                ───────────────────────────────────────────────   │
│                01  Creator-first. Every product decision …       │
│                ───────────────────────────────────────────────   │
│                02  Own your output. Your files, your data …      │
│                ───────────────────────────────────────────────   │
│                03  Deliberate complexity. Simple where it …      │
│                ───────────────────────────────────────────────   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
   └─ 140px label column        └─ 1fr content column
      mono uppercase mid           (heading, body, optional sub-elements)
```

- **Grid:** `grid-template-columns: 140px 1fr; gap: 40px;` on desktop. Single column on mobile (<600px) with a hairline rule under the label.
- **Label column:** mono uppercase, 10px, `brand-mid`, tracking `0.2em`. **Unnumbered.** Just `Mission`, `Products`, `Status`, `Contact`. Never `01 — MISSION`.
- **Content column:** the section's actual content. Heading, body, plus any nested sub-elements (tenets, status rows, product cards, form, etc.).
- **Section padding:** `56px` vertical (`py-14`), `24px` horizontal (`px-6`).
- **Hairline bottom rule:** `border-b border-brand-rule` separates each section. The last section before the footer (typically Contact) drops the rule.

### Why labels are unnumbered

The brand-system reference HTML uses numbered section labels (`01 — Primary mark`, `02 — Inverted`) because it's a documentation document. **Landing pages do not use numbered section labels.** The `01 / 02 / 03` pattern is reserved for *items inside* a section (most often the tenets inside Mission). Section labels are plain words.

## Mission content (the right column)

The right column has a stable shape:

1. **Heading** — one sentence, display family (IBM Plex Sans Condensed 700), `clamp(24px, 5vw, 32px)`, tracking `-0.03em`, leading `1.1`. Often a positive restatement of what the hero stance rejects.
2. **Body** — one paragraph, sans 400, 13px, leading `1.8`, color `brand-mid`. Pattern: *diagnosis → pivot → prescription.*
   - Diagnosis: two sentences naming what the dominant alternative does wrong, in `brand-mid`.
   - Pivot: a short clause wrapped in `<em class="not-italic text-brand-white">` — usually *"We build the opposite."*
   - Prescription: one sentence in `brand-mid` after the pivot, naming what *this* does instead.
3. **Tenets list (optional)** — numbered items nested directly below the body. See [`../principles/`](../principles/) for the standalone pattern.

## Rules

1. **One paragraph in the body, plus optional tenets.** Don't pile on more body paragraphs — extra material belongs in the tenets list or in its own section.
2. **No bullet points in the body.** Bullets break the cadence. The body reads as prose; the tenets are the only list.
3. **Diagnosis before prescription.** Name what's wrong first; pivot via `<em class="not-italic">` to white; then prescribe.
4. **Don't list features here.** Features have their own section. The mission talks about position, not capability.
5. **Tenets are optional and live inside Mission.** When tenets exist, they are visually a flat list with hairline rules between items — not a card grid, not a 3-column layout.

## Copy patterns

The body follows a reliable shape:

> *[The dominant alternative] [does these specific things visitors will recognize as wrong]. [Pivot in white — usually "We build the opposite."] [Positive prescription — what this is instead].*

### Live example (saboteur.dev)

> *Most software is built for the platform, not the person. It monetizes attention, fragments ownership, and optimizes for retention over output. **We build the opposite.** Tools that make you more capable without making you dependent.*

The paragraph names the target (*the platform*), enumerates three offenses, pivots into white at *We build the opposite.*, and lands on a prescription that doesn't repeat the diagnosis.

### When writing for a product

The dominant alternative is the dominant *kind of product*, not software in general:

- OffBeat-FM contrasts against algorithmic music platforms.
- GetWrite contrasts against subscription writing apps with cloud lock-in.

Be specific. *Most* and *typically* are weaker than naming the category.
