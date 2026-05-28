---
name: assess-saboteur-site
description: >
  Assess an existing Saboteur LLC landing page for correctness. Checks whether
  required sections are present, required text strings are intact, prose has
  drifted from brand voice, or hard invariants have been violated. Outputs a
  structured report of all findings. If problems are found, offers to repair
  them by routing to `update-saboteur-site` (for copy and page-element changes)
  or by applying direct edits (for literal invariant violations). Use when the
  user wants to audit, check, validate, lint, or verify a Saboteur site.
  Invoke as /assess-saboteur-site, optionally passing a local repository path.
argument_hint: repository
---

# Assess Saboteur Landing Page

Director skill that audits an existing Saboteur LLC landing page against the canonical standards in `saboteur-sites/`, reports any problems, and routes repairs through the appropriate sub-skill or applies direct edits.

## Usage

```
/assess-saboteur-site [repository]
```

- `repository` — local filesystem path to the Saboteur site repo to assess (e.g. `~/Repositories/saboteur-works/offbeat-fm-site`). Required.

Missing arguments are collected interactively. This iteration supports local repositories only.

---

## Instructions

You are auditing a Saboteur LLC landing page. Follow these steps exactly, in order.

### Step 1 — Parse arguments

`$ARGUMENTS` may contain one token: `[repository]`. Extract what's there; note what's missing.

### Step 2 — Resolve the repository path

If `repository` was not supplied, ask the user for the local path of the repo to assess.

Expand `~` and make the path absolute. Verify the path exists on disk. If it doesn't, warn the user and stop.

If the path looks like a URL or refers to a remote repository, tell the user this iteration only supports local paths and stop.

### Step 3 — Validate the target is a Saboteur site

Same guardrail as `update-saboteur-site`. Confirm the repo has the structure of a Saboteur landing page before reading further.

Required markers (all must be present):

1. `package.json` at the repo root
2. `astro.config.mjs` at the repo root
3. `src/pages/index.astro`
4. `src/layouts/Base.astro`
5. `src/components/` directory exists and contains at least one `.astro` file
6. At least one Saboteur brand token (`brand-red`, `brand-white`, `brand-black`, `brand-surface`, or `brand-rule`) appears somewhere under `src/`

If any marker is missing, **do not read further into the repo and do not run the assessment**. Print a warning listing exactly which markers are missing. Ask the user to confirm before continuing — assessment is read-only, but reading prose from a non-Saboteur repo and reporting "voice drift" against Saboteur rules is misleading.

### Step 4 — Locate the saboteur-sites reference

The assessment compares the target repo against canonical standards. You need `saboteur-sites/` available.

```bash
find ~/Repositories ~/repos ~/code ~/dev ~/Projects ~/projects ~/workspace ~/src -maxdepth 4 -name "AGENT.md" -path "*/saboteur-sites/*" 2>/dev/null | head -1
```

If not found, ask the user where they cloned `https://github.com/saboteur-works/saboteur-sites`. Store the resolved path as SITES.

Read these reference files before running checks:

1. `$SITES/brand/identity.md` — voice rules
2. `$SITES/sites/landing-page/required-sections.md` — required-section list and rules
3. `$SITES/sites/landing-page/optional-sections.md` — optional-section list and rules
4. `$SITES/sections/SHARED-image-rules.md` — image allowed/forbidden surfaces
5. `$SITES/compliance/cookieless-by-default.md` — the four hard cookieless rules
6. The relevant section READMEs under `$SITES/sections/` (load lazily — only for sections present in the target repo)

### Step 5 — Detect variant

Read `src/components/Hero.astro` in the target repo. If it contains the Japanese-tier text (e.g., `サボタージ員`) or a CREATOR-FIRST descriptor, the page is the **parent** variant. Otherwise it is the **product** variant. Record this — required-section and required-text checks differ by variant.

### Step 6 — Run assessment checks

Run all four check groups. Collect every finding into a single report; do not stop at the first failure. Each finding gets a unique `P#` identifier.

#### A. Required sections

Read `src/pages/index.astro` to see which components are imported and composed. Then check:

| Check | Variant | How |
|---|---|---|
| `Nav.astro` exists and is composed first | both | `ls src/components/Nav.astro` + position check in `index.astro` |
| `Hero.astro` exists and is composed second | both | same |
| `Mission.astro` exists and is composed third | both | same |
| `LegalFooter.astro` exists and is composed last | both | same |
| `ProductsPreview.astro` exists | parent only | required per `required-sections.md` (parent variant) |
| `Contact.astro` exists if the site advertises a contact channel | both | not strictly required, but flag as a *soft* finding when the page README or hero mentions "get in touch" but no Contact component exists |

For each missing required section, file a finding:
- **Category:** Required section
- **Location:** `src/pages/index.astro` and `src/components/`
- **Suggested repair:** `update-saboteur-site` with `update_type=page-elements` (add)

