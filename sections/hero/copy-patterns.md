# Hero — copy patterns

The hero is three pieces of copy: **descriptor**, **tagline**, **stance**, plus an optional **CTA**. Each has a job; each has a shape. This file is the reference for writing them in the Saboteur voice.

For voice rules in general, see [`../../brand/identity.md`](../../brand/identity.md). For section anatomy, see [`README.md`](README.md).

## Descriptor (mono)

Pattern: `DESCRIPTOR — domain`.

The descriptor is two to four words in all caps, set in mono with `tracking-label-xl` (0.22em). It names the category sharply and points at the canonical URL.

### Examples

- `CREATOR-FIRST SOFTWARE — saboteur.dev`
- `INDEPENDENT MUSIC DISCOVERY — offbeat-fm.com`
- `LOCAL-FIRST WRITING STUDIO — getwrite.io`

### Do

- Stake a clear category. *INDEPENDENT MUSIC DISCOVERY* names what kind of thing this is and what it isn't (algorithmic discovery, label-driven discovery).
- Use technical or oppositional words confidently. *LOCAL-FIRST* is a category; don't soften it to "your data stays with you."
- Keep it to four words or fewer. Five feels like a sentence; the descriptor is a label.

### Don't

- Don't use brand-only words that don't describe anything. *"NEXT-GENERATION TOOLING"* says nothing.
- Don't include a tagline-like phrase. *"FOR WRITERS WHO CARE — getwrite.io"* mixes register; that copy belongs in the tagline.

## Body (sans 300 light, one paragraph, three clauses)

The hero body is **one paragraph** containing three clauses. Visually, the middle clause lifts into `brand-white` to carry the rhetorical weight; the openers stay in `brand-mid`.

```
[Positive opener — what I do]   [Italicized stance — what I reject]   [Positive closer — what I leave]
```

### Live example (saboteur.dev)

> I build tools for people who make things.
> *No lock-in. No committees. No feature designed by a growth team.*
> Just software that respects the work.

The structure does three things in one breath: states the audience, names the rejections specifically, lands on a positive without sliding into marketing speak.

### The three clauses

**Opener** — *"I build tools for people who make things."*
- One sentence. Plain verb. Names the audience or category in concrete terms.
- Subject-verb-object. The product (or company) is the subject; the verb is plain; the object is what it does *for* the reader.
- Stay under 80 characters.

**Stance** (the middle clause, wrapped in `<em class="not-italic text-fg-primary">`) — *"No lock-in. No committees. No feature designed by a growth team."*
- Names what the product or company *rejects*, specifically.
- The voice's sharpest beat. *No A. No B. No C.* — three-beat rhythm.
- Name targets by name: *committees*, *the algorithm*, *growth team*, *lock-in*. Generic targets (*the status quo*, *legacy software*) are weaker.
- End on the strongest beat. The reader remembers the last item.

**Closer** — *"Just software that respects the work."*
- A positive landing. One short clause.
- Optional. If the stance ends in a strong enough beat, the closer can be cut. But the live page keeps it because it returns the reader to the affirmative.

### Do

- Use a single paragraph. The three clauses are one breath.
- Use plain verbs. *I build*. *I make*. *I ship*.
- Keep the stance to three beats. Two beats is fine; four starts to feel like a list.

### Don't

- Don't break the stance into a separate paragraph — the inline structure is the voice.
- Don't italicize the stance visually with `font-style: italic`. Use `<em>` semantically and lift via `text-fg-primary`.
- No marketing verbs (*unleash, empower, supercharge, delight, transform*).
- No "the future of X" / "the new way to Y" formulations.
- No hedging (*might*, *can help you*, *designed to*). Make the claim or don't.
- No exclamation marks. No emoji.

## CTA (mono, optional)

Pattern: a short uppercase phrase, mono, `tracking-label-wide` (0.18em), with a red underline (the existing button-like text-link style). At most one in the hero.

### Examples

- `REQUEST EARLY ACCESS →`
- `OPEN THE APP →`
- `READ THE DOCS →`
- `GET IN TOUCH →`

### Do

- Use a verb. The CTA describes the action the reader takes, not the page they land on.
- Use the `→` glyph for forward motion. Not `>>`, not `›`, not an arrow icon.
- Make the destination unambiguous. *REQUEST EARLY ACCESS* implies a form; *OPEN THE APP* implies a launch.

### Don't

- No two CTAs in the hero (no *Sign up* + *Learn more*). One.
- No CTAs that resemble platform buttons (rounded pills, gradient fills). The Saboteur CTA is text with a red baseline rule.
- No CTAs on parent pages by default — `saboteur.dev` doesn't have one, and that's intentional.
