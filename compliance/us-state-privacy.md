# US state privacy law — what applies to a Saboteur site

Companion to [`gdpr.md`](gdpr.md). That file covers the EU/UK side; this one covers the United States, which is where Saboteur LLC actually operates.

There is no federal comprehensive privacy law. The obligations come state by state, and the number of states keeps growing: **22 states have enacted** comprehensive consumer privacy laws, and **20 are in force during 2026** — Indiana, Kentucky, and Rhode Island joined on 1 January 2026.

The short version for a Saboteur landing page: **almost none of these laws technically apply to us, and we honour them anyway.** The rest of this file explains why that's the cheaper posture.

## Why the laws mostly don't apply

Every comprehensive state privacy law has an applicability threshold. The common shape:

| Law | Applies when a business… |
|---|---|
| California (CCPA/CPRA) | has >$25M annual gross revenue; **or** buys/sells/shares the personal data of 100,000+ California consumers or households; **or** derives ≥50% of revenue from selling or sharing personal data. |
| Most other states (VA, CO, CT, TX, OR, MT, DE, NJ, MD, IN, KY, RI, …) | processes the personal data of ~100,000 consumers in a year; **or** ~25,000 consumers *and* derives significant revenue from selling it. |
| Texas, Nebraska, Minnesota | use a small-business carve-out instead of a numeric threshold — but selling *sensitive* data still requires prior consent, small business or not. |

Saboteur LLC is nowhere near any of these. A landing page with server logs and a contact form does not process 100,000 consumers' data, does not sell data, and does not derive revenue from data.

**This is not a reason to skip the disclosures.** Three reasons:

1. **Thresholds move and sites grow.** A product that takes off crosses 100,000 visitors long before anyone remembers to revisit the privacy policy. Writing the policy correctly once is cheaper than auditing it under pressure later.
2. **Other layers apply regardless of size.** California's CalOPPA requires a conspicuous privacy policy from *any* commercial site collecting personal data from Californians, with no revenue or volume threshold at all. Section 5 of the FTC Act makes a materially inaccurate privacy policy an unfair or deceptive practice — that applies to a one-person LLC exactly as it applies to Google.
3. **The marginal cost is zero.** The rights are already in the template. Offering them to everyone is one paragraph shorter than explaining which states qualify.

## The Saboteur posture

**Extend every right to every US resident who asks, without checking their state.** This is what [`privacy-policy/body.md`](privacy-policy/body.md) publishes. It avoids a state-by-state matrix that would need maintaining every January, and it is never wrong in the direction that matters.

## What the state laws commonly require

The rights converge across states. A Saboteur site offers all of them:

| Right | What it means | How Saboteur honors it |
|---|---|---|
| Know / Access | "What have you collected about me, and why?" | Categories are listed in the policy. For a specific request, search the inbox and edge logs by email/IP and return matching records. |
| Correct | "This is wrong; fix it." | Edit the record. |
| Delete | "Remove my data." | Delete the inbox thread; logs age out on the published retention schedule. |
| Portability | "Give it to me in a usable format." | Export the thread to JSON or plain text. |
| Opt out of sale / sharing / targeted advertising / profiling | "Stop monetising me." | Nothing to stop — we do none of these. The policy states this affirmatively, which is itself the required disclosure. |
| Limit use of sensitive personal information | Applies to SSNs, precise geolocation, biometrics, health, race, religion, sexual orientation, private message contents. | We collect none of these categories. Documented as an explicit absence. |
| Non-discrimination | Exercising a right can't get you a degraded service. | There is no account and no tier, so there is nothing to degrade. |
| **Appeal** | A denied request must have a review path. | Reply with *appeal* in the subject; written decision within 45 days, plus the state AG's contact route if we still deny. |

The appeal right is the one most often missed. Virginia, Colorado, Connecticut, Texas, Montana and others require a controller to *establish and describe* an appeals process. Response windows range from 45 to 60 days by state; Saboteur commits to 45 across the board rather than tracking which is which.

## Response deadlines

- **Initial response:** 45 days. Every current state law allows one extension of 45 days where the request is complex — tell the requester before taking it.
- **Appeal decision:** 45 days (some states allow 60).
- Compare GDPR's one month. The Saboteur policy publishes both windows in their respective sections.

## Universal opt-out signals (GPC)

California, Colorado, Connecticut, Texas, Montana and a growing list require honouring browser-level opt-out signals — in practice **Global Privacy Control (GPC)**.

A Saboteur site needs no GPC handling code. GPC governs sale, sharing, and targeted advertising; none of those happen here. The privacy policy says so directly rather than staying silent, because silence reads as non-compliance to anyone checking.

**If a site ever adds an ad pixel, an affiliate tag, or analytics that profiles individuals, this changes immediately** — GPC then needs real handling, and this file needs rewriting.

## Sensitive data and children

- Saboteur sites collect **no** sensitive personal information as the state laws define it. This is worth keeping true; it removes an entire compliance surface.
- California prohibits selling or sharing the personal data of anyone under 16 without opt-in. Saboteur doesn't sell anyone's data, so this is satisfied by construction — but the policy states it explicitly because the statute expects an explicit statement.
- COPPA (federal, under-13) applies to sites *directed at children*. Saboteur sites are not. Don't make one that is without revisiting this file.

## What changes if a site adds something

- **Analytics that identify individuals** → likely becomes "targeted advertising" or "profiling" under several states. Needs opt-out plumbing and GPC handling. Prefer keeping analytics aggregate and cookieless.
- **An ad pixel or affiliate link with a tracking parameter** → this is "sharing" under CCPA even with no money changing hands. It would require a *Do Not Sell or Share My Personal Information* link. Strongly avoid.
- **A newsletter** → adds a consent record and an unsubscribe obligation (CAN-SPAM, federal, applies at any size: working unsubscribe, honoured within 10 business days, and a physical mailing address in every commercial email).
- **Selling anything** → payment processor becomes a processor; tax and accounting records get their own retention period; several state thresholds get closer.
- **Crossing 100,000 users** → the thresholds above stop being theoretical. Re-read this file and consider counsel.

## What this document is and isn't

This is an **operational reference** for Saboteur LLC, not legal advice. It reflects the working understanding of US state privacy law as of **July 2026**, a landscape that changes every legislative session. New laws take effect most commonly on 1 January and 1 July. Re-read this file each January, and consult counsel before launching anything that sells, profiles, or targets.
