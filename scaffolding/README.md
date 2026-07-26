# Scaffolding

Starter files and bootstrapping instructions for **new Saboteur site repos**. Each landing page lives in its own repo (one repo per site); this directory holds the templates that get copied in at scaffold time.

## Intended layout (Phase 2 / Phase 3)

```
scaffolding/
├── README.md                  (this file)
└── new-landing-page/
    ├── README.md              How to bootstrap a new landing-page repo
    ├── starter-files/         The files to copy into a new repo
    │   ├── package.json       saboteur-styles as a git dep, Astro, Tailwind
    │   ├── astro.config.mjs
    │   ├── tsconfig.json
    │   ├── .gitignore
    │   ├── .editorconfig
    │   ├── src/
    │   │   ├── layouts/Base.astro
    │   │   ├── pages/index.astro
    │   │   └── styles/global.css   imports saboteur-base.css
    │   ├── public/
    │   │   ├── robots.txt
    │   │   ├── favicon.svg
    │   │   └── _headers       Security headers + noindex on *.pages.dev previews
    │   └── README.md          Per-site README template (what to fill in)
    └── first-time-checklist.md   Bootstrap → deploy → custom domain → privacy policy
```

## What scaffolding does

For a new landing page, the flow looks like:

1. Pick the variant from [`../sites/landing-page/`](../sites/landing-page/) (product vs. parent).
2. Pick the sections from [`../sections/`](../sections/) based on the variant.
3. Copy `scaffolding/new-landing-page/starter-files/` into a fresh repo.
4. Fill in the per-site values: product name, domain, hero copy, footer signature, privacy policy entries.
5. Run the bootstrap checklist (install, dev, deploy preview, custom domain).
6. Run the pre-launch checklist from [`../compliance/`](../compliance/) before going live.

## What scaffolding does *not* do

- **Generate copy.** Brand voice and section-level copy come from the brand layer and the agent's reading of the inputs, not from scaffolding templates.
- **Set up CI.** Cloudflare Pages push-to-deploy is enough for typical landing pages. Add CI only if the site grows past that.
- **Run.** The scaffolding is a template, not a tool. A future skill (in another repo) will invoke this template — see [`../skills/`](../skills/) (Phase 3).

## Status

Phase 3 complete. `new-landing-page/` contains starter files and both checklists.
