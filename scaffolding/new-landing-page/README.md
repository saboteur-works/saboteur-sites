# New landing page — bootstrap guide

How to spin up a new Saboteur landing page from scratch using the starter files in this directory.

## Prerequisites

- Node.js 20+
- A Cloudflare account (free tier is enough)
- A domain in Cloudflare DNS

## Steps

### 1. Create a new repo

```bash
gh repo create saboteur-works/<product>-site --private --clone
cd <product>-site
```

### 2. Copy starter files

Copy the contents of `starter-files/` into the new repo root:

```bash
cp -r path/to/saboteur-sites/scaffolding/new-landing-page/starter-files/. .
```

### 3. Fill in per-site values

Open `README.md` and complete every `TODO` line — product name, domain, brief description. This doubles as the site's README.

Open `astro.config.mjs` and set `site` to the production URL (e.g. `https://offbeat-fm.com`).

Open `src/pages/index.astro` and set `title` and `description` in the `<Base>` props.

### 4. Choose your sections

`src/pages/index.astro` starts with the required four sections plus a Contact section. Add or remove optional sections based on the variant:

- **Product page:** Nav · Hero · Mission · (Features) · (Status) · (Contact) · LegalFooter
- **Parent page:** Nav · Hero · Mission (with tenets) · ProductsPreview · Status · Contact · LegalFooter

Section component stubs are not included — copy from [`../../../../sections/`](../../../../sections/) and translate to `.astro` as needed, or generate from the section READMEs directly.

### 5. Install and run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:4321`. Verify typography, spacing, and the mark renders correctly.

### 6. Deploy to Cloudflare Pages

1. Push to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repo. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Deploy. Note the `*.pages.dev` preview URL.

### 7. Custom domain

In the Pages project → **Custom domains → Set up a custom domain**. Point it at the production URL set in `astro.config.mjs`.

### 8. Pre-launch

Run through [`../../../../compliance/pre-launch-checklist.md`](../../../../compliance/pre-launch-checklist.md) before making the site public.
