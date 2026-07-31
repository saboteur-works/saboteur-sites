# Long-form voice

How Saboteur sounds at nine hundred words instead of forty.

This extends [`brand/identity.md`](../../../brand/identity.md) §Voice and the section-copy reference at [`../../write-saboteur-site-section-copy/references/voice.md`](../../write-saboteur-site-section-copy/references/voice.md). Everything in those documents still applies — first person singular, no marketing verbs, no hedged claims, no exclamation marks, no emoji. Nothing below relaxes any of it.

What is new is that the existing rules were written for a mission paragraph, and three of them behave differently once the copy has to sustain itself over pages.

## The three that change scale

### "End sentences early" is a rhythm, not a setting

Clipped declaratives are what make a hero land. Nine hundred consecutive words of them reads as a manifesto, and a manifesto is exhausting to read and easy to distrust — it performs certainty instead of demonstrating it.

In long form the short sentence is punctuation. Build the reasoning in ordinary sentences of ordinary length, then close a movement on a short one. The clipped line does its work *because* the sentences around it aren't.

> The loader ran on every request because that was the only place with access to the session. It worked, it was fast enough, and it was wrong for a reason that took me two weeks to see. Caching was hiding the bug.

Not:

> The loader ran per request. It had session access. It worked. It was fast. It was wrong. Caching hid the bug.

### "Don't explain the joke" applies to the stance, not the work

On a landing page, a position is stated and left standing. Explaining it there weakens it.

A post is the opposite instrument: it exists to show the work. The reasoning, the wrong turn, the measurement, the thing that didn't work — that is the entire value of the format. What still doesn't get explained is the *stance*. Don't defend the fact that you build local-first software; demonstrate what building it actually cost.

Show the work. Don't justify the posture.

### "I" gets easier, and needs watching in one place

First person singular is more natural over paragraphs than it is on a button, so the rule mostly stops being awkward. The exception is anything that reads as advice to the reader. *You should always…* turns a post into a tutorial written by an authority, which is a voice Saboteur doesn't have.

Write what happened, in the first person, and let the reader draw the transferable part:

> I moved the check into the build step. It costs eleven seconds and it has caught three broken policies since.

Not:

> You should move these checks into your build step. It's a best practice that will save you time.

## What a post is

A problem actually solved while building the products. That is the whole remit.

A post is finished when the problem is resolved, which means there is no target length and no minimum. A post that needs four hundred words is four hundred words. A post padded to two thousand for search engines is the thin content the surface exists to avoid — see [`tech/seo.md`](../../../tech/seo.md) §6.

**Never write a post for a keyword.** If the only reason a topic is on the list is that people search for it, it isn't a post. This is the single rule most likely to be broken quietly and with good intentions.

## Structure

**Open with the problem.** First sentence, no runway. No *In this post I'll cover*, no *Recently I've been thinking about*, no definition of a term the reader already knows.

**No summary conclusion.** Stop when the last real point is made. A closing paragraph that restates the post is throat-clearing moved to the end. If the post genuinely resolves to something, that resolution *is* the ending — write it and stop.

**Section headings are labels, not teasers.** `The caching bug` — not `Where it all went wrong`. Headings start at `##`; the `#` level is the title the layout renders.

**Code blocks are real code.** From the actual work, at the smallest size that shows the point. Illustrative pseudo-code that never ran is a claim without evidence.

## Titles

Descriptive. A reader should know from the title whether the post is for them.

- *Why the changelog is one page*
- *The policy renderer runs at build time*

Not: *5 things I learned about static sites* · *The ultimate guide to Astro content collections* · *How I 10x'd my build times* · *Static sites are dead. Here's what's next.*

No listicles, no numbers in the count sense, no colon-subtitle construction, no question titles that the post then answers. 70-character cap, enforced by the collection schema.

## The description field

140–160 characters, hard-capped at 160 by the schema. It is the meta description, the search snippet, and the RSS summary — it is what a stranger decides on.

Write it as the post's opening line, not a summary of the post. It is the only piece of a post that is unavoidably doing marketing's job, and the way to keep it in voice is to make it a statement of the problem rather than a pitch for the answer.

> One page per release note would put dozens of near-identical thin URLs on a domain that has fewer than a dozen pages total. Here is the arithmetic.

## Changelog entries are not posts

Different instrument, and the voice compresses rather than extends.

- State what changed for the reader. `Search now matches on tags.`
- Past tense for fixes, present for new behaviour. `Fixed a crash when…` / `Exports now include…`
- No feelings about the change. Not `Improved search` and never `Improved search!`
- Skip internal churn. A bumped dependency is not a release note.
- No headings inside an entry — the version is the heading.

A changelog is a record. The restraint that makes the landing-page voice work is already the correct register for it.

## The check

Read the draft and ask: would this paragraph read correctly on another company's engineering blog with the product name swapped?

If yes, it is either too generic to publish or it is duplicating a stance the landing page already states better. Both are rewrites. This is the same doorway-page invariant that governs section copy — it does not stop applying because the format got longer.
