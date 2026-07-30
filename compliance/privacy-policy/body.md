# Privacy policy

**Last updated:** {{ LAST_UPDATED }}

This is the privacy policy for **{{ SITE_NAME }}** (`{{ SITE_DOMAIN }}`), operated by **Saboteur LLC**.

We are deliberate about the data we collect. This site is **cookieless** — it sets no cookies, uses no client-side storage, and shows no consent banner. Even so, some personal data is processed (server logs always; contact-form submissions if you write to us). This policy explains what, why, and how.

If anything here is unclear, or if you want to exercise any of the rights described below, email us at **{{ CONTACT_EMAIL }}**.

## Who we are

**Saboteur LLC** is the data controller for this site. You can reach us at **{{ CONTACT_EMAIL }}**.

## What we collect

### Server logs

When you visit any page on this site, our hosting provider ({{ HOSTING_PROVIDER }}) records technical information about the request: your IP address, the page requested, the time of the request, the referring URL (if any), and your browser's User-Agent string. This happens automatically as part of how the web works; no script or tracker on our side is involved.

Server logs are retained for **{{ LOG_RETENTION_DAYS }} days** for security, abuse detection, and basic operational metrics.

{{#if analytics}}
### Web analytics

This site uses **{{ ANALYTICS_PROVIDER }}**, a cookieless analytics service. It records aggregate page views, referrers, country (derived from IP at the edge, not stored), browser class, and device class. **It does not set cookies, does not use client-side storage, and does not identify individual visitors.** No personal profile is built.
{{/if}}

{{#if contact_form}}
### Contact form

When you submit the contact form, we collect:

- The name you provide (optional).
- The email address you provide (required, so we can reply).
- The topic you select (optional).
- The contents of your message.

We use this information **only to reply to your message**. We do not add you to a mailing list, share your information with anyone outside the processors named below, or use it for marketing.

Contact form submissions are delivered to a Saboteur LLC inbox via **{{ EMAIL_PROVIDER }}** (a transactional email service). We retain submissions in the inbox for as long as we're actively replying or resolving your inquiry, then archive or delete them — typically within **{{ FORM_RETENTION_MONTHS }} months**.
{{/if}}

{{#if embeds}}
### Embedded content

Some pages include embedded content from a third party. That content does **not** load until you click the placeholder that stands in for it. Clicking is the action that loads it; until then, no request reaches the third party and no data about you is sent. Once you click, the embed provider receives your IP address and can set its own cookies under its own policy, not ours. The provider is named in the processors table below.
{{/if}}

{{#unless contact_form}}
This site has no contact form, no newsletter signup, and no other input field. Beyond the server logs described above, we collect nothing you type.
{{/unless}}

## Lawful basis for processing

Under the EU/UK General Data Protection Regulation (GDPR), we process personal data on the following lawful bases:

- **Legitimate interest** (Art. 6(1)(f)) — server logs, security, and operational metrics. The interest is operating this site; the impact on you is minimal.
{{#if contact_form}}
- **Pre-contractual steps** (Art. 6(1)(b)) — handling your contact form submission so we can reply to you.
{{/if}}
{{#if embeds}}
- **Consent** (Art. 6(1)(a)) — loading an embed. Clicking the placeholder is the consent; not clicking withholds it.
{{/if}}

We do not rely on consent for any default processing on this site.

## Who we share data with

We use the following processors. Each processes data on Saboteur LLC's behalf under a Data Processing Agreement.

| Processor | What it does | Where it's based |
|---|---|---|
{{#each processors}}
| {{ this.name }} | {{ this.purpose }} | {{ this.location }} |
{{/each}}

We do not share personal data with third parties for advertising or marketing.

## We do not sell your personal data

Saboteur LLC **does not sell personal data**, and does not share it for cross-context behavioural advertising, as those terms are defined under the California Consumer Privacy Act (CCPA/CPRA) and comparable US state privacy laws. We have not done so in the preceding twelve months.

We also do not use your data for **targeted advertising** or for **profiling** that produces legal or similarly significant effects. There is no advertising network, data broker, or ad-tech vendor in this site's stack.

Because we do not sell or share personal data, there is nothing for a "Do Not Sell or Share My Personal Information" link to opt you out of. We honour browser-level universal opt-out signals such as **Global Privacy Control (GPC)** by default, in the sense that the processing those signals govern does not happen here at all.

## International transfers

{{ TRANSFER_STATEMENT }}

If you would like a copy of the Standard Contractual Clauses or Data Processing Agreements we have in place with these processors, write to **{{ CONTACT_EMAIL }}**.

## How long we keep data

- **Server logs:** {{ LOG_RETENTION_DAYS }} days.
{{#if contact_form}}
- **Contact form submissions:** typically up to {{ FORM_RETENTION_MONTHS }} months after the inquiry is resolved.
{{/if}}
{{#if analytics}}
- **Web analytics:** aggregate only; no individual records retained.
{{/if}}

If you ask us to delete data sooner, we will.

## Your rights — EU and UK

Under GDPR, you have the right to:

- **Access** the personal data we hold about you.
- **Rectify** inaccurate data.
- **Erase** your data ("right to be forgotten").
- **Restrict** processing while we resolve a dispute.
- **Receive your data** in a machine-readable format ("data portability").
- **Object** to processing based on legitimate interest.
- **Withdraw consent** where consent is the basis (rare on this site).
- **Lodge a complaint** with your local data protection authority.

To exercise any of these, email **{{ CONTACT_EMAIL }}**. We respond within one month, as required by GDPR.

## Your rights — United States

US privacy rights are set state by state. Rather than track which of your rights depend on where you live, we extend the following to **every US resident who asks**, regardless of state and regardless of whether that state's law technically applies to a business our size.

You have the right to:

- **Know** what categories of personal data we have collected about you, why, and who we shared it with.
- **Access** a copy of that data.
- **Correct** inaccurate personal data.
- **Delete** personal data we hold about you.
- **Portability** — receive your data in a portable, machine-readable format.
- **Opt out** of sale, sharing for cross-context behavioural advertising, targeted advertising, and profiling. As described above, we do none of these, so there is nothing to opt out of.
- **Non-discrimination** — we will not treat you differently, or degrade the site for you, because you exercised any of these rights.

We do not collect **sensitive personal information** as US state privacy laws define it — no government identifiers, precise geolocation, biometric or health data, racial or ethnic origin, religious beliefs, sexual orientation, or contents of your private communications with other people. There is therefore no "limit the use of my sensitive personal information" right to exercise here.

To make a request, email **{{ CONTACT_EMAIL }}** from the address you contacted us with, or describe the request well enough that we can locate the records. We respond within **45 days**, and will tell you if we need the extension that most state laws allow.

### If we deny your request

You may **appeal**. Reply to our decision, or write to **{{ CONTACT_EMAIL }}** with the word *appeal* in the subject line. We will review the decision and respond in writing within **45 days**, explaining our reasoning. If we deny the appeal, we will give you a way to contact your state Attorney General to complain. This appeals process is required by several state privacy laws and we offer it to everyone.

### California

If you are a California resident, the rights above are your CCPA/CPRA rights. The categories of personal data we collect are listed in *What we collect*; the business purposes are listed alongside them; the processors we disclose data to are named in the table above. An authorised agent may submit a request on your behalf if they provide written proof that you authorised them.

## Children

This site is not directed at children. We do not knowingly collect personal data from children under 16, and we do not sell or share the personal data of anyone under 16 — a distinct requirement under California law. If you believe we have collected a child's data, write to **{{ CONTACT_EMAIL }}** and we will delete it promptly.

## Automated decision-making

There is none. We do not make automated decisions about you that produce legal or similarly significant effects, and we do not profile you.

## Cookies and tracking

This site uses **no cookies** and **no client-side tracking**. This is a deliberate posture; we audit it before every release. If we ever change this — for example, by adopting an analytics tool that requires consent — we will update this policy and add a consent banner before the change goes live.

## Changes to this policy

We may update this policy as the site or its processors change. The **Last updated** date at the top of this document reflects the most recent change. Material changes (new processors, new categories of data, new purposes) will be flagged at the top of the policy for at least 30 days after taking effect.

## Contact

For any privacy-related question, request, or concern, email **{{ CONTACT_EMAIL }}**.

You can also reach Saboteur LLC by post at the address listed in our [Terms of Service](/terms).
