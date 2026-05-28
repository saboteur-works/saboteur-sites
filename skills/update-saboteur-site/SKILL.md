---
name: update-saboteur-site
description: >
  Direct an update to an existing Saboteur LLC landing page. Use this skill
  when the user wants to modify a Saboteur site — rewrite copy for a section,
  add a new section, delete a section, or rearrange section order. Validates
  that the target repository is a Saboteur site before any modification, then
  routes to the appropriate sub-skill (write-saboteur-site-section-copy) or
  performs the page-element edit directly. Invoke as /update-saboteur-site,
  optionally passing a local repository path and update type
  (section-copy or page-elements) as arguments.
argument_hint: repository, update_type
---

# Update Saboteur Landing Page

Director skill for updates to an existing Saboteur LLC landing page. Validates the target repository, confirms the intended change with the user, and either delegates to a sub-skill or performs the edit directly.

## Usage

```
/update-saboteur-site [repository] [update_type]
```

- `repository` — local filesystem path to the Saboteur site repo to update (e.g. `~/Repositories/saboteur-works/offbeat-fm-site`). Required.
- `update_type` — one of `section-copy` or `page-elements`. Required.

Missing arguments are collected interactively. This iteration supports local repositories only.

---

## Instructions

You are routing an update to a Saboteur LLC landing page. Follow these steps exactly, in order.

### Step 1 — Parse arguments

`$ARGUMENTS` may contain up to two tokens: `[repository] [update_type]`. Extract what's there; note what's missing.

If `update_type` was supplied but is not `section-copy` or `page-elements`, ask the user to clarify before continuing. Do not guess.

### Step 2 — Resolve the repository path

If `repository` was not supplied, ask the user for the local path of the repo to update.

Expand `~` and make the path absolute. Verify the path exists on disk. If it doesn't, warn the user and stop.

If the path looks like a URL (`https://…`, `git@…`) or otherwise refers to a remote repository, tell the user this iteration only supports local paths and stop.

### Step 3 — Validate the target is a Saboteur site

Before any modification, confirm the repo has the structure of a Saboteur landing page. This guardrail exists to protect non-Saboteur repos from accidental edits by this skill — it is not optional.

Required markers (all must be present):

1. `package.json` at the repo root
2. `astro.config.mjs` at the repo root
3. `src/pages/index.astro`
4. `src/layouts/Base.astro`
5. `src/components/` directory exists and contains at least one `.astro` file
6. At least one Saboteur brand token (`brand-red`, `brand-white`, `brand-black`, `brand-surface`, or `brand-rule`) appears somewhere under `src/` — check `src/styles/global.css` first, then `grep -r` across `src/` if needed

Use `ls` and `grep` to verify each marker. If any marker is missing, **do not modify any file in the target repo**. Print a warning that lists exactly which markers are missing, e.g.:

> The path `<repository>` does not look like a Saboteur landing page repo. The following markers are missing: `src/layouts/Base.astro`, brand tokens under `src/`. To protect non-Saboteur repos from accidental edits, I'm not going to touch this directory. If you believe this is a Saboteur site, confirm explicitly and I can override the check.

Only proceed if the user explicitly acknowledges and asks you to override.

### Step 4 — Confirm the update type

If `update_type` was not supplied, ask the user which kind of update they want:

- `section-copy` — Rewrite the copy for an existing section (Hero, Mission, Features, etc.).
- `page-elements` — Add a new section, delete an existing section, or rearrange section order.

Then branch to the matching sub-step.

---

### Step 5a — Section-copy updates

Used when `update_type` is `section-copy`.

1. **Identify the section.** Read `src/pages/index.astro` and list the sections currently composed onto the page. Present the list to the user and ask which section to update. Verify the user's choice maps to a real component in `src/components/`.

2. **Read the current copy.** Open the relevant component file in `src/components/` so the existing copy is in your context. Also read `Hero.astro` and `Mission.astro` (if not already the target) to ground new copy in the site's current voice.

3. **Gather the change context.** Ask the user what specifically should change — the angle, the audience, anything new the copy should mention, anything to drop. Capture their answer.

4. **Assemble the `context` argument.** Build a `context` block for the sub-skill that includes:
   - The product / site this is for (read `package.json` or `README.md`)
   - The current copy for the target section
   - The voice cues from neighboring sections (Hero / Mission)
   - The specific change the user asked for

5. **MUST confirm arguments before invoking the sub-skill.** Present back to the user, verbatim:

   > I'm about to invoke `write-saboteur-site-section-copy` with:
   >
   > - **section:** `<section name>`
   > - **context:** `<the assembled context block>`
   >
   > Should I proceed?

   Wait for an explicit `yes` (or equivalent). If the user wants either argument adjusted, revise and re-confirm. Do not skip this step under any circumstances.

6. **Invoke `write-saboteur-site-section-copy`** with the confirmed arguments via the Skill tool.

7. **Apply the returned copy.** Edit the relevant component file in `src/components/` to use the new copy. Preserve all existing markup, classes, and structural elements — only text content changes. Do not invent new HTML elements or class names unless the section pattern genuinely requires it (e.g. wrapping a phrase in `<em class="not-italic text-fg-primary">` for the white pivot in a Mission paragraph).

