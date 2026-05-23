# Terms of service — template

Fill-in template for Saboteur landing pages. Terms are required wherever the site accepts user input (contact form, newsletter, downloads), and recommended on any public-facing Saboteur site even without user input — they limit liability and set expectations.

For privacy disclosures, see [`../privacy-policy/`](../privacy-policy/). For the legal scaffolding, see [`../gdpr.md`](../gdpr.md).

## How to use this template

1. Copy the body below into the site's `/terms` page.
2. Replace each `{{ TOKEN }}` with the site-specific value. Tokens listed at the bottom.
3. Remove any **`[CONDITIONAL: …]`** blocks that don't apply.
4. Have Saboteur LLC's legal contact review **before publishing** — this template is a starting point, not finished legal text. It is shorter and simpler than a SaaS ToS because Saboteur landing pages do not host user accounts, host user content for redistribution, or transact money. If the site grows to do any of those, the ToS needs to grow with it.

## Template body — copy from here

---

# Terms of service

**Last updated:** {{ LAST_UPDATED }}

These terms govern your use of **{{ SITE_NAME }}** (`{{ SITE_DOMAIN }}`), operated by **Saboteur LLC** ("Saboteur," "we," "us," "our"). By accessing or using this site, you agree to these terms. If you do not agree, please do not use the site.

For how we handle personal data, see our [Privacy Policy](/privacy).

## Use of the site

You may use this site to read information about Saboteur and our products, and (where a contact form is provided) to send us a message.

You agree not to:

- Use the site in a way that violates applicable law.
- Attempt to access systems or data that are not made publicly available through the site.
- Interfere with the site's operation — for example, by sending automated requests at a rate intended to disrupt service.
- Use any automated system to harvest content from the site for republication or commercial use, beyond reasonable indexing by search engines and similar services.
- Impersonate another person when contacting us through the site.

We may suspend or block access from any IP or actor that breaches these terms.

## Intellectual property

All content on this site — including text, design, code, logos, marks, and other materials — is owned by Saboteur LLC or used under license, and is protected by applicable copyright, trademark, and other intellectual-property laws.

You may:

- View, copy, and print pages of the site for **personal, non-commercial reference**.
- Share short quoted excerpts with attribution to Saboteur LLC and a link back to the source page.

You may not:

- Reproduce, republish, or redistribute substantial portions of the site without prior written permission.
- Use Saboteur LLC's marks (including *Saboteur*, *SAB/labs*, *SAB/works*, product wordmarks, the Japanese characters used as part of the marks, and the red structural-bar device) in a way that suggests endorsement, partnership, or origin from Saboteur LLC.

**[CONDITIONAL: include if the site exposes any source code under a specific license]**

Some content on this site may be made available under an open-source license. Where that's the case, the license accompanying the content controls. These terms do not override an open-source license that applies to specific material.

**[END CONDITIONAL]**

## Content you submit

If you submit content to the site — for example, by sending a message through the contact form — you grant Saboteur LLC the right to read, store, and use the content **for the purpose of responding to you and operating the site**.

You retain ownership of what you submit. We do not publish your submissions. We do not share them with third parties for marketing.

You agree that anything you submit:

- Is yours to submit, or you have the rights to submit it.
- Does not violate applicable law.
- Does not contain viruses, malware, or content intended to harm.

## Disclaimers

The site is provided **"as is"** and **"as available."** Saboteur LLC makes no warranty that the site will be uninterrupted, error-free, or suitable for a particular purpose. Statements about products on this site are accurate as of the date posted; product availability, features, and pricing (if any) may change.

To the maximum extent permitted by law, Saboteur LLC disclaims all warranties — express, implied, statutory, or otherwise — including warranties of merchantability, fitness for a particular purpose, and non-infringement.

## Limitation of liability

To the maximum extent permitted by law, Saboteur LLC, its members, officers, employees, and contractors will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the site, even if Saboteur LLC has been advised of the possibility of such damages.

Saboteur LLC's total liability arising out of or relating to these terms or the site will not exceed **{{ LIABILITY_CAP }}**.

This limitation does not apply to liability that cannot be limited under applicable law — for example, liability for gross negligence, willful misconduct, or in jurisdictions that do not permit the exclusion of certain warranties or liabilities.

## Indemnification

You agree to indemnify and hold Saboteur LLC harmless from any claim, loss, or expense (including reasonable attorney fees) arising out of your breach of these terms or your misuse of the site.

## Governing law and disputes

These terms are governed by the laws of **{{ GOVERNING_JURISDICTION }}**, without regard to its conflict-of-laws principles. Any dispute arising out of or relating to these terms or the site will be brought in the courts located in **{{ GOVERNING_JURISDICTION }}**, and you consent to the personal jurisdiction of those courts.

If you are in the EU or UK and have a mandatory consumer right that conflicts with this section, your local consumer protections apply to the extent required by law.

## Changes to these terms

We may update these terms as the site changes. The **Last updated** date at the top reflects the most recent change. Continued use of the site after a change takes effect is your acceptance of the updated terms. Material changes will be flagged at the top of the page for at least 30 days.

## Contact

Questions about these terms? Email **{{ CONTACT_EMAIL }}** or write to:

**Saboteur LLC**
{{ MAILING_ADDRESS }}

---

## Template tokens

| Token | What to fill in | Example |
|---|---|---|
| `{{ LAST_UPDATED }}` | ISO date of the most recent material update. | `2026-05-22` |
| `{{ SITE_NAME }}` | The site or product name. | `OffBeat-FM`, `Saboteur LLC` |
| `{{ SITE_DOMAIN }}` | The site's primary domain. | `offbeat-fm.com`, `saboteur.dev` |
| `{{ CONTACT_EMAIL }}` | The address for terms-related questions. | `legal@saboteur.dev` |
| `{{ MAILING_ADDRESS }}` | Saboteur LLC's registered business address. | (per the LLC's filed address) |
| `{{ LIABILITY_CAP }}` | The cap on liability — typically the greater of fees paid or a nominal amount. For landing pages with no fees, a nominal cap like `US$100` is typical. | `US$100` |
| `{{ GOVERNING_JURISDICTION }}` | The state or country whose law governs and where disputes are heard. | (per the LLC's home jurisdiction) |

## Sections you may need to add per site

The template above is the floor. Add sections if the site does any of the following:

- **Sells anything** → add purchase terms, refund policy, payment processor disclosure.
- **Hosts user content publicly** → add a content policy, takedown procedure, DMCA agent designation (US).
- **Offers a service with uptime claims** → add an SLA.
- **Has an account / login system** → add account-management terms, account-termination terms, password-handling rules.
- **Operates internationally with specific regulatory requirements** → add jurisdiction-specific notices (UK Modern Slavery, German Impressum, French ordering).

A landing page typically does **none of these**, which is why this template is short.
