# Contact

The form section. **Optional** but extremely common — most Saboteur landing pages include it. On the parent page it captures press inquiries, partnership requests, and early-access signups; on a product page it doubles as the product's contact channel.

For the form's backend, compliance, and Worker template, see [`../../compliance/forms.md`](../../compliance/forms.md). For the cookieless rules that apply, see [`../../compliance/cookieless-by-default.md`](../../compliance/cookieless-by-default.md).

## Purpose

Give visitors a single, low-friction way to reach Saboteur. The form is also the place where the brand's voice closes out the page — *"We read everything. We reply to most of it."* sits below the form on every Saboteur landing page that has one.

## Variants

| File | When to use |
|---|---|
| [`form.html`](form.html) | Default. Stylized intro on the left, form on the right. Submit posts to the default Saboteur form backend (CF Worker → Resend). |

## Anatomy

The contact section uses the **standard section grid**, but with the section label *and* an intro paragraph in the left column (rather than just the label):

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  CONTACT       ┌──────────────┐ ┌──────────────┐                 │
│                │ NAME         │ │ EMAIL        │                 │
│  Press         │              │ │              │                 │
│  inquiries.    └──────────────┘ └──────────────┘                 │
│  Artist        ┌─────────────────────────────────┐               │
│  partnerships. │ REGARDING ▾                     │               │
│  Early access. └─────────────────────────────────┘               │
│  Anything      ┌─────────────────────────────────┐               │
│  else.         │ MESSAGE                         │               │
│                │                                 │               │
│                └─────────────────────────────────┘               │
│                                                                  │
│                [ SEND MESSAGE → ]                                │
│                                                                  │
│                We'll only use your email to reply. We don't      │
│                share it, sell it, or store it past our reply.    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                                                                          (no border-b on contact —
                                                                           it's the last section)
```

### Left column

- The section label (`Contact`) at the top, same style as other sections.
- Below the label: a four-line list of inquiry types in `brand-dim`. Each on its own line via `<br>`. Sans 12px, leading 2.

```
Press inquiries.
Artist partnerships.
Early access.
Anything else.
```

This list is **not** a set of nav buttons — it's prose telling the visitor what they can write to us about.

### Right column (the form)

- **Layout** — `flex flex-col gap-[2px]`. The 2px gap shows the dark background between adjacent fields and gives the form its characteristic stacked-card appearance.
- **Name + Email row** — `grid grid-cols-2 gap-[2px]` so the two short fields share one row on desktop. Stack on mobile.
- **Each field** — a `<label>` div above the input, sharing borders to look like one card:
  - **Label** — mono 9px tracking `0.18em` uppercase, `brand-mid`. Background `brand-surface`, hairline border `border-brand-dim` on top + sides (no bottom).
  - **Input / select / textarea** — mono 12px, `text-brand-white`, `bg-brand-surface`, hairline border `border-brand-dim` on sides + bottom (no top). Padding `0 14px 11px` for input/select; `12px 14px` for textarea. Focus border lifts to `border-brand-mid`. `appearance: none` to suppress browser defaults on select.
- **Submit** — **filled red** (`bg-brand-red`), mono 10px tracking `0.2em` uppercase, white text, `padding: 14px 24px`, no border. Self-start (left-aligned, not full-width). `hover:opacity-90`.
- **Lawful-basis copy** — directly below the submit, sans 10px in `brand-dim`. *We'll only use your email to reply. We don't share it, sell it, or store it past our reply.*

### After the form

The closing line **"We read everything. We reply to most of it."** lives below the form (still in the right column). Sans 13px or 14px in `brand-mid`, with extra top margin. This line is brand canon and appears wherever a Saboteur contact form lives.

## Rules

1. **Submit button is filled red.** This is the single context in the Saboteur visual language where a filled-red rectangle CTA is allowed — it's the page's primary commit action. Don't use the filled-red button anywhere else on the page.
2. **No newsletter checkbox.** The form captures *replies-only* intent. Mixing in a marketing-list opt-in changes the lawful basis and complicates the privacy policy.
3. **The four-line intro is the canonical pattern.** Use the live phrasing or close variants. Each line names a *kind of message we welcome*. End with a softer line — *"Anything else."* — to invite messages that don't fit the categories.
4. **Honeypot, not reCAPTCHA.** A hidden `<input name="company">` field positioned off-screen catches most bots. Turnstile is added when traffic warrants it. reCAPTCHA is forbidden per [`../../compliance/cookieless-by-default.md`](../../compliance/cookieless-by-default.md).
5. **Closing line stays.** *"We read everything. We reply to most of it."* — this is the brand's voice landing the page. Don't rewrite to be more "professional."
6. **Contact section drops the bottom hairline rule.** It's the last section before the footer; no rule beneath it.

## Backend

The Saboteur default is a **Cloudflare Worker that calls Resend** — see [`../../compliance/forms.md`](../../compliance/forms.md) for the Worker template, env vars, and compliance requirements. The form's `action` URL points at the Worker (e.g., `https://forms.saboteur.dev/contact`).

The live `saboteur.dev` currently posts to `formsubmit.co` (a third-party forwarder). The default in this repo is the Worker pattern; the validation port at [`../../sites/landing-page/examples/saboteur-dev/`](../../sites/landing-page/examples/saboteur-dev/) uses a placeholder Worker URL accordingly.
