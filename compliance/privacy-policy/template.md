# Privacy policy — how it's built

The policy text itself lives in [`body.md`](body.md). **That file is the single source of truth** — this one explains how to use it and what each token means.

Per [`../gdpr.md`](../gdpr.md), every Saboteur site processes personal data (server logs at minimum), so every Saboteur site publishes this document. For the US-side obligations that actually drive Saboteur's posture, see [`../us-state-privacy.md`](../us-state-privacy.md).

> **Do not copy `body.md` into a site by hand.** It is rendered by
> `scripts/render-policies.mjs` from the site's `policy.config.json`. Hand-copying
> is how the twelve published policies drift apart. See
> [`../policy-tooling.md`](../policy-tooling.md).

## How to publish it on a site

1. Put a `policy.config.json` at the site's repo root, starting from [`../policy.config.example.json`](../policy.config.example.json).
2. Fill in every token below with the site's real values.
3. Set each `features` flag to what the site **actually** does — not what it plans to do.
4. Render:
   ```bash
   node <saboteur-sites>/scripts/render-policies.mjs \
     --config ./policy.config.json --out ./src/pages
   ```
5. Build the site, then verify the policy against the build:
   ```bash
   npm run build
   node <saboteur-sites>/scripts/audit-policy-processors.mjs \
     --config ./policy.config.json --dist ./dist
   ```
6. Run [`checklist.md`](checklist.md) before publishing.
7. Re-render and bump `tokens.last_updated` on every material change.

## Tokens

| Token | What to fill in | Example |
|---|---|---|
| `last_updated` | ISO date of the most recent material update. | `2026-07-30` |
| `site_name` | The site or product name. | `OffBeat-FM`, `Saboteur` |
| `site_domain` | The site's primary domain. | `offbeat-fm.com`, `saboteur.dev` |
| `contact_email` | Address for privacy / data-subject requests. Prefer a dedicated address over one that also takes unrelated traffic. | `privacy@saboteur.dev` |
| `hosting_provider` | Who serves the site and therefore holds the edge logs. | `Cloudflare` |
| `analytics_provider` | Named only when `features.analytics` is true. | `Cloudflare Web Analytics` |
| `email_provider` | Named only when `features.contact_form` is true. | `Resend` |
| `log_retention_days` | Must match the host's configured retention. Verify, don't assume. | `90` |
| `form_retention_months` | How long form submissions stay in the inbox. | `12` |
| `transfer_statement` | One paragraph on cross-border transfers and the safeguard relied on. Varies by processor set. | see the example config |

`legal_email`, `liability_cap`, `governing_jurisdiction` and `mailing_address` are used by the [terms](../terms-of-service/template.md), which renders from the same config.

## Feature flags

Each flag switches a block of the policy on or off. **A flag set wrong makes the policy false**, which is the specific failure mode the FTC treats as a deceptive practice.

| Flag | When true |
|---|---|
| `analytics` | The site loads an analytics script. Adds the web-analytics disclosure and a retention line. |
| `contact_form` | The site has a form that collects personal data. Adds the collection disclosure, the Art. 6(1)(b) basis, and a retention line. When false, the policy states affirmatively that nothing you type is collected. |
| `embeds` | The site uses the click-to-load embed pattern from [`../third-party-embeds.md`](../third-party-embeds.md). Adds the embed disclosure and the consent basis. |
| `newsletter` | Reserved. A newsletter needs consent records, an unsubscribe path, and CAN-SPAM obligations — see [`../us-state-privacy.md`](../us-state-privacy.md) before setting this. |

## Processors

Every processor is an entry in the config's `processors` array with `name`, `purpose`, `location`, and `hosts`.

`hosts` is what the **browser** contacts, and it drives the automated audit:

- A processor the browser talks to directly (an analytics endpoint) lists its domains.
- A processor reached only server-side (Resend, called by the contact Worker) uses `"hosts": []` — it never appears in the built output, so there's nothing to scan for.

Full semantics in [`../policy-tooling.md`](../policy-tooling.md).

## When the template isn't enough

`body.md` is the **floor**, not the ceiling. Extend it — in `body.md`, behind a new feature flag, so every site benefits — if a site does something it doesn't anticipate:

- **A newsletter signup** → consent basis, unsubscribe path, subscriber-list retention.
- **Login or accounts** → out of scope for landing pages; the policy needs substantial rewriting.
- **Sales or e-commerce** → payment processor as a named processor; what's retained for tax and accounting.
- **Anything that profiles individuals** → re-read [`../us-state-privacy.md`](../us-state-privacy.md). This changes the opt-out and GPC posture materially.
