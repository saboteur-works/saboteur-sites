# Sites

Catalog of **site types** Saboteur produces. Each subdirectory describes one type — what it is, when to use it, anatomy, decision flow — without prescribing the stack (that's in [`../tech/`](../tech/)) or the section markup (that's in [`../sections/`](../sections/)).

## Types

- [`landing-page/`](landing-page/) — single-page site introducing one thing. Primary use case for this repo.

Future types (added when there's a concrete need, not before):

- `marketing-site/` — multi-page site for a product with more surface than fits on one page.
- `docs-site/` — reference documentation for a product.
- `changelog-site/` — release notes and decision logs.

## How a site composes

```
site-type (sites/<type>/README.md)
  ↓ picks
required + optional sections (sections/<section>/)
  ↓ styled with
brand tokens (brand/visual-tokens.md → saboteur-styles)
  ↓ written in the
brand voice (brand/identity.md)
  ↓ built with
default stack (tech/stack.md)
  ↓ must satisfy
compliance constraints (compliance/cookieless-by-default.md)
```

A site type doesn't own its sections — it composes from `sections/` and inherits from `brand/` and `compliance/`. This is what makes the future skill feasible: a site type is a *manifest*, not a template.