8. **Report.** Tell the user which file you edited, and show the before / after of the copy.

---

### Step 5b — Page-element updates

Used when `update_type` is `page-elements`.

Ask the user which sub-action they want, if not already clear:

- **Add a section** — create a new component file and wire it into `index.astro`.
- **Delete a section** — remove a component from `index.astro` and delete the component file.
- **Rearrange sections** — change the order of sections composed in `index.astro`.

Then branch.

#### Adding a section

1. Ask which section to add. Valid options come from the canonical Saboteur section catalog: `Nav`, `Hero`, `Mission`, `Features`, `ProductsPreview`, `Status`, `Contact`, `LegalFooter`. If `saboteur-sites` is available locally, cross-reference `sites/landing-page/required-sections.md` and `optional-sections.md`.

2. Refuse to add a section that already exists in `src/components/`. If the user wants to replace it, tell them to use `section-copy` or to delete it first.

3. Locate the canonical reference for the section under `saboteur-sites/sections/<section>/` (e.g. `sections/contact/form.html`). Read at least one existing component in the target repo (e.g. `Mission.astro`) to mirror its frontmatter and indentation conventions.

4. **Confirm before creating.** Tell the user:

   > I'm going to create `src/components/<Name>.astro` based on the canonical pattern in `saboteur-sites/sections/<section>/`, and insert `<<Name /\>>` into `src/pages/index.astro` between `<<X /\>>` and `<<Y /\>>`. Proceed?

   Wait for explicit confirmation.

5. Create the component file and update `src/pages/index.astro` — add the import and place the JSX usage in the correct position.

#### Deleting a section

1. Read `src/pages/index.astro` and list the sections currently on the page. Confirm with the user which one to remove.

2. Refuse to delete required sections (`Nav`, `Hero`, `Mission`, `LegalFooter`) without an explicit override — these are required per `sites/landing-page/required-sections.md`, and removing them violates the brand's hard constraints. If the user insists, warn clearly and proceed only on a second confirmation.

3. **Confirm before deleting.** Tell the user:

   > I'm going to remove `<<Name /\>>` and its import from `src/pages/index.astro`, then delete `src/components/<Name>.astro`. Proceed?

   Wait for explicit confirmation.

4. Remove the import and the JSX usage from `index.astro`. Delete the component file. Do not delete any file outside `src/components/`.

#### Rearranging sections

1. Read `src/pages/index.astro` and present the current section order to the user. Ask them to specify the new order — either as an ordered list of section names, or as a move directive ("move Status above Features").

2. Refuse to move `Nav` out of the first position or `LegalFooter` out of the last position without an explicit override. These are structural anchors of the page.

3. **Confirm the new order before writing.** Show the current order and the proposed order side-by-side and ask the user to confirm. Wait for explicit confirmation.

4. Edit `src/pages/index.astro` to reflect the new JSX composition order. Import order in the frontmatter is cosmetic — leave it alone unless the user asks for it to mirror the new order.

---

### Step 6 — Verify constraints

Before reporting done, re-read the files you touched and check that the Saboteur hard constraints still hold:

- [ ] No `#FFFFFF` introduced — only `brand-white` / `#F5F4F0`
- [ ] No `fonts.googleapis.com` reference
- [ ] No `<script>` tags that set cookies or write to `localStorage`
- [ ] `LegalFooter` is still present and is the last section
- [ ] `Nav` is still present and is the first section
- [ ] Submit button in `Contact.astro` (if present) is still `bg-brand-red` filled
- [ ] No marketing verbs in any new copy (`unleash`, `supercharge`, `delight`, `empower`, `transform`) and no exclamation marks
- [ ] Section labels remain plain uppercase words (e.g. `MISSION`, not `01 — MISSION`)

Fix any violation before reporting.

### Step 7 — Report

Summarize what you changed:

- Files modified, created, or deleted
- A short diff or before / after of the copy where it applies
- Any confirmations the user gave that materially affected the action

If the user should run `npm run dev` to visually verify the change, mention it once.

---

## Hard constraints

These exist to keep the director from doing anything destructive or off-brand.

1. **No edits without validation.** Step 3 must pass (or be explicitly overridden by the user) before any file in the target repo is modified.
2. **No edits without confirmation.** Every action requires explicit user confirmation before it is taken — sub-skill invocation arguments, file creation, file deletion, and section reordering all require an explicit yes. This applies even when the user gave a one-line request like "update the hero copy" — confirm the arguments first.
3. **Local repositories only.** This iteration does not support remote repositories. If the path is a URL or refers to a remote, stop and tell the user.
4. **Preserve brand hard constraints.** All hard constraints from `generate-saboteur-site` continue to apply on every update — never strip required sections, never introduce pure white, never add cookies or external font loads, never use marketing verbs in copy.
5. **Stay in scope.** This skill only handles `section-copy` and `page-elements` updates. If the user asks for something else (restyle, new page, brand token changes, dependency upgrades), tell them this iteration does not cover it and stop.
