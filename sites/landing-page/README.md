# Landing page

A single-page site that introduces one thing — a product, a sub-brand, or Saboteur LLC itself — and (optionally) captures contact. Landing pages are the primary use case for this repo.

This directory describes **what a Saboteur landing page is**, not how to build it. Stack and scaffolding live in [`../../tech/stack.md`](../../tech/stack.md) and [`../../scaffolding/`](../../scaffolding/). Section-level HTML patterns live in [`../../sections/`](../../sections/). Brand and voice live in [`../../brand/`](../../brand/). Compliance constraints live in [`../../compliance/`](../../compliance/).

## Two variants

| Variant | What it promotes | Examples |
|---|---|---|
| **Product landing page** | One product. Owns its domain. Parent mark appears only in the footer. | `offbeat-fm.com`, `getwrite.io` |
| **Parent / sub-brand landing page** | Saboteur LLC or one of `SAB/labs` / `SAB/works`. Previews multiple products. | `saboteur.dev` (current live page) |

The two variants share most of their anatomy. They differ in **which mark sits in the hero**, **whether a Products section exists**, and **how the footer signs**. The defaults below describe the product landing page; differences for the parent variant are called out inline.

## Anatomy

Sections are listed in their default order. **Required** sections must be present in every Saboteur landing page; **optional** sections are composed based on the page's job.

| # | Section | Required? | Purpose |
|---|---|---|---|
| 1 | **Nav** | Required | Left-aligned mark (reduced — wordmark + Japanese, no descriptor). Sparse links. No dropdowns. |
| 2 | **Hero** | Required | Full mark (three tiers — wordmark, Japanese, mono descriptor) + tagline + (optional) primary CTA. Left-aligned. |
| 3 | **Mission / what this is** | Required | One paragraph stating the stance. Often contrasts against the dominant alternative. Restrained, declarative. |
| 4 | Principles | Optional | Two to four numbered items expanding the stance. *Parent variant uses this; product pages often skip it.* |
| 5 | Features / what it does | Optional | Three to five plain statements about the product. No marketing verbs. *Product variant.* |
| 6 | Products preview | Optional | Side-by-side cards for `OffBeat-FM`, `GetWrite`, future products. *Parent variant only.* |
| 7 | Demo / screenshot | Optional | Single static image of the product surface. No autoplay video. |
| 8 | Status / availability | Optional | Pre-launch, in development, live. Honest, not aspirational. |
| 9 | Contact | Optional | Form (name, email, topic, message) → Cloudflare Worker → Resend. See [`../../compliance/cookieless-by-default.md`](../../compliance/cookieless-by-default.md) for the rules a form must follow. |
| 10 | **Legal footer** | Required | Saboteur LLC sign-off, contact, links to privacy and terms. Reduced parent mark always appears here on product pages. |

## Decision flow

When generating a Saboteur landing page, resolve these in order:

1. **Which variant?** Product or parent. This determines the hero mark and the footer signature.
2. **Which sections beyond the required four?** A typical product landing page is *Nav · Hero · Mission · Features · Status · Contact · Legal footer*. The parent page (`saboteur.dev`) is *Nav · Hero · Mission · Principles · Products · Status · Contact · Legal footer*.
3. **Does the page collect data?** If yes, the privacy policy and a documented data flow are required. Forms must include lawful-basis copy near the submit button.
4. **What's the product's domain?** It appears in the hero descriptor, the footer, and the canonical / Open Graph metadata. Saboteur products each get their own domain (current default — may consolidate later).

## Reference: the live parent page

`saboteur.dev` (Phase 1 reference for the parent variant). Observed structure:

- Nav: *Mission · Products · Get in touch*
- Hero: *CREATOR-FIRST SOFTWARE* / *"We build tools for people who make things"* / *"No lock-in. No committees. No feature designed by a growth team."*
- Mission: *"Software that gets out of the way"* — contrasted against software that *"monetizes attention, fragments ownership, and optimizes for retention."*
- Principles: Three numbered — creator-first decisions, user ownership, deliberate complexity.
- Products: `OffBeat-FM` ("No algorithms. No editorial committees.") and `GetWrite` ("Local-first. Your files. Your structure.").
- Status: stages for OffBeat-FM, GetWrite, SAB/labs.
- Contact: form (name, email, topic, message).
- Footer: *Saboteur LLC · saboteur.dev*.

## What lives in this directory

- This file — variants, anatomy, decision flow.
- *(Phase 2)* `required-sections.md` — full reference for nav, hero, mission, legal footer.
- *(Phase 2)* `optional-sections.md` — when and how to include features, demo, products, status, contact.
- *(Phase 2)* `examples/saboteur-dev/` — the live parent page absorbed as a worked example.
- *(Phase 2)* `pre-launch-checklist.md` — combines the cookieless audit, the legal/footer audit, the SEO/metadata audit, and accessibility.
