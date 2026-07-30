# GDPR — what still applies to a cookieless Saboteur site

> **Posture note (July 2026).** Saboteur LLC has decided not to handle EU customer
> data for now, so the GDPR *machinery* — collecting DPAs, holding SCC copies,
> running a formal DSAR workflow — is **deferred**. The GDPR *disclosures* stay in
> the published privacy policy: the text is already written, and GDPR's
> territorial reach follows who can load the page rather than who Saboteur decides
> to take as a customer. Active compliance investment goes to
> [`us-state-privacy.md`](us-state-privacy.md), which is where Saboteur operates.
> This file remains accurate and is what to re-read if that decision reverses.

The cookieless posture (see [`cookieless-by-default.md`](cookieless-by-default.md)) removes the requirement for a consent banner. **It does not remove GDPR.** This file is the reference for what GDPR Article 13 + related obligations still require, why, and how each Saboteur landing page satisfies them.

## What GDPR applies to

GDPR applies whenever Saboteur LLC **processes personal data** of people in the EU or UK. On a cookieless landing page, the personal data Saboteur actually processes is narrower than people assume, but it's not nothing:

| Data | Where it's processed | Personal? |
|---|---|---|
| Visitor IP addresses | Server access logs (Cloudflare edge, origin) | Yes — under GDPR, IPs are personal data. |
| Form submissions (name, email, message) | Cloudflare Worker → Resend → Saboteur inbox | Yes — directly identifying. |
| Approximate geolocation (country) | Cloudflare Web Analytics aggregate | Aggregated, not individually identifying — but inputs are personal data. |
| Browser/OS class | Cloudflare Web Analytics aggregate | Aggregated, not personal at the row level. |

If a site adds analytics that go beyond CF Web Analytics, or any form, or any embed that transmits IPs to a third party, that's additional processing — and additional disclosure.

## Lawful basis for processing

Article 6 requires a lawful basis for every category of processing. Saboteur sites rely on three:

- **Legitimate interest (Art. 6(1)(f))** — for server logs, security/operations, basic abuse prevention. The interest is operating the site; the impact on visitors is minimal; this is the standard basis for log retention.
- **Contract / pre-contractual steps (Art. 6(1)(b))** — for form submissions where the visitor initiates contact. They send a message to get a reply; processing the message to reply is necessary to fulfill that request.
- **Consent (Art. 6(1)(a))** — only when needed. Saboteur sites generally avoid relying on consent. The two cases where consent applies:
  - Click-to-load embeds — clicking the placeholder is the act of consent.
  - Optional newsletter or marketing list signup (if any future site adds one). Default Saboteur posture is to not add these; if added, requires explicit opt-in, separate from the contact form.

## Information requirements (Article 13)

At the point Saboteur LLC collects personal data, it must provide the visitor with the following information. Most of this lives in the published privacy policy (see [`privacy-policy/template.md`](privacy-policy/template.md)); some pieces must also be visible at the point of collection itself.

- **Identity and contact details of the data controller** — *Saboteur LLC* and a working contact email. On any site where Saboteur LLC has appointed someone as a data protection contact, that contact is listed too.
- **Purposes of processing and lawful basis** — e.g., *"We process your IP address (under legitimate interest) for the operation and security of the site."*
- **Recipients or categories of recipients** — the processors used: Cloudflare (hosting, edge logs, analytics if enabled), Resend (email delivery for the contact form). Each processor disclosed by name.
- **Cross-border transfers** — Cloudflare and Resend are US companies. Disclose the transfer; note that both have signed EU Standard Contractual Clauses (post-Schrems II compliance baseline).
- **Retention periods** — explicit periods, not vague language. *"Server logs retained for 90 days. Contact form submissions retained until your inquiry is resolved, then archived for up to 12 months."*
- **Data subject rights** — access, rectification, erasure, restriction, portability, objection. Plus the right to withdraw consent (where consent is the basis) and the right to lodge a complaint with a supervisory authority.
- **Whether providing the data is required** — for the contact form, providing the email is required to receive a reply; nothing else is. The visitor must be able to refuse and still use the site.
- **Automated decision-making** — none on Saboteur landing pages. Document the absence explicitly.

