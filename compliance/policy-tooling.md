# Policy tooling — how /privacy and /terms get built

Saboteur does **not** use a third-party policy generator. The policy text lives in this repo, is rendered deterministically into each site, and is checked against what the site actually does.

This file records the decision (so the research isn't repeated), the toolchain, and how to run it.

## Decision: no generator, own the text

Evaluated July 2026.

| Candidate | Verdict | Why |
|---|---|---|
| [Tempest-Solutions-Company/privacy-policy-generator](https://github.com/Tempest-Solutions-Company/privacy-policy-generator) | **Rejected** | The CLI it advertises does not exist. `cli.js` 404s; the repo is `index.html`, `js/app.js`, `js/generator.js` and three JSON files. The README claims an MIT LICENSE file that isn't in the repo, so the code is all-rights-reserved by default. Created and last pushed `2025-05-01`, 27 minutes apart; six commits, never touched since. |
| [Automattic/legalmattic](https://github.com/Automattic/legalmattic) | **Reference corpus** | Genuinely maintained (859 stars, 454 commits, pushed 2026-05-20). But it's WordPress.com's surface — accounts, user-hosted sites, cookies, DMCA — nothing like a landing page. Licensed **CC BY-SA 4.0**: ShareAlike is viral over prose copied verbatim. We read it for signal and write our own text. |
| [basecamp/policies](https://github.com/basecamp/policies) | **Reference corpus** | CC BY 4.0, which is friendlier, and the plainest legal writing around. Archived 2023-12-26; the maintained version moved to [37signals.com/policies](https://37signals.com/policies). Read the archive for structure, not for currency. |
| [jamiedavenport/openpolicy](https://github.com/jamiedavenport/openpolicy) ("PolicyStack") | **Rejected as a dependency; one idea taken** | Apache-2.0 and actively developed, but it is mainly a *runtime consent SDK* — a consent state machine with React/Vue/Svelte adapters. Saboteur sites are cookieless with no consent banner, so that's the whole product as dead weight, plus npm runtime deps and a closed-source paid cloud tier. Its good idea — scanning the build for undeclared third parties — is reimplemented here in 200 dependency-free lines. |

The reasoning behind "own the text": the templates in this repo are already better fitted than anything a generic generator emits. They are in the Saboteur voice, they name the actual processors, and they describe the actual cookieless posture. A generator would produce something more generic that still needed hand-editing — and hand-editing generated output is how policies drift out of sync with the site.

What we were missing was never source text. It was **rendering** and **verification**.

## The toolchain

Three scripts, no dependencies, Node stdlib only.

### 1. `scripts/render-policies.mjs` — the renderer

Turns the shared bodies plus a per-site config into Astro pages.

```
compliance/privacy-policy/body.md   ─┐
compliance/terms-of-service/body.md ─┼─► render-policies.mjs ─► src/pages/privacy.md
<site>/policy.config.json           ─┘                          src/pages/terms.md
```

Output is markdown with Astro frontmatter, so Astro does the markdown-to-HTML work at build time and we ship no markdown parser. The pages are marked `GENERATED`; **never hand-edit them.** Change the config or the shared body and re-render.

```bash
# from the site's repo root
node <saboteur-sites>/scripts/render-policies.mjs \
  --config ./policy.config.json --out ./src/pages

# CI / pre-launch: prove the committed pages still match the templates
node <saboteur-sites>/scripts/render-policies.mjs \
  --config ./policy.config.json --out ./src/pages --check
```

`--only privacy` or `--only terms` renders one document. This exists because a site can publish its privacy policy before the terms have a governing jurisdiction and mailing address to name.

**Template syntax:**

| Syntax | Resolves against | Notes |
|---|---|---|
| `{{ TOKEN_NAME }}` | `tokens.token_name` | Case-insensitive. Missing or empty is a hard error. |
| `{{#if feature}} … {{/if}}` | `features.feature` | Blocks may nest. Unbalanced blocks are a hard error. |
| `{{#unless feature}} … {{/unless}}` | `features.feature` | |
| `{{#each processors}} … {{/each}}` | the `processors` array | Fields via `{{ this.name }}`. |

A block tag alone on its line takes its newline with it, so a conditional bullet doesn't split a list in two.

**Nothing renders with a placeholder in it.** The renderer refuses output containing `{{`, `[CONDITIONAL]`, `TODO`, `FIXME`, `TBD`, `FILL ME IN`, or lorem ipsum. A policy that fails to build is far better than one that publishes `{{ CONTACT_EMAIL }}`.

**Nothing renders that contradicts its own config.** For each feature flag that is *off*, the renderer checks the output for phrases that only make sense when it is *on* — "contact-form submissions", "web analytics", "embedded content", and so on. A policy that says both "no contact form" and "contact-form submissions if you write to us" is false in one of those claims, and no token check would notice.

This catches two distinct mistakes:

- **Template**: prose describing a feature sits outside its `{{#if}}` block, so it survives into every site regardless of flag. (This is exactly how the intro paragraph shipped broken — see the entry in the log below.)
- **Config**: the flag is off but a related processor is still declared. A site with `contact_form: false` that still lists an email-delivery processor gets caught by the processor's own `purpose` string.

The patterns are deliberately narrow — they match how a feature is described when it *exists*, so they don't fire on the negated prose that legitimately appears when it doesn't ("This site has no contact form…"). Add a pattern when you add a feature flag.

### 2. `scripts/audit-policy-processors.mjs` — truth-checking

A privacy policy is a factual claim about a build. This checks the claim against the build, answering both directions of the question in [`privacy-policy/checklist.md`](privacy-policy/checklist.md):

- **Undeclared:** the built site references a third-party host the policy doesn't name.
- **Over-declared:** the policy names a processor whose declared hosts appear nowhere in the build.

```bash
npm run build
node <saboteur-sites>/scripts/audit-policy-processors.mjs \
  --config ./policy.config.json --dist ./dist
```

It ignores licence banners in minified CSS/JS, HTML comments, and XML namespace URIs — those are text, not requests, and the noise would train you to ignore the tool.

Two config fields drive it:

- **`processors[].hosts`** — domains the *browser* contacts. Leave it `[]` for a processor reached server-side only (Resend, called by the contact Worker, never appears in the built output). Empty means "don't expect to see this one," so it's excluded from the over-declared check.
- **`allowedHosts`** — hosts a visitor only reaches by clicking. An outbound link is not a data transfer and needs no disclosure. Anything the browser fetches *automatically* belongs in `processors` instead.

This is a static scan. It catches hardcoded third-party URLs, which is how a cookieless static site would realistically acquire one. It cannot see a URL assembled at runtime from fragments — the DevTools Network pass in the checklist is still the backstop.

### 3. `scripts/check-policy-upstream.mjs` — staying current

Nothing open source keeps policy text current for you; the products that do (Termageddon and similar) are paid subscriptions. This is the substitute: watch a small corpus maintained by legal teams with real budgets, and report when they change their language.

It pins the last commit touching each watched file in `compliance/policy-upstream.lock.json` and prints a GitHub compare link on drift.

```bash
node <saboteur-sites>/scripts/check-policy-upstream.mjs            # check; exit 1 on drift
node <saboteur-sites>/scripts/check-policy-upstream.mjs --update   # re-pin after reviewing
```

Run it quarterly, or on a schedule. Most upstream changes will not apply to a cookieless landing page — that's expected. The point is to *notice*, not to follow.

It does not copy upstream text. Reading for signal and writing our own keeps us clear of both the CC BY-SA ShareAlike obligation and the mismatch between their product surface and ours.

## Per-site config

Each site repo has a `policy.config.json` at its root. Start from [`policy.config.example.json`](policy.config.example.json).

The config is the **single place** a site's legal facts live. Retention periods, processors, and contact addresses appear in the rendered policy exactly as written here — so the config must describe what the site actually does, not what would be convenient.

## Where the text lives

| File | What it is |
|---|---|
| [`privacy-policy/body.md`](privacy-policy/body.md) | The rendered privacy policy source. **Edit here**, never in a site. |
| [`terms-of-service/body.md`](terms-of-service/body.md) | The rendered terms source. **Edit here**, never in a site. |
| [`privacy-policy/template.md`](privacy-policy/template.md) | How to use the body, and what each token means. |
| [`terms-of-service/template.md`](terms-of-service/template.md) | Same, for terms. |
| [`privacy-policy/checklist.md`](privacy-policy/checklist.md) | Pre-publish verification, including which items the scripts now cover. |
| [`gdpr.md`](gdpr.md) | EU/UK reference. |
| [`us-state-privacy.md`](us-state-privacy.md) | US state reference — the operative one for Saboteur. |

## Defect log

Bugs the tooling has actually shipped, and what now prevents a repeat. Worth reading before editing a shared body.

**2026-07-30 — contact-form clause not gated.** The privacy intro stated unconditionally that "some personal data is processed (server logs always; contact-form submissions if you write to us)". On a site rendered with `contact_form: false` this directly contradicted the `{{#unless contact_form}}` block further down, which said the site had no form at all. Both statements published together.

Root cause: prose describing a feature written outside its conditional. The renderer's placeholder and processor checks both passed, because it was a semantic contradiction rather than an unresolved token or a processor mismatch.

Fixed by splitting the clause into `{{#if}}` / `{{#unless}}` variants, and by adding the consistency check described above — which reproduces as a hard failure against the old text.

**The general lesson:** when adding a sentence to a shared body, ask which flag it depends on. If the answer is "any", it belongs outside a conditional; otherwise it needs one, *and* a contradiction pattern so the next person can't reintroduce the same bug.

## Jurisdictional posture

Saboteur LLC has decided **not to handle EU customer data for now**, so GDPR machinery — collecting DPAs, holding SCC copies, running a formal DSAR workflow — is deferred.

The GDPR *disclosures* stay in the published policy. Three reasons: the text is already written and costs nothing to keep; GDPR's territorial reach follows who can load the page, not who we decide to take as a customer; and removing it would be work now plus the same work again later. "Defer GDPR" means don't invest further in the machinery — not delete the disclosures.

The active investment goes into [`us-state-privacy.md`](us-state-privacy.md), which is where Saboteur actually operates.
