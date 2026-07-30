# Privacy policy — pre-publish checklist

Run before publishing the privacy policy on any Saboteur site. Each item should be **verifiable** — you should be able to point at the specific page section or browser inspector tab that confirms it.

Items marked 🤖 are covered by a script. Run the three commands below first; they clear most of the mechanical checks and leave you the ones that need judgment.

## Run these first

```bash
# 1. The committed pages still match the templates and config.
node <saboteur-sites>/scripts/render-policies.mjs \
  --config ./policy.config.json --out ./src/pages --check

# 2. The policy's processor claims match the actual build.
npm run build
node <saboteur-sites>/scripts/audit-policy-processors.mjs \
  --config ./policy.config.json --dist ./dist

# 3. Upstream reference policies haven't moved since we last read them.
node <saboteur-sites>/scripts/check-policy-upstream.mjs
```

All three exiting 0 is a precondition for publishing, not a substitute for the rest of this list. See [`../policy-tooling.md`](../policy-tooling.md).

## Content checks

- [x] 🤖 All `{{ TOKEN }}` placeholders have been replaced — the renderer refuses to emit output containing one.
- [x] 🤖 No `TODO`, `FIXME`, `TBD`, `FILL ME IN`, or `[CONDITIONAL]` markers remain — same check.
- [x] 🤖 Conditional blocks resolved per the config's `features` flags rather than by hand.
- [x] 🤖 The policy does not contradict its own config — the renderer checks, for every flag that is off, that no prose describing that feature survived.
- [ ] **Each `features` flag actually matches the site.** The renderer enforces that a flag is *set*, and that the prose is consistent with it; only you can confirm it's set *correctly*. A flag that is wrong but internally consistent produces a confidently false policy, and no script can catch that.
- [ ] **Last updated** date is current (within the last week of publication).
- [ ] **Saboteur LLC** is named explicitly as the data controller.
- [ ] A working contact email is listed for privacy / data-subject requests. Sending a test email gets through, not bounces.

## Truthfulness checks

The policy must match what the site actually does. Verify each claim:

- [ ] *"This site uses no cookies."* — Browser DevTools → Application → Cookies for this origin is empty.
- [ ] *"No client-side storage."* — Browser DevTools → Application → Local Storage, Session Storage, IndexedDB all empty.
- [ ] *"Server logs retained for N days."* — the host's configured retention matches `tokens.log_retention_days` exactly. If it's longer *or* shorter, update the config and re-render.
- [ ] *"Analytics (if disclosed)"* — the disclosed analytics snippet is actually in the page, and no other analytics is.
- [ ] *"Contact form submissions delivered via <provider> (if disclosed)"* — the form's Worker actually calls that provider; no alternative backend.
- [x] 🤖 **No processor is named that the site doesn't use** — the audit's over-declared check, for processors with declared `hosts`.
- [x] 🤖 **No third-party host the site contacts is missing from the policy** — the audit's undeclared check.
- [ ] **The DevTools Network backstop.** The audit is a static scan and can't see a URL assembled at runtime. Open DevTools → Network on a fresh load of every page and confirm the request list matches the declared processors.
- [ ] Server-side calls are disclosed. A processor with `"hosts": []` is invisible to the audit by design — confirm by reading the Worker source that the policy names every backend it calls.

## Coverage checks

- [ ] Every lawful basis the site relies on is named with its GDPR article reference (e.g., "Art. 6(1)(b)").
- [ ] Retention periods are **specific**, not vague (e.g., "90 days" — not "as long as necessary").
- [ ] Cross-border transfer disclosure is present and names the SCC-based safeguard.
- [ ] All eight GDPR data-subject rights are listed (access, rectification, erasure, restriction, portability, objection, withdraw consent, complaint).
- [ ] A children's-data statement is present.
- [ ] An update-handling clause is present, with a notification commitment for material changes.

### US state coverage

Per [`../us-state-privacy.md`](../us-state-privacy.md). These ship in `body.md` by default; verify none were lost in a site-specific edit.

- [ ] The US rights section lists know/access, correct, delete, portability, opt-out, and non-discrimination.
- [ ] An **appeals process** is described, with a response window and a route to a state Attorney General. This is the most commonly missed requirement.
- [ ] The 45-day US response window is stated (distinct from GDPR's one month).
- [ ] There is an affirmative statement that Saboteur **does not sell or share** personal data, and does not use it for targeted advertising or profiling.
- [ ] Universal opt-out signals (GPC) are addressed rather than left silent.
- [ ] Sensitive personal information is addressed — for Saboteur sites, as an explicit absence.
- [ ] The "no automated decision-making" statement is present.
- [ ] If the site added an ad pixel, affiliate tag, or individual-level analytics, **stop** — the no-sale/no-sharing claims are now false. Re-read `us-state-privacy.md` before publishing.

## Linking & access

- [ ] The privacy policy is reachable from the legal footer on every page of the site (`/privacy`).
- [ ] The privacy policy is reachable from the contact form (a link, or the lawful-basis copy near the submit button references it).
- [ ] The page loads without any third-party requests itself (the privacy policy page should be as clean as any other site page).
- [ ] The page has a stable URL — `/privacy`. No query parameters, no redirects.

## Layout & accessibility

- [ ] The privacy policy page passes the same accessibility checks as any other site page (see [`../accessibility.md`](../accessibility.md)).
- [ ] Headings are properly nested (`h1` for the title, `h2` for sections).
- [ ] Tables in the policy have headers; screen readers can navigate them.
- [ ] No tiny-print escape hatches. The legal text is at least as readable as the marketing copy above it — `Legal.astro` runs it at 15px `fg-secondary` (8.3:1) for this reason.

## Sign-off

- [ ] Someone other than the person who wrote the changes has read the published page top to bottom.
- [ ] The page reads in the Saboteur voice — restrained, factual, no template jargon left over.
- [ ] The rendered pages carry the `GENERATED` banner and were **not** hand-edited. If a site needed a wording change, it was made in `body.md` or the config and re-rendered.

If any item fails, do not publish. Fix it, re-run the relevant checks, then publish.
