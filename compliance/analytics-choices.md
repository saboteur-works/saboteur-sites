# Analytics choices

Saboteur sites are cookieless. That makes the analytics decision narrow: either use a tool designed to work without cookies and consent, or don't use analytics at all.

## Default: Cloudflare Web Analytics

The recommended choice for every Saboteur site that wants analytics.

- **Free.** No quota concerns at landing-page traffic levels.
- **Cookieless.** No client storage. No fingerprinting.
- **Native.** Already in the same Cloudflare account that hosts the site.
- **Privacy-positive.** Cloudflare doesn't sell or share analytics data, and the analytics token is per-zone rather than per-user.

### Setup

1. In the Cloudflare dashboard, open **Analytics & Logs → Web Analytics → Add a site**.
2. Choose **Manual setup** (the "Automatic via Cloudflare proxy" option also works, but the manual snippet is portable).
3. Copy the token Cloudflare generates.
4. Add the snippet to the site's base layout, near the end of `<body>`:

```html
<script defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'></script>
```

5. Deploy. Data appears in the dashboard within ~30 minutes of the first visit.

### What it captures

Page views, referrers, country (from CF's IP geolocation, not stored client-side), browser/OS class, device class. **No individual user can be identified.**

### Privacy policy entry

Cloudflare Web Analytics is privacy-safe enough that a separate disclosure is optional. As a courtesy, include one line in the privacy policy:

> *"This site uses Cloudflare Web Analytics, a cookieless analytics service. No personal data or browser storage is used to track visitors."*

## Acceptable alternatives

| Tool | Cost | Notes |
|---|---|---|
| [Plausible](https://plausible.io) | ~$9/mo | Self-explicit no-cookie design, EU-hosted option, rich documentation. |
| [Fathom](https://usefathom.com) | ~$15/mo | Similar to Plausible. Stronger US/UK focus. |
| [Simple Analytics](https://www.simpleanalytics.com) | ~$10/mo | Similar; emphasizes minimalism. |

Pick one of these only if Cloudflare Web Analytics lacks a specific feature you need (custom events, conversion goals, etc.) and the cost is worth it.

## Forbidden by default

- **Google Analytics (GA4, Universal Analytics).** Sets cookies. Repeatedly ruled by EU DPAs to require consent. Requires a banner — defeats the cookieless posture.
- **Hotjar, Mixpanel, Amplitude, Heap, Segment.** All set cookies or use client storage. All require consent flows.
- **Facebook Pixel, LinkedIn Insight, TikTok Pixel, Pinterest Tag.** Marketing trackers with active consent requirements.
- **reCAPTCHA v3.** Not analytics, but worth naming here — it loads Google fingerprinting. Use Cloudflare Turnstile instead (see [`forms.md`](forms.md)).

Adopting any of these means the site is no longer cookieless. At that point a full consent banner and a privacy-policy rewrite are required, and the Saboteur stance is compromised.

## When to skip analytics entirely

For a pre-launch landing page or a hand-built one-off, *no analytics* is a valid choice. The cookieless posture costs nothing here. Add CF Web Analytics later if the data becomes useful.

## Pre-launch audit

- [ ] No analytics snippet other than Cloudflare Web Analytics (or one of the acceptable alternatives).
- [ ] DevTools Network tab shows no requests to `google-analytics.com`, `googletagmanager.com`, `static.hotjar.com`, or similar.
- [ ] The chosen analytics tool is referenced in the privacy policy (or, for CF Web Analytics, optionally mentioned).
