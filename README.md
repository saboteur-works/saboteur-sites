# saboteur-sites

The reference repository for **how to build a Saboteur LLC website or page**. Brand identity, voice, visual tokens, page anatomy, section patterns, compliance rules, and the default tech stack — written so that an AI agent (or a human) can read the relevant slice and produce something on-brand without further context.

> This repo is *not* a website. It's the documentation, conventions, and reusable patterns that any Saboteur site repo can be built from.

## Who reads this

- **AI agents** scaffolding or generating a Saboteur landing page. Start at [`AGENT.md`](AGENT.md).
- **Humans** doing the same thing, or learning how Saboteur sites are built. Browse the directories listed below.

## Layout

| Directory | What's in it |
|---|---|
| [`brand/`](brand/) | Identity, voice, visual tokens. Points at the [`saboteur-styles`](https://github.com/saboteur-works/saboteur-styles) repo for the canonical token CSS. |
| [`sites/`](sites/) | Catalog of site types. Currently `landing-page/`, plus its optional [`content-surfaces.md`](sites/landing-page/content-surfaces.md) (`/blog`, `/changelog`). |
| [`sections/`](sections/) | Reusable HTML section snippets — nav, hero, mission, principles, products-preview, features, demo, status, contact, legal-footer — and the cross-section [image rules](sections/SHARED-image-rules.md). |
| [`compliance/`](compliance/) | Cookieless-by-default charter, the disclosures still required, the privacy/terms templates, and the pre-launch checklist. |
| [`tech/`](tech/) | Default stack (Astro + Tailwind v4 + Cloudflare Pages), [`hosting-cloudflare.md`](tech/hosting-cloudflare.md), and [`seo.md`](tech/seo.md) — the metadata contract, JSON-LD shapes, and what would get a page suppressed. |
| [`scaffolding/`](scaffolding/) | Starter files for a new site repo, plus the optional [content-surfaces add-on](scaffolding/content-surfaces/). |
| [`skills/`](skills/) | The Claude Code skills that read this repo and do the work. See below. |
| [`scripts/`](scripts/) | Policy rendering and auditing (`render-policies.mjs`, `audit-policy-processors.mjs`, `check-policy-upstream.mjs`) and the style sync. |

## How a site gets built from this repo

1. Pick a site type from [`sites/`](sites/) — currently `landing-page/`.
2. Read the brand layer in [`brand/`](brand/) — identity, voice, tokens.
3. Compose required and optional sections from [`sections/`](sections/).
4. Build with the stack documented in [`tech/`](tech/).
5. Add a content surface from [`scaffolding/content-surfaces/`](scaffolding/content-surfaces/) if the site needs `/blog` or `/changelog`. Optional, and most sites don't.
6. Generate `/privacy` and `/terms` with [`scripts/render-policies.mjs`](scripts/render-policies.mjs) — never by hand.
7. Run through the [`compliance/`](compliance/) charter and the [pre-launch checklist](compliance/pre-launch-checklist.md).

In practice a skill does all of this. The docs remain the source of truth the skills read.

## Skills

Five skills live in [`skills/`](skills/) and are wired into `~/.claude/skills/` by symlink, so they can be invoked from any repo:

| Skill | What it does |
|---|---|
| `/generate-saboteur-site` | Scaffolds and generates a complete landing page in a fresh repo. |
| `/assess-saboteur-site` | Audits an existing site against these standards and offers to repair findings. |
| `/update-saboteur-site` | Directs an update — section copy, page elements, or adding/removing a content surface. |
| `/write-saboteur-site-section-copy` | Writes copy for one section, in brand voice. |
| `/write-saboteur-post` | Writes a blog post or changelog entry, in long-form brand voice. |

To wire up a new one:

```bash
ln -s "$PWD/skills/<name>" ~/.claude/skills/<name>
```

## Status

**Docs, sections, and compliance complete.** Brand layer, landing-page anatomy, all section HTML, and the compliance set (GDPR, privacy policy, terms, accessibility, analytics, fonts, forms, third-party embeds, pre-launch checklist), plus the `saboteur-dev` worked example.

**Scaffolding complete.** Landing-page starter files in [`scaffolding/new-landing-page/`](scaffolding/new-landing-page/); the optional `/blog` and `/changelog` surfaces in [`scaffolding/content-surfaces/`](scaffolding/content-surfaces/).

**Skills complete.** All five above.

## License & contributing

Public repo. No sensitive information lives here by intent — voice guidance and legal/contact references to Saboteur LLC are publicly knowable. Trademarks and brand marks remain Saboteur LLC's; the structural patterns and tokens are documented openly so external readers can understand how Saboteur sites are built.
