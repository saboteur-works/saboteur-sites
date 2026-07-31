---
# Copy this file to start a release entry. One file per release, so two
# releases never collide in git — but they all render onto the single
# /changelog page, newest first.
#
# Name the file after the version: 0-4-0.md, 2026-07.md
# Underscore-prefixed files never build, so this template is safe to keep.

# The release as you would say it out loud. Becomes the entry's <h2> and its
# anchor: "0.4.0" -> /changelog#v0-4-0
version: TODO

# Plain ISO day. Sorts the page.
date: 2026-01-01

# Optional, <= 160 characters. One line naming what this release is about,
# rendered beside the date. Skip it rather than pad it.
# summary: TODO

draft: true
---

The body is markdown, rendered under the version heading.

**No headings in an entry body.** The `##` level is the entry itself — a
heading here would skip a level and break the page's outline. Lists and
paragraphs only.

- State what changed, not how it feels. `Search now matches on tags.` — not
  `Improved search!`
- Past tense for fixes, present for new behaviour. `Fixed a crash when…` /
  `Exports now include…`
- No marketing verbs, no exclamation marks. A changelog is a record.
- Skip internal churn. A reader wants what changed for them, not that a
  dependency was bumped.
