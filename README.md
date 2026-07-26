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
| [`sites/`](sites/) | Catalog of site types. Phase 1: `landing-page/`. |
| [`sections/`](sections/) | Reusable HTML section snippets — nav, hero, mission, principles, products-preview, status, contact, legal-footer. |
| [`compliance/`](compliance/) | Cookieless-by-default charter and the disclosures still required. |
| [`tech/`](tech/) | Default stack (Astro + Tailwind v4 + Cloudflare Pages), and [`seo.md`](tech/seo.md) — the metadata contract, JSON-LD shapes, and what would get a page suppressed. |
| [`scaffolding/`](scaffolding/) | Starter files for new site repos (Phase 3). |

## How a site gets built from this repo

1. Pick a site type from [`sites/`](sites/) — currently `landing-page/`.
2. Read the brand layer in [`brand/`](brand/) — identity, voice, tokens.
3. Compose required and optional sections from [`sections/`](sections/).
4. Build with the stack documented in [`tech/`](tech/).
5. Run through the [`compliance/`](compliance/) charter and (Phase 2) the pre-launch checklist.

A future skill will read this repo on demand to do that work for a specific product. For now, the docs are the deliverable.

## Status

**Phase 2 complete.** Brand layer, landing-page anatomy, all section HTML (nav, hero, mission, principles, products-preview, status, contact, legal-footer), compliance docs (GDPR, privacy policy, terms, accessibility, analytics, fonts, forms, third-party embeds, pre-launch checklist), and the `saboteur-dev` worked example are all in place.

**Phase 3 complete.** Scaffolding starter files are in `scaffolding/new-landing-page/`.

**Skill complete.** `/generate-saboteur-site` lives in `skills/` and is symlinked to `~/.claude/commands/` for global use. Invoke it from any new site repo to scaffold and generate a complete landing page.

## License & contributing

Public repo. No sensitive information lives here by intent — voice guidance and legal/contact references to Saboteur LLC are publicly knowable. Trademarks and brand marks remain Saboteur LLC's; the structural patterns and tokens are documented openly so external readers can understand how Saboteur sites are built.
