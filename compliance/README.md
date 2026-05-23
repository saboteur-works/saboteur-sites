# Compliance

Saboteur sites are **cookieless by default**, but compliance work isn't optional — it just changes shape. This directory holds the rules that keep sites cookieless, the disclosures that are still required (privacy policy, accessibility, legal footer), and the pre-launch checklist.

## Layout

- [`cookieless-by-default.md`](cookieless-by-default.md) — **Charter.** The hard rules that keep Saboteur sites free of cookies, consent banners, and EU-DPA risk. Always load when generating a site.
- [`gdpr.md`](gdpr.md) — What GDPR Article 13 still requires even without cookies. Lawful bases, processors, cross-border transfer notes.
- [`privacy-policy/`](privacy-policy/) — Fill-in [template](privacy-policy/template.md) and pre-publish [checklist](privacy-policy/checklist.md).
- [`terms-of-service/`](terms-of-service/) — Fill-in [template](terms-of-service/template.md).
- [`accessibility.md`](accessibility.md) — WCAG 2.2 AA baseline with measured contrast ratios and known gaps.
- [`analytics-choices.md`](analytics-choices.md) — Cloudflare Web Analytics (default), Plausible, or none.
- [`fonts.md`](fonts.md) — Self-hosting IBM Plex via `@fontsource/*`.
- [`third-party-embeds.md`](third-party-embeds.md) — Click-to-load pattern.
- [`forms.md`](forms.md) — Lawful basis, copy, data flow, Cloudflare Worker template.
- [`snippets/`](snippets/) — Reusable HTML. Currently: `click-to-load-embed.html`. (The legal footer is in [`../sections/legal-footer/`](../sections/legal-footer/).)
- [`pre-launch-checklist.md`](pre-launch-checklist.md) — Consolidated checklist; run before every site goes live.
