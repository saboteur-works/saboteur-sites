# Accessibility — WCAG 2.2 AA baseline

Saboteur landing pages target **WCAG 2.2 Level AA** as the baseline. This file is the practical reference: what AA requires, where the Saboteur visual language is currently at risk of failing it, and what to verify before any site goes live.

For brand visual rules that interact with accessibility, see [`../brand/visual-tokens.md`](../brand/visual-tokens.md). For the pre-launch checklist that consolidates these checks, see [`pre-launch-checklist.md`](pre-launch-checklist.md).

## Why AA, why these checks

AA is the level most jurisdictions reference (US Section 508 Refresh, EU EN 301 549, ADA case law for public sites) and the level that's reasonably achievable without changing the brand. AAA pushes contrast and other thresholds high enough that the Saboteur palette can't meet it without becoming a different brand. AA is the right floor — and it's where most users actually need us to be.

## Color contrast — the gap to be honest about

The Saboteur palette has high contrast where it matters and tight contrast where the brand asks for restraint. Measured ratios against `--color-brand-black` (`#0A0A0A`):

| Foreground | Ratio | AA normal text (≥ 4.5:1) | AA large text (≥ 3:1) |
|---|---|---|---|
| `brand-white` (`#F5F4F0`) | **18.0:1** | ✅ | ✅ |
| `brand-red` (`#D44040`) | **4.36:1** | ⚠ just under 4.5 | ✅ |
| `brand-mid` (`#6A6864`) | **3.47:1** | ❌ | ✅ |
| `brand-dim` (`#2E2E2C`) | **1.42:1** | ❌ | ❌ |

What this means in practice for a Saboteur landing page:

- **Body text in `brand-mid` at 13px** — the canonical body styling — **fails AA strict**. Body copy used to introduce the mission, describe products, and document status all use this combination.
- **Footer text and other `brand-dim` elements fail AA decisively.** This is fine *only if* those elements are decorative — the "© 2026 Saboteur LLC" sign-off and the tags in the footer should not be the only place where important information lives.
- **`brand-red` small text** (the `01 / 02 / 03` markers in the principles list, the FM in OffBeat-FM, the small CTA underlines) sits at 4.36:1 — just below 4.5. Passes AA for large text but fails for small text.
- **`brand-white` is the safe color** for any normal-sized text that carries meaning.

### How to handle the gap

There are three honest options. Saboteur can pick a posture by site or by element.

1. **Lift the color** — use `brand-white` for body where AA matters. The mission and contact closing sentences should probably use `brand-white` rather than `brand-mid`. The brand allows this without losing the muted feel because most accompanying text *is* in `brand-mid`.
2. **Lift the size** — text in `brand-mid` should be ≥ 18.66px (14pt) to qualify for the large-text 3:1 threshold. The hero body at `clamp(15px, 3.5vw, 18px)` is borderline; pushing to `clamp(16px, 3.5vw, 20px)` would clear the bar on common viewports.
3. **Accept and document** — treat the AA gap on certain elements as a known posture choice. This is honest but should be the exception, not the default. Document specifically in the site's accessibility statement (if one is published).

The current Saboteur stance: **default to option 1 for any text that conveys meaning** (mission, body, status descriptions). Use `brand-mid` for genuinely decorative or supplementary text where reading isn't required (eyebrow labels above headings, tag chips, very secondary metadata).

`brand-dim` is reserved for **truly decorative** text — the footer's `© 2026 Saboteur LLC` line, version stamps, etc. — and even there, the same content should appear somewhere else legibly (e.g., the privacy policy names Saboteur LLC at AA contrast).

## Structural requirements

These are non-negotiable. Each is a thing AA expects and each is easy to get wrong if not deliberate.

### Page structure

- **Single `<h1>` per page.** The hero's tagline is typically the `h1`. Subsequent sections use `h2`, then `h3` inside if needed.
- **Headings nest correctly.** Don't skip levels (`h1` → `h3`).
- **Landmark regions.** Wrap nav in `<nav>`, the page body in `<main>`, the footer in `<footer>`. Each landmark should appear once per page.
- **`<html lang="en">`** set on every page (or the appropriate locale). Screen readers use it to pick the right pronunciation engine.

### Skip link

- A *skip to main content* link is the **first focusable element** on the page. It is visually hidden until focused. On focus it appears as a clear, sized control (mono text, hairline border, top-left placement).
- The skip link's target is `#main` and matches the `id="main"` on the `<main>` element.

### Keyboard navigation

- **Every interactive element is reachable by Tab.** Buttons, links, form fields, anything with a click handler.
- **Tab order matches visual order.** A user pressing Tab moves through the page in the order they'd read it.
- **No keyboard traps.** A user can Tab into a component and Tab out again. This is rarely an issue on static pages but matters when a click-to-load embed or modal is added.
- **Enter activates buttons; Space activates buttons; Enter follows links.** Default behaviors. Don't break them with `preventDefault` unless you have a specific reason.

### Focus indicators

