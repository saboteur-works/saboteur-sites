# First-time checklist — new landing page

Run this end to end when bootstrapping a brand new Saboteur landing page. Items are ordered so each step depends on the previous one being done.

## Bootstrap

- [ ] New private repo created under `saboteur-works/<product>-site`
- [ ] Starter files copied from `scaffolding/new-landing-page/starter-files/`
- [ ] `astro.config.mjs` — `site` set to production URL (e.g. `https://offbeat-fm.com`)
- [ ] `src/pages/index.astro` — `title` and `description` props filled in
- [ ] `src/pages/index.astro` — correct sections assembled for the variant (product vs. parent)
- [ ] `public/robots.txt` — production domain filled in for `Sitemap:` line
- [ ] Per-site `README.md` — all TODO lines completed

## Local dev

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts without errors
- [ ] Typography renders: display wordmark, Japanese (parent variant only), mono labels
- [ ] Mark is left-aligned with the 4px red bar
- [ ] Body text is warm off-white (`#F5F4F0`), not pure white
- [ ] No console errors in the browser

## Build

- [ ] `npm run build` completes without errors
- [ ] `npm run preview` renders correctly
- [ ] No external font requests (check Network tab — no `fonts.googleapis.com`)
- [ ] No cookies, no `localStorage` writes (check Application tab)

## Deploy

- [ ] Repo pushed to GitHub
- [ ] Cloudflare Pages project created, connected to repo
- [ ] Build settings: framework Astro, build command `npm run build`, output `dist`
- [ ] First deploy succeeds — preview URL renders correctly
- [ ] Custom domain added in Pages → Custom domains
- [ ] DNS propagates — production URL resolves

## Legal & compliance (before going public)

- [ ] Privacy policy published at `/privacy` (from template in `../../../../compliance/privacy-policy/template.md`)
- [ ] Terms of service published at `/terms` (from template in `../../../../compliance/terms-of-service/template.md`)
- [ ] Legal footer links to both `/privacy` and `/terms`
- [ ] Contact form: lawful-basis copy present directly below the submit button
- [ ] Full pre-launch checklist complete: `../../../../compliance/pre-launch-checklist.md`
