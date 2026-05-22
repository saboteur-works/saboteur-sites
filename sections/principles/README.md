# Principles (tenets)

A short, numbered list of operating principles. **Optional**, but very common on the parent landing page.

## Where this lives on the page

Principles are **not their own top-level section**. They nest inside Mission's right column, immediately below the mission body paragraph. See [`../mission/example.html`](../mission/example.html) for the embedded usage; this directory documents the pattern standalone so it can be reused (e.g., for an About page, a sub-brand landing page, or a future tenets-only surface).

Calling this *principles* in the docs and *tenets* in the live HTML is intentional — the brand uses both terms. Principles is clearer in conversation; tenets is more compressed and reads well as a class name.

## Purpose

Expand the mission stance into three to four concrete commitments. Each item has a short headline that states the principle as a rule and a body that says what the principle means in practice.

The list earns its place by being specific. *"Creator-first."* is a tenet; *"We care about creators"* is marketing copy.

## Variants

| File | When to use |
|---|---|
| [`example.html`](example.html) | Default. Three items. Matches the live saboteur.dev tenets. |

Adapt the item count between **two and four**. Fewer than two isn't a list; more than four loses the punch.

## Anatomy

```
─────────────────────────────────────────────────────────────  ← hairline rule
                                                                                          13px
   01    Creator-first. Every product decision starts
         with the person doing the work — not the
         advertiser, not the algorithm, not the board.
                                                                                          13px
─────────────────────────────────────────────────────────────
   02    Own your output. Your files, your data, your
         process. We make software you can trust …
                                                                                          13px
─────────────────────────────────────────────────────────────
   03    Deliberate complexity. Simple where it should
         be simple. Powerful where depth is earned. …
                                                                                          13px
─────────────────────────────────────────────────────────────  ← hairline rule (last item gets a bottom rule too)
```

- **Layout** — vertical `flex` column. Each item has a top hairline rule; the last item also has a bottom rule. Use `border-t border-brand-rule` on each row and `border-b` on the last.
- **Row padding** — `13px` top and bottom (`py-[13px]`).
- **Number** — mono, 10px, `brand-red`, tracking `0.14em`. Fixed width `18px` so the headlines align.
- **Headline + body** — both on one line (or wrapping inline), `font-sans`, 13px, leading `1.6`. Headline is `<strong class="font-bold text-brand-white">` ending with a period; body that follows is in `brand-mid`.

## Rules

1. **Two to four items.** Three is the sweet spot.
2. **Headline is a rule, not a feature.** *Creator-first.* is a rule. *Fast load times.* is a feature — wrong section.
3. **Headlines end with a period.** They're declarations.
4. **Body says what the headline means in practice.** Two sentences max. Name specifics. *"Not the advertiser, not the algorithm, not the board."*
5. **Red on the number only.** The number is the only red element in the list. Don't accent the headline with red — the period after the headline already carries the beat.
6. **No icons.** Numbers are the visual marker. Adding icons would compete.
7. **Flat list, not a grid.** A 3-column card grid would soften the tone. The vertical list with hairline rules is the form.

## Copy patterns

### Live examples (saboteur.dev)

> **01 Creator-first.** Every product decision starts with the person doing the work — not the advertiser, not the algorithm, not the board.
>
> **02 Own your output.** Your files, your data, your process. We make software you can trust with work that matters.
>
> **03 Deliberate complexity.** Simple where it should be simple. Powerful where depth is earned. Never complicated for complexity's sake.

### When writing for a product

- Headlines name a position the product takes — *Local-first.*, *No autoplay.*, *Files over folders.*
- Bodies pair the position with an opposing target — *not your subscription service*, *not the algorithm*, *not a cloud queue you can't see*.
