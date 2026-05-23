# Privacy policy — template

Fill-in template for any Saboteur landing page that processes personal data. Per [`../gdpr.md`](../gdpr.md), every Saboteur site processes personal data (server logs at minimum), so every Saboteur site needs this document published.

For the verification checklist before going live, see [`checklist.md`](checklist.md). For the legal scaffolding behind these claims, see [`../gdpr.md`](../gdpr.md).

## How to use this template

1. Copy the markdown body below into the site's `/privacy` page (Astro: `src/pages/privacy.astro` wrapping a Markdown file or using component composition; pure HTML: `/privacy/index.html`).
2. Replace each `{{ TOKEN }}` with the site-specific value. Tokens are listed at the bottom of this file.
3. Remove any **`[CONDITIONAL: …]`** blocks that don't apply to this site (e.g., remove the analytics block if the site has no analytics).
4. Run through [`checklist.md`](checklist.md) before publishing.
5. Date-stamp every update to this policy. Material changes require notifying anyone whose data is held (typically by email to recent form submitters).

## Template body — copy from here

---

# Privacy policy

**Last updated:** {{ LAST_UPDATED }}

This is the privacy policy for **{{ SITE_NAME }}** (`{{ SITE_DOMAIN }}`), operated by **Saboteur LLC**.

We are deliberate about the data we collect. This site is **cookieless** — it sets no cookies, uses no client-side storage, and shows no consent banner. Even so, some personal data is processed (server logs always; contact-form submissions if you write to us). This policy explains what, why, and how.

If anything here is unclear, or if you want to exercise any of the rights described in *Your rights* below, email us at **{{ CONTACT_EMAIL }}**.

## Who we are

**Saboteur LLC** is the data controller for this site. You can reach us at **{{ CONTACT_EMAIL }}**.

## What we collect

### Server logs

When you visit any page on this site, our hosting provider (Cloudflare) records technical information about the request: your IP address, the page requested, the time of the request, the referring URL (if any), and your browser's User-Agent string. This happens automatically as part of how the web works; no script or tracker on our side is involved.

Server logs are retained for **90 days** for security, abuse detection, and basic operational metrics.

**[CONDITIONAL: include if the site uses Cloudflare Web Analytics]**

### Web analytics

This site uses **Cloudflare Web Analytics**, a cookieless analytics service. It records aggregate page views, referrers, country (derived from IP at the edge, not stored), browser class, and device class. **It does not set cookies, does not use client-side storage, and does not identify individual visitors.** No personal profile is built.

**[CONDITIONAL: include if the site has a contact form]**

### Contact form

When you submit the contact form, we collect:

- The name you provide (optional).
- The email address you provide (required, so we can reply).
- The topic you select (optional).
- The contents of your message.

We use this information **only to reply to your message**. We do not add you to a mailing list, share your information with anyone outside the processors named below, or use it for marketing.

Contact form submissions are delivered to a Saboteur LLC inbox via **Resend** (a transactional email service). We retain submissions in the inbox for as long as we're actively replying or resolving your inquiry, then archive or delete them — typically within **12 months**.

**[END CONDITIONAL]**

## Lawful basis for processing

Under the EU/UK General Data Protection Regulation (GDPR), we process personal data on the following lawful bases:

- **Legitimate interest** (Art. 6(1)(f)) — server logs, security, and operational metrics. The interest is operating this site; the impact on you is minimal.
- **Pre-contractual steps** (Art. 6(1)(b)) — handling your contact form submission so we can reply to you.

We do not rely on consent for any default processing on this site.

## Who we share data with

We use the following processors. Each processes data on Saboteur LLC's behalf under a Data Processing Agreement.

| Processor | What it does | Where it's based |
|---|---|---|
| Cloudflare, Inc. | Hosting (Cloudflare Pages), edge logs, web analytics (cookieless). | United States |
| Resend, Inc. | Delivers contact form submissions to our inbox via email. | United States |

We do not sell personal data. We do not share it with third parties for advertising or marketing.

## International transfers

Both Cloudflare and Resend are based in the United States. When data is transferred from the EU or UK to the US through these services, the transfer is governed by EU Standard Contractual Clauses (SCCs) under both processors' Data Processing Agreements. This is the standard safeguard for transfers to the US after the *Schrems II* ruling.

If you would like a copy of the SCCs or DPAs we have in place with these processors, write to **{{ CONTACT_EMAIL }}**.

## How long we keep data

- **Server logs:** 90 days.
- **Contact form submissions:** typically up to 12 months after the inquiry is resolved.
- **Web analytics:** aggregate only; no individual records retained.

If you ask us to delete data sooner (see *Your rights* below), we will.

## Your rights

Under GDPR and similar laws, you have the right to:

- **Access** the personal data we hold about you.
- **Rectify** inaccurate data.
- **Erase** your data ("right to be forgotten").
- **Restrict** processing while we resolve a dispute.
- **Receive your data** in a machine-readable format ("data portability").
- **Object** to processing based on legitimate interest.
- **Withdraw consent** where consent is the basis (rare on this site).
- **Lodge a complaint** with your local data protection authority.

To exercise any of these, email **{{ CONTACT_EMAIL }}**. We respond within one month, as required by GDPR.

**[CONDITIONAL: include if the site is reachable from California]**

If you are a California resident, you also have rights under the California Consumer Privacy Act (CCPA): the right to know what data we collect, the right to delete it, and the right to non-discrimination for exercising your rights. The same email above is the channel for those requests.

**[END CONDITIONAL]**

## Children

This site is not directed at children under 16. We do not knowingly collect personal data from children. If you believe we have, write to **{{ CONTACT_EMAIL }}** and we will delete the data promptly.

## Cookies and tracking

This site uses **no cookies** and **no client-side tracking**. This is a deliberate posture; we audit it before every release. If we ever change this — for example, by adopting an analytics tool that requires consent — we will update this policy and add a consent banner before the change goes live.

## Changes to this policy

We may update this policy as the site or its processors change. The **Last updated** date at the top of this document reflects the most recent change. Material changes (new processors, new categories of data, new purposes) will be flagged at the top of the policy for at least 30 days after taking effect.

## Contact

For any privacy-related question, request, or concern, email **{{ CONTACT_EMAIL }}**.

You can also reach Saboteur LLC by post at the address listed in our [Terms of Service](/terms).

---

## Template tokens

Replace these throughout the body when publishing per site:

| Token | What to fill in | Example |
|---|---|---|
| `{{ LAST_UPDATED }}` | ISO date of the most recent material update. | `2026-05-22` |
| `{{ SITE_NAME }}` | The site or product name. | `OffBeat-FM`, `Saboteur LLC` |
| `{{ SITE_DOMAIN }}` | The site's primary domain. | `offbeat-fm.com`, `saboteur.dev` |
| `{{ CONTACT_EMAIL }}` | The address for privacy / data-subject requests. Should not be the same address used for unrelated traffic if possible. | `privacy@saboteur.dev` |

## Site-specific additions

The template above is the **floor**, not the ceiling. Add a section if the site does anything the template doesn't anticipate:

- A click-to-load embed → name the embed source (e.g., YouTube) as an additional processor; explain that clicking the placeholder is the consent action.
- A newsletter signup → describe the consent basis, the unsubscribe path, the retention policy for subscriber lists.
- Login or accounts → out of scope for landing pages; rewrite the policy substantially.
- Sales or e-commerce → add payment processor (Stripe etc.) as a named processor; describe what's retained for tax/accounting purposes.
