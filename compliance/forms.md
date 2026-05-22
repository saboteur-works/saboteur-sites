# Forms

Any Saboteur landing page that captures user input (contact form, newsletter signup, lead capture, feedback) processes personal data — even though the site is cookieless. GDPR Article 13 applies; the privacy policy applies; the form's own copy and behavior have requirements.

This file documents the **default Saboteur form backend** (Cloudflare Worker → Resend), the markup contract for form sections, and the compliance items every form must satisfy.

For the form's HTML, see [`../sections/contact/`](../sections/contact/). For where the form fits in a landing page, see [`../sites/landing-page/README.md`](../sites/landing-page/README.md).

## Default backend: Cloudflare Worker → Resend

Both services are already in use across Saboteur, both have generous free tiers, and the combination keeps form handling inside two systems the team understands.

- **Cloudflare Worker.** Receives the POST from the form, validates the payload, applies a honeypot or Turnstile challenge, rate-limits, and calls Resend.
- **Resend.** Sends the email to a Saboteur inbox. No database, no admin UI, no third-party SaaS form vendor.

### Free-tier ceilings

- **Cloudflare Workers:** 100,000 requests/day. Landing pages won't approach this.
- **Resend:** 100 emails/day, 3,000/month on free tier. Plenty for inbound contact volume.

If a future form exceeds these, the backend is straightforward to scale up — but the architecture stays the same.

## Form anatomy

A Saboteur form has the following parts, in order:

1. **Section eyebrow** — number + label, mono.
2. **Heading** — one sentence, sans, brand-white. *Get in touch.*
3. **Body** — one or two short sentences in brand-mid. Sets expectations: who reads this, when they'll reply.
4. **Fields** — name, email, topic (optional), message. Standard browser controls; no custom dropdowns unless necessary.
5. **Honeypot or Turnstile** — invisible. Required.
6. **Lawful-basis copy** — one short sentence near the submit button. *"We'll only use this email to reply to you."*
7. **Submit button** — mono, text-with-red-underline (same styling as a hero CTA).

The markup template is in [`../sections/contact/form.html`](../sections/contact/form.html).

## Worker template

```ts
// src/index.ts — Cloudflare Worker for contact form

interface Env {
  RESEND_API_KEY: string;
  TO_EMAIL: string;            // hello@saboteur.dev
  FROM_EMAIL: string;          // forms@saboteur.dev (verified Resend sender)
  TURNSTILE_SECRET?: string;   // optional — set to enable Turnstile validation
  RATE_LIMITER: KVNamespace;   // optional — set to enable IP rate limiting
}

const ALLOWED_ORIGINS = new Set([
  "https://saboteur.dev",
  "https://offbeat-fm.com",
  // ...add per-site origin
]);

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const origin = req.headers.get("Origin") ?? "";
    if (!ALLOWED_ORIGINS.has(origin)) return new Response("Forbidden", { status: 403 });

    const form = await req.formData();
    const honeypot = form.get("company")?.toString() ?? "";
    if (honeypot.length > 0) return ok(origin); // silent drop for bots

    // Optional: Turnstile validation
    if (env.TURNSTILE_SECRET) {
      const token = form.get("cf-turnstile-response")?.toString() ?? "";
      const valid = await verifyTurnstile(token, env.TURNSTILE_SECRET, req.headers.get("CF-Connecting-IP") ?? "");
      if (!valid) return new Response("Verification failed", { status: 400 });
    }

    // Optional: per-IP rate limit, 5/hour
    if (env.RATE_LIMITER) {
      const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
      const key = `rate:${ip}`;
      const count = parseInt((await env.RATE_LIMITER.get(key)) ?? "0", 10);
      if (count >= 5) return new Response("Rate limit exceeded", { status: 429 });
      await env.RATE_LIMITER.put(key, String(count + 1), { expirationTtl: 3600 });
    }

    const name    = (form.get("name")    ?? "").toString().slice(0, 200);
    const email   = (form.get("email")   ?? "").toString().slice(0, 200);
    const topic   = (form.get("topic")   ?? "").toString().slice(0, 80);
    const message = (form.get("message") ?? "").toString().slice(0, 5000);

    if (!email || !message) return new Response("Missing required fields", { status: 400 });

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: env.TO_EMAIL,
        reply_to: email,
        subject: `[${origin.replace(/^https?:\/\//, "")}] ${topic || "Contact form"}`,
        text: `From: ${name} <${email}>\nTopic: ${topic || "(none)"}\n\n${message}`,
      }),
    });

    if (!resp.ok) return new Response("Send failed", { status: 502 });
    return ok(origin);
  },
};

