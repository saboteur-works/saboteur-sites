# Default stack

Saboteur web properties default to **Astro + Tailwind v4 + Cloudflare Pages**. The combination ships static HTML, costs nothing at landing-page traffic levels, and stays out of the React-ecosystem pull toward server-required setups.

A different stack is allowed when it serves the project, but it should be a deliberate exception — and every exception inherits the same constraints: static output, cookieless by default, self-hosted fonts, brand tokens from [`saboteur-styles`](https://github.com/saboteur-works/saboteur-styles).

## Why each piece

### Astro

- **HTML-first authoring.** `.astro` files start as HTML and add component imports + frontmatter on top. Reads naturally for AI agents and for humans returning months later.
- **Zero JS by default.** Components are server-rendered at build time. Pages ship as static HTML unless a specific component opts into hydration.
- **Islands when needed.** A single interactive piece (contact form, modal, lightbox) can hydrate without converting the rest of the site. Use vanilla JS by default; reach for a framework only when the interaction genuinely warrants it.
- **Cloudflare Pages native.** Zero-config deploy via the Pages dashboard. No adapter needed for static output.
- **Content collections.** Markdown content with type-checked frontmatter — useful when a landing page grows a small blog or changelog.

### Tailwind v4

- **Matches the brand-tokens format.** `saboteur-base.css` uses Tailwind v4's `@theme` block, so utilities like `bg-brand-black` and `tracking-wordmark` work out of the box.
- **CSS-first config.** No `tailwind.config.js` required; theme tokens live in CSS.
- **Tree-shaken output.** Production CSS only contains classes actually used.

### Cloudflare Pages

- **Free tier covers landing-page traffic.** 500 builds/month, unlimited bandwidth, unlimited requests on the static side.
- **Git-driven deploys.** Push to the production branch → automatic build and deploy. Preview deploys for branches. Set up once per site in the dashboard; a project is Git-connected or Direct Upload **permanently**, so never create one by dragging a `dist` folder in. See [`hosting-cloudflare.md`](hosting-cloudflare.md).
- **The build is the compliance gate.** The build command is `npm run ci`, not `npm run build` — legal pages that have drifted from their templates, or a privacy policy that contradicts the site's own config, fail the deploy. See [`../compliance/policy-tooling.md`](../compliance/policy-tooling.md).
- **Edge cache by default.** Static assets served from Cloudflare's network with no configuration.
- **Pairs with the Saboteur form backend.** Cloudflare Workers (forms) and Cloudflare Web Analytics (cookieless analytics) live in the same account, same dashboard.

## What this stack does *not* include by default

- **No SSR or server runtime.** Astro is used in static-only mode. If a page needs server behavior, the request goes to a Cloudflare Worker — never to a long-running Astro server.
- **No React.** Adding `@astrojs/react` is allowed if a specific component truly needs it, but the default is vanilla HTML/CSS/JS with Astro components for composition. The React ecosystem's pull toward Next.js and server mode is the trap we avoid.
- **No CMS.** Content lives in the repo, as files. If editorial workflow becomes a real need, document the choice at that point.
- **No analytics by default.** Cloudflare Web Analytics is the recommended option when analytics is wanted; otherwise the site ships with none.

## Adjacent components

The full picture for a generated landing-page repo:

| Concern | Choice | Notes |
|---|---|---|
| Framework | Astro | Static output only. |
| Styling | Tailwind v4 + `saboteur-styles` | See [`../brand/visual-tokens.md`](../brand/visual-tokens.md). |
| Fonts | `@fontsource/ibm-plex-*` | Self-hosted. Never `fonts.googleapis.com`. See [`../compliance/cookieless-by-default.md`](../compliance/cookieless-by-default.md). |
| Hosting | Cloudflare Pages | Free tier. Git integration, connected once in the dashboard. See [`hosting-cloudflare.md`](hosting-cloudflare.md). |
| Forms (if any) | Cloudflare Worker → Resend | Both already in use. *(Phase 2: `forms.md` with starter worker.)* |
| Analytics (if any) | Cloudflare Web Analytics | Cookieless. *(Phase 2: `analytics-choices.md`.)* |
| Email transactional | Resend | Used by the form worker. |
| Domain / DNS | Cloudflare DNS | Each Saboteur product currently has its own domain. |
| Image optimization | Astro `<Image>` / `<Picture>` | Outputs AVIF + WebP with fallback. |
| Sitemap | `@astrojs/sitemap` | Emits `/sitemap-index.xml`, which `robots.txt` points at. See [`seo.md`](seo.md). |
| CI | Cloudflare Pages built-in | Push-to-deploy, build command `npm run ci`. Runs the policy gates before and after the Astro build. No separate GitHub Actions required. |

## When to consider deviating

A landing page should default to the stack above. Reasonable reasons to step away — each rare:

- **Need server-side data** that a Worker can't deliver cleanly. Document the trade-off; consider whether the page actually needs to be dynamic, or if a build-time fetch + static regenerate works.
- **Need a richer interactive component** (a real app embedded in a landing page). Add a single Astro island with vanilla JS, then a framework island only if vanilla isn't tractable.
- **Stack experiment.** Acceptable, but the experiment is the project's responsibility — don't change defaults here until the experiment proves out.

## What lives in this directory

- This file — default stack and rationale.
- *(Phase 2)* `astro-conventions.md` — file layout, naming, when to use `Layout`s vs. components vs. partials.
- [`hosting-cloudflare.md`](hosting-cloudflare.md) — Git integration setup, build settings, preview deploys, custom-domain cutover from a manually-uploaded project.
- *(Phase 2)* `forms.md` — starter Cloudflare Worker + Resend integration + privacy-policy snippet.
- *(Phase 2)* `analytics-choices.md` — Cloudflare Web Analytics setup; alternatives.
- [`seo.md`](seo.md) — metadata contract, JSON-LD shapes, crawling and preview-deploy rules, what would get a page suppressed, the domain trade-off.
- *(Phase 2)* `domains.md` — current per-product convention; what to revisit if consolidating later.
