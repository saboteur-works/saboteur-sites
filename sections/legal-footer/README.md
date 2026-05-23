# Legal footer

The bottom-of-page sign-off. **Required** on every Saboteur landing page. Carries the parent identification, copyright, and links to the privacy policy and terms of service.

## Purpose

Identify Saboteur LLC as the responsible legal entity, point at the documents required by GDPR Article 13 and equivalent laws, and close the page quietly. The footer is intentionally compact — the visual interest of the page is already spent in the hero.

## Variants

| File | When to use |
|---|---|
| [`footer.html`](footer.html) | Default. One row: sign-off on the left, Privacy/Terms links on the right. |

There's one variant. The sign-off text varies by tier (see [`../../brand/identity.md`](../../brand/identity.md)); the layout doesn't.

## Anatomy

```
─────────────────────────────────────────────────────────────  ← hairline rule (brand-rule)
                                                                                          18px
   © 2026 SABOTEUR LLC · SABOTEUR.DEV                  PRIVACY · TERMS
                                                                                          18px
```

- **Hairline top rule** — `border-t border-brand-rule`. Separates the footer from the page body.
- **Vertical padding** — 18px top and bottom. The footer is a closing strip, not a section.
- **Horizontal padding** — 24px, matching the page-wide horizontal rhythm.
- **Sign-off (left)** — mono uppercase, 10px, `fg-tertiary`, tracking `0.13em`. Pattern: `© YEAR Saboteur LLC · <domain or tier suffix>`.
- **Links (right)** — mono uppercase, 10px, `fg-tertiary`, with `hover:text-fg-secondary`. Privacy and Terms are required; a third link (Contact, Colophon) is allowed.
- **Mobile** — flex-wrap; links wrap below the sign-off if the row doesn't fit.

## Rules

1. **Privacy and Terms links are required.** Even on a cookieless site, server logs capture IPs — GDPR Article 13 applies. See [`../../compliance/`](../../compliance/).
2. **Saboteur LLC must appear in the sign-off.** *© YEAR Saboteur LLC · <suffix>* — keep the year current.
3. **No newsletter signup in the footer.** Forms have their own section with their own lawful-basis copy.
4. **No social media icons.** Saboteur doesn't link to platforms that depend on the tracking model the brand opposes. If a future Saboteur presence on a platform needs linking, it lives in a Contact section or About page.
5. **No "designed by" / "built with" lines.** The footer signs as Saboteur LLC. Build credit, if any, lives in a colophon page.
6. **One row, not stacked.** If the content doesn't fit on one row, drop the optional third link before stacking.

## Footer sign-off by tier

From [`../../brand/identity.md`](../../brand/identity.md):

| Page tier | Footer sign-off |
|---|---|
| Parent (`saboteur.dev`) | `© 2026 Saboteur LLC · saboteur.dev` |
| SAB/labs | `© 2026 Saboteur LLC · SAB/labs` |
| SAB/works | `© 2026 Saboteur LLC · SAB/works` |
| Product (e.g., `offbeat-fm.com`) | `© 2026 Saboteur LLC · offbeat-fm.com` |

The product domain on a product footer is what makes the footer self-identifying when shared as a screenshot.

## What the live saboteur.dev is missing

The current live footer has only the sign-off — no Privacy / Terms links. Per the compliance docs in this repo, those links are required. The validation port at [`../../sites/landing-page/examples/saboteur-dev/`](../../sites/landing-page/examples/saboteur-dev/) includes them; the live site should adopt them too.
