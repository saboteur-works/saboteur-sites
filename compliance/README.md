# Compliance

Saboteur sites are **cookieless by default**, but compliance work isn't optional — it just changes shape. This directory holds the rules that keep sites cookieless, the disclosures that are still required (privacy policy, accessibility, legal footer), and the pre-launch checklist.

## Layout

- [`cookieless-by-default.md`](cookieless-by-default.md) — **Charter.** The hard rules that keep Saboteur sites free of cookies, consent banners, and EU-DPA risk. Always load when generating a site.
- `gdpr.md` *(Phase 2)* — What GDPR Article 13 still requires even without cookies.
- `privacy-policy/` *(Phase 2)* — Template + per-site checklist.
- `terms-of-service/` *(Phase 2)* — Template.
- `accessibility.md` *(Phase 2)* — WCAG 2.2 AA baseline.
- `analytics-choices.md` *(Phase 2)* — Cloudflare Web Analytics (default), Plausible, or none.
- `fonts.md` *(Phase 2)* — Self-hosting IBM Plex via `@fontsource/*`.
- `third-party-embeds.md` *(Phase 2)* — Click-to-load pattern.
- `forms.md` *(Phase 2)* — Lawful basis, copy, data flow.
- `snippets/` *(Phase 2)* — Reusable HTML (legal footer, click-to-load embed).
- `pre-launch-checklist.md` *(Phase 2)* — Run before every site goes live.

## Phase 1 scope

Just the charter. Phase 2 fleshes out the rest.
