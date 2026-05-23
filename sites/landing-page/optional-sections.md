# Optional sections — landing page

Compose these based on the variant and the page's job. The table below is the decision guide; section-specific rules and HTML live in [`../../sections/`](../../sections/).

## Quick reference

| # | Section | Product variant | Parent variant | Notes |
|---|---|---|---|---|
| — | Principles (tenets) | Optional | Common | Nested inside Mission, not a standalone section |
| 5 | Features | Common | Skip | Product variant's primary differentiator list |
| 6 | Products preview | Skip | Required | Parent / sub-brand only |
| 7 | Demo | Optional | Rarely | Single static screenshot |
| 8 | Status | Occasionally | Common | Honest stage label(s) |
| 9 | Contact | Common | Common | Form → CF Worker → Resend |

Sections appear in the order above between Mission and the legal footer. Skip any that don't fit the page's job — a shorter page is almost always better.

---

## Principles (tenets)

**File:** [`../../sections/principles/example.html`](../../sections/principles/example.html)

A numbered list of operating commitments. **Not a standalone section** — it nests in the right column of Mission, directly below the body paragraph.

**When to include:**

- Include on the parent / sub-brand page. The live `saboteur.dev` uses three: *Creator-first*, *Own your output*, *Deliberate complexity*.
- Include on a product page when the product takes a clear position worth unpacking (e.g., a privacy-first product). Skip it when the product's differentiation is better shown in Features.

**Constraints:** 2–4 items. Headlines are declarations (end with a period). Numbers in `brand-red`; no icons. Flat vertical list with hairline rules between items.

---

## Features

*No dedicated section file yet — this section is forthcoming. The pattern below matches the Saboteur visual language; generate from it until a canonical file exists.*

**When to include:** Product landing pages only. The parent page does not have a features section — products are introduced via the Products preview.

**Anatomy:** Standard section grid (140px label + 1fr). Label reads `FEATURES` (or the product-specific equivalent, e.g., `HOW IT WORKS`). Right column: 3–5 plain-prose statements, one per line, with hairline rules between them. No icons, no cards, no columns.

**Copy rules:**
- Plain declarative statements: *"Your library lives on disk. No sync required."*
- No marketing verbs: no *unleash*, *supercharge*, *delight*, *empower*.
- No bullet points. Hairline-ruled rows, not a bulleted list.
- Each statement fits one line (or two at narrow widths). If it needs three lines, it's a tenet, not a feature.

---

## Products preview

**File:** [`../../sections/products-preview/example.html`](../../sections/products-preview/example.html)

Side-by-side product cards for parent and sub-brand landing pages. **Not used on product landing pages.**

**When to include:** On any page that introduces multiple products (e.g., `saboteur.dev`, a future `SAB/works` landing page).

**Constraints:**
- Descriptor suffix on each card is the sub-brand (`— SAB/works`), not the product's domain. The product's own domain appears on the product's own landing page.
- One action per card: `Learn more →` (live) or disabled `Coming Soon` (pre-launch).
- 2–3 tag chips per card. Nouns or compound nouns (*Local-first*, *No algorithms*), not sentences.

---

## Demo

*No dedicated section file yet. Use the pattern below.*

**When to include:** When a single static screenshot would materially help a visitor understand what the product surface looks like. Skip it if the product is pre-launch with no real UI, or if the mission and features copy already carry the weight.

**Anatomy:** Full-width image block below Features (or Mission on a product page without Features). One image, no carousel, no autoplay video. Image is `max-width: 100%` with a hairline border `border border-brand-dim`.

**Constraints:** Static image only — no autoplay video, no animated GIF. Any third-party embed (Vimeo, YouTube, Loom) must use the click-to-load wrapper from [`../../compliance/snippets/click-to-load-embed.html`](../../compliance/snippets/click-to-load-embed.html).

---

## Status

**File:** [`../../sections/status/example.html`](../../sections/status/example.html)

An honest list of where each project or product stands.

**When to include:**
- Common on parent / sub-brand pages with multiple products in different stages.
- On a product landing page, include Status only if the product is pre-launch and the stage needs explicit acknowledgment. A live product's own landing page generally doesn't need a Status section.

**Three allowed stages only:** `Live` · `In development` · `Pre-production`. No invented stages (*Coming soon*, *Beta*, *MVP*, *Stealth*).

**Constraints:** Order from most-shipped to least-shipped. No links from this section. No dates or "launching soon" copy — the badge is the update.

---

## Contact

**File:** [`../../sections/contact/form.html`](../../sections/contact/form.html)

The form section. Almost always the last content section before the footer.

**When to include:** On any landing page where the owner wants to hear from visitors. Omit only on very minimal reference pages with no audience interaction.

**Anatomy summary:**
- Left column: section label (`CONTACT`) + four-line intro naming the kinds of messages welcomed.
- Right column: Name + Email (2-col row) · Topic (`<select>`) · Message (`<textarea>`) · Submit (filled red) · lawful-basis copy · closing line.

**Invariants:**
- Submit button is **filled red** (`bg-brand-red`) — the single allowed filled-red CTA on the page.
- Lawful-basis copy directly below submit: *"We'll only use your email to reply. We don't share it, sell it, or store it past our reply."*
- Closing line: *"We read everything. We reply to most of it."* — brand canon, do not rewrite.
- Honeypot field (`<input name="company">` positioned off-screen), not reCAPTCHA.
- **No bottom hairline rule** — Contact is the last section; the footer's top rule takes over.

**Backend:** Cloudflare Worker → Resend. See [`../../compliance/forms.md`](../../compliance/forms.md) for the Worker template and compliance requirements.