function ok(origin: string): Response {
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
    },
  });
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  body.append("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const j = (await r.json()) as { success?: boolean };
  return j.success === true;
}
```

Adapt the `ALLOWED_ORIGINS` set and the env vars per-site. The Worker repo can be a tiny standalone repo per Saboteur site, or a shared `saboteur-forms` Worker with multiple `ALLOWED_ORIGINS` and per-origin routing — pick once and keep it consistent.

## Compliance items every form must satisfy

1. **Lawful-basis copy near the submit button.** Plain language naming what happens to the data. *"We'll only use this email to reply to you. We don't share it, sell it, or store it past our reply."*
2. **Privacy policy entry.** What's collected, why, where it goes (Resend as processor, email inbox as final destination), how long it's retained.
3. **Honeypot or Turnstile.** Spam mitigation matters; the cheapest path is a hidden honeypot field. Add Turnstile for heavier-traffic forms.
4. **No reCAPTCHA.** It loads Google fingerprinting and creates its own consent issues.
5. **No analytics events fired from the form by default.** Form-submission tracking via cookies/identifiers is a separate consent surface. Skip it.
6. **Server-side validation.** Client-side `required` is for UX; the Worker re-validates because clients lie.
7. **Field length caps.** As shown in the Worker — name 200 chars, message 5000. Avoid open-ended payload sizes.
8. **No PII in logs.** The Worker should not `console.log` form fields. Cloudflare's request logs see headers and method, not the body — keep it that way.

## Privacy policy snippet

Drop this (or its equivalent) into the privacy policy when a form exists on a site:

> ### Contact form
>
> When you submit the contact form, we collect the email address you provide and the contents of your message. The submission is delivered to a Saboteur LLC inbox via [Resend](https://resend.com) (Resend, Inc., a US company acting as a data processor on our behalf). We retain the message in the inbox for as long as needed to reply and resolve your inquiry, then archive or delete it.
>
> We use your email only to respond to you. We don't add it to a newsletter, share it with anyone, or use it for marketing.

Adjust the wording — but the *substance* (what's collected, who processes it, retention, purpose) is non-negotiable.

## Failure modes & UX

- **Submit succeeds.** Show an inline confirmation: *"Got it. We read everything; we reply to most of it."* Don't redirect — the user stays on the page.
- **Submit fails (network error, 5xx).** Inline error: *"Something went wrong sending that. Try again in a moment, or email hello@saboteur.dev directly."* The fallback email gives the user a path out of a broken form.
- **Rate-limit hit (429).** *"You've sent us a few in a row. Try again in an hour."* Don't shame the user; this is rare.
- **Validation error (empty required field).** Use the browser's native validation. No custom modal.

## Pre-launch audit

- [ ] Form has a honeypot or Turnstile.
- [ ] Lawful-basis copy is visible near the submit button.
- [ ] Privacy policy contains a `Contact form` (or equivalent) section describing the data flow.
- [ ] Worker `ALLOWED_ORIGINS` includes the site's production origin (and no others that don't belong).
- [ ] `RESEND_API_KEY` and `TO_EMAIL` env vars are set on the Worker.
- [ ] Submit succeeds and the test message arrives at the inbox.
- [ ] Form does not log field values anywhere (Worker logs, analytics events).
