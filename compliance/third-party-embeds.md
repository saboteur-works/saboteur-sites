# Third-party embeds

Embeds — YouTube videos, Vimeo players, Twitter/X cards, Google Maps, Calendly inline widgets, Stripe Buy Buttons, Instagram embeds, Spotify players — load assets from third parties on page render. Most of them **set cookies and transmit visitor IPs without consent**, which breaks the cookieless posture immediately.

Per the [`cookieless-by-default`](cookieless-by-default.md) charter, the rule is: **no third-party embeds on initial load.**

## Preferred: don't embed at all

The cheapest way to stay compliant is to remove the third-party dependency.

| Common embed | Self-hosted alternative |
|---|---|
| YouTube / Vimeo video | `<video>` tag with a hosted MP4 (e.g., uploaded to Cloudflare R2 or served from the site). |
| Twitter/X card | Quote the tweet as text. Link to it. Don't embed the live card. |
| Google Maps | A static screenshot (`<img>`) with a link out to maps. Or use [OpenStreetMap static tiles](https://www.openstreetmap.org/) hosted yourself. |
| Calendly inline | A text link to your booking page. The user clicks through to Calendly's own domain — no embed on your site. |
| Stripe Buy Button | A regular checkout link. Stripe's hosted checkout is fine; the embed is what's risky. |
| Spotify embed | A `<a>` link with the track/artwork as an `<img>`. |
| Instagram embed | Screenshot + link. |

Self-hosting trades a small amount of richness for a clean compliance posture. Almost always worth it.

## When you must embed: click-to-load

If an embed is genuinely needed (a long-form video, an interactive map, a live booking widget), use the **click-to-load pattern**: render a placeholder card on initial load, then fetch the third-party content only after the user clicks the placeholder.

This is the *only* form of third-party embedding permitted by default. The pattern lives at [`snippets/click-to-load-embed.html`](snippets/click-to-load-embed.html).

### How click-to-load works

1. The page initially shows a styled placeholder — a card that looks like the embed but is fully self-hosted (no third-party requests).
2. The placeholder includes an explicit notice: *"Click to load. This will share your IP and may set cookies."*
3. On click, JavaScript swaps the placeholder for the real embed.
4. The third-party then loads — but only because the user consented through their click.

This is the **only** way to maintain "no third-party assets on initial load" while still offering rich embeds when needed.

### YouTube specifically

If the embed is a YouTube video, use the **`youtube-nocookie.com`** embed URL — it sets fewer cookies than the standard `youtube.com` embed. Even so, wrap it in click-to-load. The nocookie URL is *better*, not *compliant*.

## What about CDN-loaded fonts, scripts, analytics?

Those are covered by other rules:

- **Fonts:** [`fonts.md`](fonts.md). Self-host. No `fonts.googleapis.com`.
- **Analytics:** [`analytics-choices.md`](analytics-choices.md). Only Cloudflare Web Analytics or one of the acceptable alternatives.
- **Scripts (Stripe, Turnstile, etc.):** These are first-party-initiated but still load from the vendor's domain. They are allowed when they are functionally necessary (Stripe Elements for a checkout, Turnstile for a form). The privacy policy must disclose the data flow. They are *not* embeds in the sense this file uses the term.

## Audit

- [ ] No `<iframe>` on initial render that loads from a third-party domain (youtube.com, vimeo.com, google.com/maps, calendly.com, instagram.com, twitter.com, spotify.com, etc.).
- [ ] Every necessary embed is wrapped in the click-to-load pattern.
- [ ] DevTools Network tab on first page load shows requests only to the site's own origin (and possibly Cloudflare Web Analytics).
- [ ] Each embed source the site uses is named in the privacy policy along with what it does (sets cookies, captures IP) and that the user opts in by clicking.