## Data subject rights — what we honor and how

A visitor can write to the published contact email and exercise any of the following. The standard response window under GDPR is **one month** (extendable by two months for complex requests, with notification).

| Right | What it means | How Saboteur honors it |
|---|---|---|
| Access (Art. 15) | "Tell me what data you hold about me." | Search the inbox + CF logs by email/IP, return the matching records. |
| Rectification (Art. 16) | "This data is wrong; fix it." | Edit the relevant message or note in our records. |
| Erasure (Art. 17) | "Delete my data." | Delete inbox thread, ask CF to expedite log purge if needed (logs auto-purge per retention). |
| Restriction (Art. 18) | "Stop processing while we dispute." | Flag the record and don't act on it during the dispute. |
| Portability (Art. 20) | "Give me my data in a machine-readable form." | Export the inbox thread to JSON/CSV. |
| Objection (Art. 21) | "Stop processing under legitimate interest." | For server logs, the practical answer is to anonymize the IP if a specific visitor requests it. |
| Withdraw consent (Art. 7) | "I take back my consent." | Where consent was the basis (newsletter, embed click) — honor the withdrawal going forward. |
| Complaint (Art. 77) | "I'm escalating to a supervisory authority." | Cooperate with the authority's inquiry; provide records as requested. |

## Processors used by every Saboteur site

These appear in every Saboteur privacy policy by default. Add others only when the specific site uses them.

- **Cloudflare, Inc.** — hosting (Cloudflare Pages), edge logs (security/operations), web analytics (cookieless). US-based. Subject to EU Standard Contractual Clauses. [DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) available on request.
- **Resend, Inc.** — transactional email delivery for the contact form. US-based. SCCs. [DPA](https://resend.com/legal/dpa) signable from the account dashboard.

If the site uses a different analytics tool (Plausible, Fathom, etc.), it's added as a processor too — see [`analytics-choices.md`](analytics-choices.md).

## Cross-border transfer (Schrems II)

Both Cloudflare and Resend are US companies. After the *Schrems II* ruling (CJEU, 2020), transfers of EU personal data to the US require additional safeguards beyond the original Privacy Shield framework.

The practical safeguards Saboteur relies on:

- Both processors have signed EU Standard Contractual Clauses (SCCs).
- Both publish transparency reports about government requests for data.
- Personal data processed via Saboteur landing pages is minimal — IPs in logs, contact form contents. No sensitive categories (Article 9), no special-status categories.

This is the **standard posture** for a small EU-or-US-operating site. It is not perfect compliance — perfect compliance would mean EU-only hosting and processors. The Saboteur position is that the trade-off (free CF tier, integrated stack) is acceptable given the minimal data processed. Document this transparently in the privacy policy.

## Children

Saboteur LLC does not knowingly process personal data of children under 16 (the GDPR Article 8 threshold). Saboteur sites are not directed at children. If a child contacts us via the form and we become aware, we delete the record.

This is brief but must appear in the privacy policy.

## What changes if a site adds something new

- **Adds an embed** — the embed source becomes a processor; document it; click-to-load is the only acceptable pattern.
- **Adds analytics beyond CF Web Analytics** — the new tool becomes a processor; document it; verify it's cookieless or add consent.
- **Adds a newsletter** — consent (Art. 6(1)(a)) becomes a new lawful basis; opt-in must be separate; unsubscribe link in every newsletter email; document retention separately.
- **Adds account / auth** — out of scope for landing pages. If a Saboteur site grows into a product surface, GDPR coverage expands considerably; that's not this document's scope.

## What this document is and isn't

This is an **operational reference** for Saboteur LLC, not legal advice. Saboteur LLC bears responsibility for actual compliance; this file documents the team's working understanding of GDPR as it applies to landing pages built from this repo. Significant changes — new processors, new categories of data — should trigger a re-read and possibly a consultation with counsel.
