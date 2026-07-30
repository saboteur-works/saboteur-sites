# Terms of service — how it's built

The terms text lives in [`body.md`](body.md). **That file is the single source of truth** — this one explains how to use it.

Terms are required wherever the site accepts user input (contact form, newsletter, downloads), and recommended on any public-facing Saboteur site even without input — they limit liability and set expectations.

> **Do not copy `body.md` into a site by hand.** It renders from the site's
> `policy.config.json` via `scripts/render-policies.mjs`, the same config that
> renders the [privacy policy](../privacy-policy/template.md). See
> [`../policy-tooling.md`](../policy-tooling.md).

**Have Saboteur LLC's legal contact review the rendered page before publishing.** This is a starting point, not finished legal text. It is shorter and simpler than a SaaS ToS because Saboteur landing pages do not host user accounts, redistribute user content, or transact money. If a site grows to do any of those, the terms need to grow with it.

## Jurisdiction and address

Two tokens appear in the rendered terms as **binding statements** — they name the court that hears disputes and the address that receives legal notice:

| Token | Value |
|---|---|
| `governing_jurisdiction` | `the State of Utah, United States` |
| `mailing_address` | `7533 S Center View Ct Ste N<br>West Jordan, UT 84084<br>United States` |

These are Saboteur LLC's real jurisdiction and filed address, and they ship pre-filled in [`../policy.config.example.json`](../policy.config.example.json) and the starter config — they are the same for every Saboteur site, so there is nothing to fill in per site.

The address uses `<br>` rather than markdown's two-trailing-spaces line break, because the renderer strips trailing whitespace.

**If either value is ever blanked or placeholdered, the renderer refuses to emit the terms.** That is deliberate: terms naming the wrong court are worse than no terms. In that situation, publish privacy alone and remove the Terms link from the legal footer rather than shipping a link to a 404:

```bash
node <saboteur-sites>/scripts/render-policies.mjs \
  --config ./policy.config.json --out ./src/pages --only privacy
```

Do not substitute a guess. Ask.

## Other tokens

| Token | What to fill in | Example |
|---|---|---|
| `last_updated` | ISO date of the most recent material update. | `2026-07-30` |
| `site_name` | The site or product name. | `OffBeat-FM` |
| `site_domain` | The site's primary domain. | `offbeat-fm.com` |
| `legal_email` | Address for terms-related questions. | `legal@saboteur.dev` |
| `liability_cap` | The cap on liability. For a landing page with no fees, a nominal cap is typical. | `US$100` |

## Feature flags

| Flag | When true |
|---|---|
| `contact_form` | Adds the *Content you submit* section, the anti-impersonation clause, and the contact-form mention in *Use of the site*. |
| `open_source_content` | The site exposes source code under a specific licence. Adds the clause stating that the accompanying licence controls over these terms. |

## Sections you may need to add per site

`body.md` is the floor. Add sections — behind a new flag, so every site benefits — if the site:

- **Sells anything** → purchase terms, refund policy, payment processor disclosure.
- **Hosts user content publicly** → content policy, takedown procedure, DMCA agent designation (US).
- **Offers a service with uptime claims** → an SLA.
- **Has accounts or login** → account management, termination, credential handling.
- **Operates under specific regional requirements** → jurisdiction-specific notices (UK Modern Slavery, German Impressum, French ordering).

A landing page typically does **none** of these, which is why the terms are short.
