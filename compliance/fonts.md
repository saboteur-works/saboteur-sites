# Fonts — self-hosting IBM Plex

Saboteur sites use the **IBM Plex** family (Sans, Sans Condensed, Mono, Serif). Per the [`cookieless-by-default`](cookieless-by-default.md) charter, fonts must ship from the site's own origin — never from a third-party CDN.

The German *LG München 2022* ruling against Google Fonts is the canonical case for why. Assume similar GDPR exposure for any external font host. The internal brand-system reference at [`../brand/inputs/saboteur-brand-system-v06.html`](../brand/inputs/saboteur-brand-system-v06.html) imports from `fonts.googleapis.com` — that file is an internal reference document and that import does not propagate to deployed sites.

## Packages

IBM Plex is open-source (SIL Open Font License). Use the `@fontsource/*` npm packages — they bundle the files and `font-display` declarations, ready to import.

| Family | Package | Weights needed |
|---|---|---|
| IBM Plex Sans | `@fontsource/ibm-plex-sans` | 400, 700 (add 300 if your design uses it) |
| IBM Plex Sans Condensed | `@fontsource/ibm-plex-sans-condensed` | 400, 700 |
| IBM Plex Mono | `@fontsource/ibm-plex-mono` | 400, 500 |
| IBM Plex Serif | `@fontsource/ibm-plex-serif` | 400, 700 (GetWrite editor only — skip on most pages) |

```bash
npm install @fontsource/ibm-plex-sans @fontsource/ibm-plex-sans-condensed @fontsource/ibm-plex-mono
# Add @fontsource/ibm-plex-serif only if the site renders GetWrite editor surfaces.
```

## Importing in Astro

Import the specific weights you actually use — every weight is a separate file download.

```ts
// src/layouts/Base.astro (or equivalent)
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-sans-condensed/700.css";
import "@fontsource/ibm-plex-mono/400.css";
```

The brand-tokens CSS (`saboteur-base.css`) already wires `--font-display`, `--font-sans`, `--font-mono`, `--font-serif` to the family names — `font-family: "IBM Plex Sans Condensed", sans-serif;` etc. Importing the `@fontsource` files registers the actual font files for those family names.

## Importing in vanilla HTML + CSS

When not using Astro / a bundler, copy the relevant `@fontsource` `*.woff2` files into the site's `/fonts` directory and declare them in CSS:

```css
@font-face {
  font-family: "IBM Plex Sans";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/ibm-plex-sans-400.woff2") format("woff2");
}
/* Repeat per weight per family. */
```

Use `font-display: swap` so the fallback (`sans-serif` / `monospace` / `serif` from the token's family stack) renders immediately while the web font loads.

## Preloading the hero font

The hero uses IBM Plex Sans Condensed at large size. Preload it to avoid a flash-of-unstyled-text on the most important section:

```html
<link rel="preload"
      href="/fonts/ibm-plex-sans-condensed-700.woff2"
      as="font"
      type="font/woff2"
      crossorigin>
```

Preload one or two weights at most — preloading every weight defeats the purpose by saturating the connection.

## Pre-launch audit

Before deployment, confirm:

- [ ] No `<link>` or `@import` to `fonts.googleapis.com`, `use.typekit.net`, or any third-party font host.
- [ ] DevTools Network tab shows zero requests to `fonts.gstatic.com` on initial page load.
- [ ] Every weight you use is actually imported. Missing imports cause silent fallback to the OS sans, breaking the brand visual.
- [ ] `font-display: swap` is set on every `@font-face` (handled automatically by `@fontsource`).
