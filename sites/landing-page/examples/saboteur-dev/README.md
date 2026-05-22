# saboteur.dev — validation port

A working Astro project that recreates the live `saboteur.dev` page using the docs and section patterns in `saboteur-sites`. Built as a Phase 2 validation exercise.

## How to run

```bash
cd sites/landing-page/examples/saboteur-dev
npm install     # already run during validation
npm run dev     # local preview at http://127.0.0.1:4322/
npm run build   # static output to dist/
```

The build is verified clean: zero third-party font requests, single ~24KB CSS bundle, all fonts self-hosted under `dist/_astro/`.

## Stack

Matches [`../../../../tech/stack.md`](../../../../tech/stack.md): Astro 5 + Tailwind v4 + `@fontsource/ibm-plex-*`. **Deviation:** `saboteur-base.css` is vendored at `src/styles/saboteur-base.css` because `saboteur-styles` lacks `package.json` — the documented fallback path.

## What this port validated

The port stress-tested Phase 1 + 2a/2b and forced Phase 2c into existence. The findings drove a substantial rewrite of section docs and the canonical patterns now reflect the live `saboteur.dev` exactly.

### Findings → fixes applied

1. **Section grid layout** — Sections use `grid-template-columns: 140px 1fr` with 40px gap (label column on the left, content on the right). The earlier docs assumed a stacked layout. ✅ Fixed in `sections/mission/`, applied throughout Phase 2c.
2. **Section labels are unnumbered** — Just `Mission`, `Products`, `Status`, `Contact`. The `01 / 02 / 03` pattern belongs to *items inside* a section (the tenets list nested in Mission), not to section labels themselves. ✅ Fixed across all section READMEs.
3. **Hero body is one paragraph, three clauses** — Not a tagline + separate stance. The middle clause uses `<em class="not-italic text-brand-white">` to lift into white. ✅ Fixed in `sections/hero/variant-parent.html`, `copy-patterns.md`, and `README.md`.
4. **Hero sizing was off** — Wordmark was 50% too large. Correct: `clamp(48px, 12vw, 88px)` for parent, `clamp(36px, 9vw, 72px)` for product. Body is `clamp(15px, 3.5vw, 18px)` at font-weight **300 light** (not the 400+ I had). ✅ Fixed.
5. **Section padding was 2× too much** — Correct: `56px` vertical (`py-14`), not 80–128px. ✅ Fixed in all section examples.
6. **Footer should be 18px vertical** — Compact single-row layout. ✅ Fixed.
7. **Principles live INSIDE Mission** — Not their own top-level section. They're a reusable sub-pattern documented at `sections/principles/` with markup showing them in isolation. ✅ Refactored.
8. **Two button styles exist** — Outlined mono (nav, product cards) and **filled red** (form submit only). The filled-red button is the page's primary commit action and appears nowhere else. ✅ Documented in `sections/contact/README.md`.
9. **Form pattern is label-card-above-input-card** — Label has top+sides border, input has sides+bottom border, sharing one visual surface. ✅ Documented in `sections/contact/README.md`.
10. **Product descriptor uses sub-brand attribution on the parent page** — `— SAB/works` (not the product domain) when previewed in `sections/products-preview/`. On a product's own page hero, the descriptor uses the product domain. ✅ Documented in both files.
11. **Live footer is missing Privacy/Terms** — GDPR Art. 13 still applies on cookieless sites. The port includes them; the live site needs them added.
12. **`saboteur-styles` needs `package.json`** — Confirmed by install attempt. Documented as a follow-up; minimal stub provided in `sections/legal-footer/README.md` and `brand/visual-tokens.md`.

### Status of validation

All eleven structural findings are reflected in the section docs as of Phase 2c. The port itself is a worked example that any future agent can read to see how the docs compose into a real page.

## Open follow-ups

- [ ] Add a minimal `package.json` to `saboteur-styles` so generated sites can consume tokens as a git dependency rather than vendoring.
- [ ] Add `/privacy` and `/terms` pages to the live `saboteur.dev`.
- [ ] Replace the placeholder form action (`https://forms.saboteur.dev/contact`) with a real Cloudflare Worker endpoint per `compliance/forms.md`.
- [ ] Decide on an OG image (the live site references `/assets/wordmark.png`; the port doesn't include one yet).
- [ ] Audit accessibility (keyboard nav, focus rings, color contrast on `brand-mid` text at 13px).
- [ ] Add `public/_headers` with reasonable security headers (CSP, Referrer-Policy, X-Frame-Options) before any production deploy.

## Notes for future agents reading this

This directory exists to **show**, not just describe. If you're generating a new Saboteur landing page and the docs feel abstract, read the components here side-by-side with the sections in `sections/`. Each component in `src/components/` is a literal application of the patterns documented in `sections/<name>/README.md`.
