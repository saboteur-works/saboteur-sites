# Required sections — landing page

Every Saboteur landing page must include these four sections, in this order: **Nav → Hero → Mission → Legal footer**. The content sections between Mission and the footer vary by variant (see `optional-sections.md`); the four required sections do not.

For full anatomy, rules, and copy patterns, see each section's README in [`../../sections/`](../../sections/).

---

## 1. Nav

**File:** [`../../sections/nav/variant-minimal.html`](../../sections/nav/variant-minimal.html)

The 52px sticky strip at the top of the page. Identifies the site via the reduced mark (wordmark + Japanese, no descriptor) and provides 2–4 quiet mono links to other parts of the page.

**Landing-page specifics:**

- Use `variant-minimal.html` for both product and parent variants. Swap only the mark to match the tier.
- Link labels: short mono uppercase words — `MISSION`, `PRODUCTS`, `GET IN TOUCH`. Never industry jargon (`SOLUTIONS`, `RESOURCES`, `PLATFORM`).
- One optional outlined button at the right end when the page has a single obvious action. Most Saboteur pages skip it.
- Mobile: below ~600px, collapse to a hamburger that opens a vertical menu.

---

## 2. Hero

**Files:** [`../../sections/hero/variant-parent.html`](../../sections/hero/variant-parent.html) · [`../../sections/hero/variant-product.html`](../../sections/hero/variant-product.html)

The first visible section. Sets the brand posture: mark in full three-tier form, stance in one paragraph, optional single CTA.

**Landing-page specifics:**

| Decision | Product variant | Parent / sub-brand variant |
|---|---|---|
| Which file | `variant-product.html` | `variant-parent.html` |
| Mark tiers | Wordmark + descriptor | Wordmark + Japanese + descriptor |
| Wordmark size | `clamp(36px, 9vw, 72px)` | `clamp(48px, 12vw, 88px)` |
| Descriptor | `PRODUCT NAME — domain.com` | `CREATOR-FIRST SOFTWARE — saboteur.dev` |
| CTA | One outlined button. Optional but common. | Usually none. |

- **Body is one paragraph, three clauses.** Middle clause (the stance) uses `<em class="not-italic text-brand-white">`.
- **No images, no gradients.** Background is `brand-black`.
- **Hairline bottom rule** always present, separating hero from the first content section.

Copy guidance: [`../../sections/hero/copy-patterns.md`](../../sections/hero/copy-patterns.md).

---

## 3. Mission

**File:** [`../../sections/mission/example.html`](../../sections/mission/example.html)

Follows the hero immediately. Expands the stance into a paragraph and (for parent pages) embeds the tenets list in the right column.

**Landing-page specifics:**

- Uses the **standard section grid**: 140px label column + 1fr content column.
- Label reads `MISSION` — no number, no dash.
- Right column: heading (display, 1 sentence) + body (1 paragraph, diagnosis → white pivot → prescription) + optional tenets list.
- **Parent variant:** include tenets (`../../sections/principles/`). Three items is the baseline.
- **Product variant:** tenets are optional. A product page with a short feature set can let Mission stand alone.
- Hairline bottom rule present.

---

## 4. Legal footer

**File:** [`../../sections/legal-footer/footer.html`](../../sections/legal-footer/footer.html)

The closing strip. Identifies the responsible legal entity, links to Privacy and Terms. Not a section in the page flow — it's a compact strip after the last content section.

**Landing-page specifics:**

- Sign-off pattern: `© YEAR Saboteur LLC · <domain or tier suffix>`.

| Page | Sign-off |
|---|---|
| `saboteur.dev` | `© 2026 Saboteur LLC · saboteur.dev` |
| SAB/works | `© 2026 Saboteur LLC · SAB/works` |
| Product (e.g., `offbeat-fm.com`) | `© 2026 Saboteur LLC · offbeat-fm.com` |

- **Privacy and Terms links are required** — even on a cookieless site, GDPR Article 13 applies (server logs capture IPs). See [`../../compliance/gdpr.md`](../../compliance/gdpr.md).
- No newsletter, no social icons, no build credit.
- No section-separator rule above the footer when Contact is the last section (Contact drops its own bottom rule; the footer adds a hairline top rule).