#### B. Required text

For each section present, grep the component file for its required text invariants.

| Section | Required text / pattern | Reference |
|---|---|---|
| Hero | `<em class="not-italic` wrapping the middle stance clause | `sections/hero/README.md` |
| Mission | `<em class="not-italic` wrapping the white pivot | `sections/mission/README.md` |
| Contact (if present) | `We read everything. We reply to most of it.` — verbatim closing line | `sections/contact/README.md` |
| Contact (if present) | `We'll only use your email to reply.` — lawful-basis copy below submit (verbatim opener) | same |
| Contact (if present) | `<input` with `name="company"` — the honeypot field | same |
| Contact (if present) | Submit button class includes `bg-brand-red` | same |
| LegalFooter | Contains `Saboteur LLC` in the sign-off | `sections/legal-footer/README.md` |
| LegalFooter | Has both a Privacy link (`href="/privacy"`) and a Terms link (`href="/terms"`) | same |
| LegalFooter | Sign-off year is current (compare against today's year — if it lags by more than one year, file a finding) | same |
| ProductsPreview (parent) | Each card descriptor ends with the sub-brand suffix `— SAB/works` or `— SAB/labs`, not the product domain | `sections/products-preview/README.md` |

For each missing/wrong text, file a finding:
- **Category:** Required text
- **Location:** `src/components/<Section>.astro:<line>` if a line can be identified
- **Suggested repair:** depends on how invasive the fix is. For a small literal swap (e.g., outdated year, wrong descriptor suffix), direct edit. For anything that affects copy meaning, route to `update-saboteur-site` with `update_type=section-copy`.

#### C. Invariants and constraints

Run these as grep-style checks across `src/` and `public/` (skip `node_modules/` and `dist/`).

| Check | Search | Allowed where |
|---|---|---|
| No `#FFFFFF` literal (case-insensitive) | `grep -rni "#ffffff\|#fff[^0-9a-f]" src/` | nowhere — use `brand-white` |
| No `fonts.googleapis.com` reference | `grep -rn "fonts.googleapis.com" src/ public/` | nowhere |
| No `localStorage` / `sessionStorage` / `document.cookie` | `grep -rEn "localStorage\|sessionStorage\|document\.cookie" src/` | only inside a click-to-load wrapper, after user click |
| No marketing verbs in `.astro` files | `grep -riEn "unleash\|supercharge\|delight\|empower\|transform\|revolutionize\|leverage\|seamless\|frictionless" src/components/ src/pages/` | nowhere in body copy |
| No exclamation marks in body copy | `grep -rn "!" src/components/` and filter to text content (skip `class=`, `import`, `!important`, JS) | nowhere in human-visible body copy |
| Section labels are plain uppercase words | inspect the label `<div>` in each section component | label reads `MISSION` not `01 — MISSION` |
| No external image hosts | `grep -riEn "src=.https?://(placehold|picsum|unsplash|cloudinary|imgix|via\.placeholder|images\.unsplash)" src/ public/` | nowhere |
| No `<img>` in forbidden sections | inspect Nav, Hero, Mission, Principles, Features, ProductsPreview, Status, Contact, LegalFooter component files for `<img` tags | not allowed per `SHARED-image-rules.md` |
| Demo image (if present) has a real `alt` | check `Demo.astro` for `alt="..."` that is not empty and is not a marketing line | required when an image is present |
| Submit button is filled red (not outlined) | `Contact.astro` includes `bg-brand-red` on the submit button, not `border-brand-red` alone | only Contact's submit |
| Footer has Privacy and Terms | already covered in §B | — |
| Nav is first, LegalFooter is last | inspect `index.astro` JSX order | always |

For each violation, file a finding with:
- **Category:** Invariant
- **Location:** `<file:line>` from the grep
- **Standard:** the reference doc (e.g., `AGENT.md hard constraint 5` or `SHARED-image-rules.md §Forbidden surfaces`)
- **Suggested repair:** direct edit when the fix is a literal swap; route to `update-saboteur-site` with `update_type=section-copy` when the fix requires regenerating copy.

#### D. Voice drift

This check is qualitative. Read the body copy of these sections from the target repo (the text content, ignoring markup):

- Hero — the three-clause body paragraph
- Mission — the body paragraph and any tenets
- Features (product variant) — each feature row
- ProductsPreview (parent variant) — each card body

Compare against the Do/Don't lists in `$SITES/brand/identity.md` (load it before judging). Flag any of:

- **Hedged claims** — *might*, *can help you*, *designed to*, *aims to*, *intended to*
- **SaaS-template phrasing** — *trusted by thousands*, *the future of X*, *built different*, *next-generation*, *industry-leading*, *world-class*
- **Soft selling** — copy that praises the product instead of stating what it is or what it stands against
- **Over-explanation** — copy that explains the joke or softens a stance instead of letting it stand
- **Wrong register** — copy that reads as enthusiastic / breezy / casual rather than declarative / restrained

Voice findings are judgment calls. For each, quote the offending sentence and explain in one line why it drifts. Be conservative — only flag clear drift, not subjective taste.

For each voice finding:
- **Category:** Voice drift
- **Location:** `src/components/<Section>.astro` (line number when helpful)
- **Standard:** `brand/identity.md §Voice`
- **Suggested repair:** route to `update-saboteur-site` with `update_type=section-copy`

### Step 7 — Output the report

Print the report in this exact format. Use the unique `P#` identifiers so the user can reference findings by number when choosing what to repair.

```
# Saboteur site assessment

Repository: <absolute path>
Variant detected: <product | parent>
Reference: <SITES path>
Date: <today's date, YYYY-MM-DD>

## Summary

- Required sections: <N> checked, <M> missing
- Required text: <N> checked, <M> missing/wrong
- Invariants: <N> checked, <M> violated
- Voice: <N> sections reviewed, <M> flagged

<if zero problems across all four:>
✓ No problems found. The site is consistent with current Saboteur standards.

<if any problems:>
## Findings

### [P1] <one-line title>

- Category: <Required section | Required text | Invariant | Voice drift>
- Location: <file or file:line>
- What's wrong: <one sentence>
- Standard: <reference doc and section>
- Suggested repair: <`update-saboteur-site` (copy / page-elements) | Direct edit>

<repeat per finding, numbered P1, P2, ...>
```

Do not invent findings. If a check passes, count it in the "checked" total but don't list it.

### Step 8 — Offer repair

If the report has zero findings, end the skill here.

If the report has any findings, ask the user:

> "I found <N> problem(s). Would you like to repair them? Options: repair all, repair specific (give me P# numbers), or skip."

Wait for the user's response.

- **Repair all** — proceed to Step 9 and walk through every finding in order.
- **Repair specific (P#, P#, ...)** — proceed to Step 9 with only those findings.
- **Skip** — end the skill. Tell the user they can re-run `/assess-saboteur-site` any time.

### Step 9 — Route each repair

For each finding selected:

1. **Print the finding** again so the user has context.
2. **Determine the route** from the finding's "Suggested repair":

   | Suggested repair | Action |
   |---|---|
   | `update-saboteur-site` (section-copy) | Invoke `update-saboteur-site` with arguments `repository=<path> update_type=section-copy`. Pass the section name and the finding's "What's wrong" as the change context. The director skill will collect the rest and confirm before invoking the writer. |
   | `update-saboteur-site` (page-elements) | Invoke `update-saboteur-site` with arguments `repository=<path> update_type=page-elements`. Pass the section to add or modify. |
   | Direct edit | Read the file at the finding's location. Use the Edit tool to apply the smallest possible fix (e.g., `#FFFFFF` → `brand-white`, marketing verb → declarative phrasing, outdated year → current year). Confirm the edit with the user before writing. |

3. **After each repair**, mark it complete in your running list. If multiple repairs were selected, continue to the next one without re-asking.

4. **Do not chain destructive edits without confirmation.** Each direct edit needs explicit user confirmation. Sub-skill invocations have their own confirmation (the director's Step 5 confirmation pattern).

### Step 10 — Re-assess (optional)

After all selected repairs are applied, offer to re-run assessment:

> "Repairs complete. Re-run assessment to verify? (yes/no)"

If yes, restart from Step 5 (reuse the same repository path and SITES path).

If no, summarize what was changed and end.

---

## Hard constraints

These exist to keep the assessor honest and the repair flow safe.

1. **Assessment is read-only.** Step 6 must not modify any file in the target repo. The only writes happen in Step 9, after explicit user confirmation.
2. **Do not invent findings.** Every finding must reference a concrete standard from the loaded reference docs. If a rule is ambiguous, do not flag it — note the ambiguity in the report's summary instead.
3. **Voice drift is conservative.** Voice findings are qualitative and judgment-based. Flag only clear drift, not subjective taste. The brand identity doc's Do/Don't lists are the standard; personal preference is not.
4. **Repair via existing skills where possible.** Direct edits are reserved for literal invariant swaps where a sub-skill would be overkill (token swaps, outdated year, removing a marketing verb in isolation). Anything that changes copy *meaning* goes through `update-saboteur-site` so the writer skill can ground new copy in the site's voice.
5. **Preserve brand hard constraints during repair.** All hard constraints from `generate-saboteur-site` and `update-saboteur-site` continue to apply — never strip required sections, never introduce pure white, never add cookies or external font loads, never use marketing verbs in copy.
6. **Local repositories only.** This iteration does not support remote repositories.
7. **Stay in scope.** This skill audits and repairs landing-page sites. If the user asks for a security audit, performance audit, accessibility audit, or anything beyond Saboteur-correctness, tell them this skill does not cover it and stop.
