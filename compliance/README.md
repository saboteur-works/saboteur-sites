# Compliance

Saboteur sites are **cookieless by default**, but compliance work isn't optional — it just changes shape. This directory holds the rules that keep sites cookieless, the disclosures that are still required (privacy policy, accessibility, legal footer), and the pre-launch checklist.

## Layout

- [`cookieless-by-default.md`](cookieless-by-default.md) — **Charter.** The hard rules that keep Saboteur sites free of cookies, consent banners, and EU-DPA risk. Always load when generating a site.
- [`policy-tooling.md`](policy-tooling.md) — **How `/privacy` and `/terms` get built.** The renderer, the two audits, and why Saboteur uses no third-party policy generator. Read before touching any policy text.
- [`us-state-privacy.md`](us-state-privacy.md) — US state privacy law: which thresholds apply (almost none), which rights Saboteur offers anyway (all of them), and the appeals obligation. **The operative reference for Saboteur.**
- [`gdpr.md`](gdpr.md) — What GDPR Article 13 still requires even without cookies. Lawful bases, processors, cross-border transfer notes. EU customer data is deferred; the disclosures stay published.
- [`privacy-policy/`](privacy-policy/) — The rendered [body](privacy-policy/body.md) (source of truth), [how to use it](privacy-policy/template.md), and the pre-publish [checklist](privacy-policy/checklist.md).
- [`terms-of-service/`](terms-of-service/) — The rendered [body](terms-of-service/body.md) and [how to use it](terms-of-service/template.md).
- [`policy.config.example.json`](policy.config.example.json) — Starting point for a site's `policy.config.json`.
- [`accessibility.md`](accessibility.md) — WCAG 2.2 AA baseline with measured contrast ratios and known gaps.
- [`analytics-choices.md`](analytics-choices.md) — Cloudflare Web Analytics (default), Plausible, or none.
- [`fonts.md`](fonts.md) — Self-hosting IBM Plex via `@fontsource/*`.
- [`third-party-embeds.md`](third-party-embeds.md) — Click-to-load pattern.
- [`forms.md`](forms.md) — Lawful basis, copy, data flow, Cloudflare Worker template.
- [`snippets/`](snippets/) — Reusable HTML. Currently: `click-to-load-embed.html`. (The legal footer is in [`../sections/legal-footer/`](../sections/legal-footer/).)
- [`pre-launch-checklist.md`](pre-launch-checklist.md) — Consolidated checklist; run before every site goes live.
