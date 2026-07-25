# Cookieless by default — charter

Saboteur sites ship **without cookies, without tracking, and without a consent banner**. This is a deliberate posture: it eliminates an entire category of compliance risk, lowers cost, respects visitors, and aligns with the "creator-first" stance the brand projects.

This charter holds whenever a new Saboteur page or site is being generated. **Violating any of these rules silently breaks the no-banner-needed assumption** — at which point the site needs a full consent flow, and the point is lost.

## The four rules

### 1. Self-host fonts. Never load fonts from a third-party CDN.

The brand uses IBM Plex (Sans, Sans Condensed, Mono, Serif). On generated sites, use the `@fontsource/ibm-plex-*` npm packages so font files ship from the site's own origin.

**Forbidden:** `fonts.googleapis.com`, `use.typekit.net`, Adobe Fonts CDN, any third-party font host. The German *LG München 2022* ruling against Google Fonts is the canonical case; assume similar exposure for any external font CDN.

The brand-system reference HTML at `brand/inputs/saboteur-brand-system-v06.html` loads from `fonts.googleapis.com` — that is tolerated for an *internal reference document*, never for a deployed site.

### 2. Use cookie-free analytics, or skip analytics.

Default: **Cloudflare Web Analytics**. No cookies, no client storage, free, native to the hosting stack.

Acceptable alternatives: Plausible, Fathom, Simple Analytics (explicit no-cookie/no-consent designs with legal opinions backing them).

**Forbidden by default:** Google Analytics (GA4), Hotjar, Mixpanel, anything that sets `_ga`, `_fbp`, session IDs, or device fingerprints. These need consent flows we don't want to build.

### 3. No third-party embeds on initial load.

Embeds (YouTube, Vimeo, Twitter, Google Maps, Calendly inline widgets, Stripe Buy Buttons) load assets from third parties on page render — often setting cookies or transmitting IPs without consent.

If an embed is genuinely needed: use the **click-to-load** pattern — a placeholder card that only fetches the third-party content after the user clicks it. Template will live at `compliance/snippets/click-to-load-embed.html` in Phase 2.

Prefer self-hosted alternatives where they exist (e.g., `<video>` with a hosted MP4 instead of a YouTube embed).

### 4. Forms disclose what happens to data.

A form processes personal data even without cookies. The default Saboteur form backend is **Cloudflare Workers → Resend** (both already in use, both free tier). Any form must:

- State its lawful basis in plain language near the submit button (e.g., *"Your email is used only to reply."*).
- Be referenced in the site's privacy policy with: what is collected, why, where it goes (Resend), how long it is retained.
- Include a honeypot field or Turnstile challenge — spam mitigation matters, and aggressive bot defenses (reCAPTCHA) themselves create compliance issues.

## What this does *not* eliminate

A site can be 100% cookieless and still require:

- **Privacy policy** — GDPR Art. 13 applies to any personal-data processing, including IPs in server logs, form submissions, and the Resend/Cloudflare data flow.
- **Accessibility** — WCAG 2.2 AA is the baseline. Separate from cookies but always required.
- **Legal footer** — Saboteur LLC sign-off, contact, links to privacy/terms. Required in some jurisdictions (e.g., Germany's *Impressum*).
- **Terms of service** — for any site that accepts user input (forms, signups, downloads).

These get their own files in Phase 2.

## Audit checklist (pre-launch)

Before any site goes live, confirm:

- [ ] No requests to `fonts.googleapis.com` or any third-party font host on initial load.
- [ ] No analytics that set cookies or client storage.
- [ ] No third-party embeds that load on initial render (only on user click).
- [ ] Every form has lawful-basis copy and is documented in the privacy policy.
- [ ] No `Set-Cookie` headers from the site or its first-party Worker. For a static landing page this should be zero.

If any item fails, either fix it or fall back to a full consent banner setup — and remove the site from the "cookieless" category.