- **Every focusable element has a visible focus indicator.** The default `outline` works as a last resort, but Saboteur sites should style focus explicitly:
  - Links and buttons: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red focus-visible:outline-offset-2`.
  - Form inputs: the border lifts to `brand-mid` (already in the contact form pattern). For AA strict, a 2px outline is preferable.
- **Never `outline: none` without a replacement.** Removing the default focus ring without providing an alternative is one of the most common AA failures.

### Forms

- **Every input has a programmatic label.** Use `<label for="...">` or wrap the input in `<label>`. The label is the visible name of the field — *not* a placeholder. (Placeholders disappear when the user types, which is itself an accessibility problem.)
- **Required fields are marked.** Use `required` on the input. Optionally add `*` to the label.
- **Errors are announced.** When validation fails, the error message is associated with the field (`aria-describedby`) and appears in the document, not just as a tooltip.
- **No `autocomplete="off"` on personal-data fields.** Saboteur's honeypot uses `autocomplete="off"` deliberately on the *hidden* field; real fields should let the user's browser autofill.
- **Submit button is a `<button>`**, not a styled `<div>` or `<a>`. The form pattern in [`forms.md`](forms.md) uses `<button type="submit">`.

### Images and icons

- **Every `<img>` has `alt`.** Either descriptive (for content images) or empty `alt=""` (for decorative). Never missing.
- **SVG icons** that convey meaning need `role="img"` and an `aria-label`. Purely decorative SVGs get `aria-hidden="true"`.
- **The `員` Japanese character in the avatar** carries brand meaning but is not the *only* identification of Saboteur — the wordmark is the primary identifier. Treat the character in `<img>` form as decorative (`alt=""`) and let the adjacent text carry identification.

### Color as the only indicator

- **No information is conveyed by color alone.** The status section uses red dots for *live* and dim dots for *pre-production* — but **the badge text** (`Live`, `In development`, `Pre-production`) is what carries the meaning. The dot is reinforcement, not the only signal.
- **Form errors and required states** use text and icon, not just color.

### Motion

- Saboteur sites have minimal motion (transition-color on hover, no autoplay, no parallax). If a future site adds anything more, respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
  ```

### Text resize

- Text must remain readable when the user zooms to 200%. Saboteur's typography uses relative units (`em`, `rem`, `clamp` with `vw`) and absolute pixel sizes for utility classes; both scale on browser zoom. **Avoid fixed `width` containers in viewport units** that prevent wrap.

### Reflow

- At 320px viewport width (smallest mobile target), no horizontal scrolling. The Saboteur layout already handles this via the section grid collapsing to single column under `md:` breakpoint. Verify per site.

## Forms-specific patterns (Saboteur)

Cross-references the form pattern in [`forms.md`](forms.md) and [`../sections/contact/`](../sections/contact/). Specific accessibility notes:

- The honeypot field (`<input name="company">`) is **off-screen via positioning**, not `display: none`. Screen readers should still ignore it (`aria-hidden="true"`, `tabindex="-1"`). This is the standard accessible honeypot pattern.
- The lawful-basis copy near the submit button is **plain prose**, not a tooltip. Screen readers reach it in source order.
- The closing line *"I read everything. I reply to most of it."* is below the form; it's read after the form, which is what we want.

## What this stack already gets right

A lot, by virtue of being static HTML + Tailwind:

- Real semantic HTML (`<nav>`, `<main>`, `<footer>`, `<button>`, `<label>`) — no `<div onclick>` proliferation.
- No JavaScript framework runtime that intercepts focus.
- Astro outputs server-rendered HTML at build time; screen readers and assistive tech see the full document on first parse.
- Self-hosted fonts (no FOIT/FOUT from a slow CDN).
- No carousels, modals, or other historically-tricky widgets in the default landing page.

## Tools

Run at least two of these before declaring a site accessible:

- **axe DevTools** (browser extension) — fast, automated, catches the obvious failures.
- **WAVE** (browser extension or webaim.org/wave) — different ruleset; catches different things.
- **Lighthouse** (Chrome DevTools) — bundled, scored alongside performance.
- **Keyboard-only walkthrough** — close your mouse, tab through every section, complete the contact form. If anything is unreachable or unclear, fix it.
- **Screen reader spot-check** — VoiceOver (macOS, Cmd+F5), NVDA (Windows, free). Listen to the hero and the mission. The structure should narrate cleanly.

## Pre-launch audit

Consolidated checks for every Saboteur landing page. Verify each:

- [ ] `<html lang>` set.
- [ ] One `<h1>`, headings nested without skipping levels.
- [ ] Landmarks present: `<nav>`, `<main>`, `<footer>`.
- [ ] Skip link is the first focusable element and reveals on focus.
- [ ] Every interactive element keyboard-reachable in document order.
- [ ] Every focusable element has a visible custom focus indicator (not just browser default).
- [ ] Every form input has a programmatic label, not just a placeholder.
- [ ] Submit button is a `<button>`.
- [ ] Required fields marked with `required`; errors announced via `aria-describedby` when present.
- [ ] All meaningful images have `alt`; decorative ones have `alt=""`.
- [ ] No information conveyed by color alone (text or icon always pairs with color).
- [ ] axe DevTools shows zero serious or critical issues on every page.
- [ ] Lighthouse Accessibility score ≥ 95.
- [ ] Keyboard-only walkthrough completes the contact form successfully.
- [ ] At 320px viewport, no horizontal scroll; all content reachable.
- [ ] At 200% browser zoom, text and layout remain usable.
- [ ] Color contrast audited per the *Color contrast* section above. Any element using `brand-mid` at <14pt is **either lifted to `brand-white` or documented as a known posture choice in the accessibility statement.**

If any check fails, fix before launch. Accessibility is not a "phase 2" — the launch criterion is AA, not "AA later."

## A published accessibility statement (optional but recommended)

For public-facing Saboteur sites, consider publishing an accessibility statement at `/accessibility`. It says:

- The site targets WCAG 2.2 Level AA.
- Known gaps (if any) and Saboteur's plan to address them.
- A contact email for accessibility feedback.

This is a small, honest document. It signals that accessibility was thought about, and it gives users a path to flag issues that escape the automated tools.
