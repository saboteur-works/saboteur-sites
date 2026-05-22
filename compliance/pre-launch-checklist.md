# Pre-launch checklist

Run before any Saboteur landing page goes live. Every item should be verifiable, not just affirmable. If you can't observe a *yes*, the answer is *no*.

This checklist consolidates the rules from every other doc in this repo. If something here conflicts with a more detailed doc, the detailed doc wins — but flag the conflict.

## 1. Brand

- [ ] The site picks exactly one mark tier (parent / sub-brand / product) per [`../brand/identity.md`](../brand/identity.md).
- [ ] The hero mark uses the 4px red structural bar.
- [ ] The footer signs with the correct tier line (e.g., `© 2026 Saboteur LLC · offbeat-fm.com`).
- [ ] The reduced parent mark appears in either the nav or the footer of every product page.
- [ ] No marks are stacked across tiers (e.g., parent + product in the same hero).

## 2. Content & voice

- [ ] Hero tagline is one sentence, no marketing verbs.
- [ ] Hero stance names what the product/company rejects, specifically.
- [ ] Mission paragraph diagnoses before prescribing.
- [ ] No exclamation marks anywhere.
- [ ] No emoji in voice copy.
- [ ] No SaaS-template phrasing (*trusted by thousands*, *the future of*, *built different*).

## 3. Visual tokens

- [ ] No hex literals in the markup. All colors come from `--color-brand-*` tokens or Tailwind utility classes that map to them.
- [ ] No `#FFFFFF`. Lightest color is `--color-brand-white` (`#F5F4F0`).
- [ ] Red appears only as structural bar, active state, or single CTA underline.
- [ ] No gradients used decoratively.
- [ ] Left-aligned by default; any centered block is intentional.
- [ ] Hard edges by default; radii (`radius-*`) used only on chips/tags/inputs/buttons.
- [ ] Typography uses only the four IBM Plex families in their assigned roles. Serif appears nowhere outside a GetWrite editor surface.

## 4. Cookieless posture

From [`cookieless-by-default.md`](cookieless-by-default.md):

- [ ] No `Set-Cookie` headers on initial load (DevTools → Network → first request).
- [ ] No client storage written on load (`localStorage`, `sessionStorage`, IndexedDB all empty).
- [ ] No consent banner needed.

## 5. Fonts

From [`fonts.md`](fonts.md):

- [ ] No requests to `fonts.googleapis.com`, `fonts.gstatic.com`, `use.typekit.net`, or any third-party font CDN (DevTools Network on first load).
- [ ] IBM Plex weights used by the site are all imported via `@fontsource/*`.
- [ ] Hero-prominent weight is preloaded.
- [ ] `font-display: swap` applies to every web font.

## 6. Analytics

From [`analytics-choices.md`](analytics-choices.md):

- [ ] No GA4, Hotjar, Mixpanel, Amplitude, Segment, Heap, FB Pixel, LinkedIn Insight, TikTok Pixel.
- [ ] Cloudflare Web Analytics snippet is in place (if analytics is wanted) — or no analytics snippet at all.

## 7. Embeds

From [`third-party-embeds.md`](third-party-embeds.md):

- [ ] No `<iframe>` loading from a third-party domain on initial render.
- [ ] Any necessary embed uses the [`snippets/click-to-load-embed.html`](snippets/click-to-load-embed.html) pattern.
- [ ] If YouTube is embedded after click, the `youtube-nocookie.com` URL is used.

## 8. Forms (if any)

From [`forms.md`](forms.md):

- [ ] Form has a honeypot or Turnstile.
- [ ] Lawful-basis copy is visible near the submit button.
- [ ] Submit posts to the Cloudflare Worker; Worker `ALLOWED_ORIGINS` includes this site.
- [ ] Submit succeeds end-to-end (test message arrives at `TO_EMAIL`).
- [ ] Form fields are length-capped server-side.
- [ ] Form does not fire analytics events.

## 9. Legal documents

- [ ] Privacy policy is published and linked from the footer.
- [ ] Terms of service is published and linked from the footer (required if the site accepts user input — forms, signups, downloads).
- [ ] Privacy policy names every processor (Cloudflare, Resend, analytics tool if any) with their role.
- [ ] Contact email or other channel for data-subject requests is published in the privacy policy.
- [ ] Year in the footer copyright line is current.

## 10. Accessibility (WCAG 2.2 AA baseline)

- [ ] All interactive elements (links, buttons, form controls) are keyboard-reachable in document order.
- [ ] Visible focus indicator on every focusable element — and not the browser default if a custom theme exists.
- [ ] Color contrast meets WCAG AA: `brand-white` on `brand-black` passes; `brand-mid` on `brand-black` should be checked per use (smaller text needs higher contrast).
- [ ] Every `<img>` has alt text (or `alt=""` for decorative).
- [ ] Form labels are programmatically associated with inputs (`<label for="...">` or wrapping `<label>`).
- [ ] No content conveyed by color alone (red as an *only* indicator fails — pair with text or icon).
- [ ] Page has a single `<h1>` matching the hero heading.
- [ ] `lang` attribute set on `<html>`.

## 11. SEO & metadata

- [ ] `<title>` follows the pattern *"{Product or page} — {short descriptor}"*.
- [ ] `<meta name="description">` is present, 140–160 chars, in the brand voice.
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) are present and accurate.
- [ ] Twitter card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) are present.
- [ ] OG image is self-hosted (no third-party image URL).
- [ ] Canonical URL is set on every page.
- [ ] `robots.txt` exists (allow by default; disallow only what shouldn't be indexed).
- [ ] `sitemap.xml` exists for any site with more than one page.

## 12. Performance

- [ ] Lighthouse score ≥ 95 on Performance, Accessibility, Best Practices, SEO.
- [ ] Total JS shipped < 50KB on a typical landing page (no JS at all is preferred).
- [ ] Images use `<Image>` / `<Picture>` (Astro) or hand-authored `<picture>` with AVIF + WebP + fallback.
- [ ] No unused weights of IBM Plex are imported.

## 13. Hosting & deploy

- [ ] Deployed to Cloudflare Pages (default) or documented alternative.
- [ ] Custom domain is wired and HTTPS works.
- [ ] Redirects are in place (e.g., `www.product.com` → `product.com`).
- [ ] `_headers` file sets reasonable security headers (CSP, X-Frame-Options, Referrer-Policy).
- [ ] 404 page exists and is on-brand.

## 14. Final pass

- [ ] The site has been opened in a fresh browser session (no cached state) on a clean network.
- [ ] DevTools → Network tab on first load shows only first-party and known-allowed requests (CF Web Analytics if used, Resend only on form submit).
- [ ] DevTools → Application tab shows zero cookies set, zero localStorage entries, zero sessionStorage entries.
- [ ] Read the page top to bottom out loud. Does it sound like Saboteur, or does it sound like a template?

If the last item fails, the page is not done.
