---
# Copy this file to a new name to start a post. The filename becomes the URL:
#   src/content/blog/local-first-sync.md  ->  /blog/local-first-sync
# A published filename is permanent — renaming it breaks every inbound link.
#
# Underscore-prefixed files are excluded by the glob loader in
# src/content.config.ts, so this template never builds and never ships.

# <= 70 characters. Becomes the <h1> and the first half of <title>.
title: TODO

# 140–160 characters, hard-capped at 160. This is the meta description, the
# search snippet, and the RSS summary. Write it as the post's opening line, in
# voice — not a keyword list, not a summary of a summary.
description: TODO

# Plain ISO day. No time, no timezone — the layouts format in UTC so a post
# never shifts a day for a reader in another zone.
pubDate: 2026-01-01

# Uncomment only when a PUBLISHED post is materially revised. Fixing a typo is
# not a revision.
# updatedDate: 2026-01-01

# true until it is finished. Drafts get no page, no URL, no feed item, and
# `npm run ci` fails if one reaches the build output.
draft: true

# Optional. Self-hosted 1200x630 card under public/assets/. Never a third-party
# host. ogImageAlt is REQUIRED whenever ogImage is set — the schema enforces it.
# ogImage: /assets/og-post-slug.png
# ogImageAlt: TODO — what the card shows, not a marketing line.
---

Open with the problem, not with throat-clearing. No "In this post I'll cover".

The body is markdown and gets the shared `.prose` styling. Use `##` for section
headings — the `#` level belongs to the post title, which the layout renders.

Voice rules apply unchanged and are not relaxed for long-form: first person
singular, declarative, no marketing verbs, no exclamation marks. See
saboteur-sites/skills/write-saboteur-post/references/long-form-voice.md.

Images in a post body are allowed — the one authored surface where they are.
They must be self-hosted under `/assets/` and carry a real `alt` describing what
the image shows. See saboteur-sites/sections/SHARED-image-rules.md.
