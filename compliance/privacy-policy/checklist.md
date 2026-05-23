# Privacy policy — pre-publish checklist

Run before publishing the privacy policy on any Saboteur site. Each item should be **verifiable** — you should be able to point at the specific page section or browser inspector tab that confirms it.

## Content checks

- [ ] All `{{ TOKEN }}` placeholders from [`template.md`](template.md) have been replaced with real values.
- [ ] **Last updated** date is current (within the last week of publication).
- [ ] **Saboteur LLC** is named explicitly as the data controller.
- [ ] A working contact email is listed for privacy / data-subject requests. Sending a test email gets through, not bounces.
- [ ] Every **`[CONDITIONAL: …]`** block has been either filled in (with the conditional markers removed) or deleted, based on whether the site actually does that thing.
- [ ] No `[CONDITIONAL]` or `[END CONDITIONAL]` markers remain in the published copy.

## Truthfulness checks

The policy must match what the site actually does. Verify each claim:

- [ ] *"This site uses no cookies."* — Browser DevTools → Application → Cookies for this origin is empty.
- [ ] *"No client-side storage."* — Browser DevTools → Application → Local Storage, Session Storage, IndexedDB all empty.
- [ ] *"Server logs retained for 90 days."* — Cloudflare retention is set to ≤ 90 days. If it's longer, update the policy; if it's shorter, also update the policy.
- [ ] *"Cloudflare Web Analytics (if disclosed)"* — The CF Web Analytics snippet is actually in the page, and no other analytics is.
- [ ] *"Contact form submissions delivered via Resend (if disclosed)"* — The form's Worker actually calls Resend; no alternative backend.
- [ ] **No processor is named in the policy that the site doesn't actually use.** Every processor listed must correspond to a real network request or backend call.
- [ ] **No processor that the site uses is omitted from the policy.** Open DevTools → Network on a fresh load. Every third-party request that captures personal data (IP, identifiers) belongs in the policy.

## Coverage checks

- [ ] Every lawful basis the site relies on is named with its GDPR article reference (e.g., "Art. 6(1)(b)").
- [ ] Retention periods are **specific**, not vague (e.g., "90 days" — not "as long as necessary").
- [ ] Cross-border transfer disclosure is present and names the SCC-based safeguard.
- [ ] All eight GDPR data-subject rights are listed (access, rectification, erasure, restriction, portability, objection, withdraw consent, complaint).
- [ ] CCPA section is present *if and only if* the site is reachable from California (in practice: any public web property). Saboteur sites generally should include it.
- [ ] A children's-data statement is present.
- [ ] An update-handling clause is present, with a notification commitment for material changes.

## Linking & access

- [ ] The privacy policy is reachable from the legal footer on every page of the site (`/privacy`).
- [ ] The privacy policy is reachable from the contact form (a link, or the lawful-basis copy near the submit button references it).
- [ ] The page loads without any third-party requests itself (the privacy policy page should be as clean as any other site page).
- [ ] The page has a stable URL — `/privacy`. No query parameters, no redirects.

## Layout & accessibility

- [ ] The privacy policy page passes the same accessibility checks as any other site page (see [`../accessibility.md`](../accessibility.md)).
- [ ] Headings are properly nested (`h1` for the title, `h2` for sections).
- [ ] Tables in the policy have headers; screen readers can navigate them.
- [ ] No tiny-print escape hatches. The legal text is the same size and color as body text elsewhere on the site.

## Sign-off

- [ ] Someone other than the person who wrote the changes has read the published page top to bottom.
- [ ] The page reads in the Saboteur voice — restrained, factual, no template jargon left over.

If any item fails, do not publish. Fix it, re-run the relevant checks, then publish.
