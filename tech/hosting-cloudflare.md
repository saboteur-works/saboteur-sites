# Hosting — Cloudflare Pages

Every Saboteur site is a static Astro build on **Cloudflare Pages**, deployed by **Git integration**: push to the production branch, Cloudflare builds and deploys. No manual uploads, no GitHub Actions, no deploy credentials stored anywhere.

The build is also the enforcement point. A site whose privacy policy contradicts its config, or whose committed legal pages have drifted from the shared templates, **fails the build instead of deploying**. See [`../compliance/policy-tooling.md`](../compliance/policy-tooling.md).

## Before you connect anything: the one-way door

Cloudflare Pages projects are **either** Direct Upload **or** Git-connected, decided at creation and permanent in both directions:

> "If you choose Direct Upload, you cannot switch to Git integration later."
> — [Direct Upload docs](https://developers.cloudflare.com/pages/get-started/direct-upload/)
>
> "If you deploy using the Git integration, you cannot switch to Direct Upload later."
> — [Git integration docs](https://developers.cloudflare.com/pages/configuration/git-integration/)

**A project created by dragging a `dist` folder into the dashboard is a Direct Upload project.** It cannot be converted. Moving it to Git means creating a *new* Pages project and migrating the custom domain across — see [Migrating an existing manually-uploaded site](#migrating-an-existing-manually-uploaded-site).

Decide once, per site, at creation.

## Prerequisites

- The site is a **GitHub repo under `saboteur-works` with at least one commit pushed**. Cloudflare cannot connect to an empty repo.
- The repo's dependencies are all public or registry-hosted. Saboteur sites depend on `saboteur-styles` and `saboteur-sites` as **public** GitHub git dependencies, which the Cloudflare build runner fetches unauthenticated. If either repo is ever made private, every build breaks and the fix is a deploy token, not a retry.

  You will notice `package-lock.json` records these as `git+ssh://git@github.com/...`, which looks like it must fail on a runner with no SSH key. It doesn't — npm falls back to HTTPS for public repos. Verified with `GIT_SSH_COMMAND=/bin/false npm ci`, which installs both dependencies and passes the full `ci` chain. Specifying the dependency as an explicit `git+https://` URL changes nothing, because npm normalizes GitHub URLs back to SSH in the lockfile either way. Don't spend an afternoon on it.
- `public/_headers` exists. Under Git integration every branch push gets a preview URL, and without the `noindex` rules in that file each one is an indexable duplicate of production.

## Connecting a repo (dashboard, one time per site)

Git integration is set up in the Cloudflare dashboard. There is no wrangler command for it — `wrangler pages project create` makes a *Direct Upload* project, which is the thing you don't want.

1. **Workers & Pages → Create → the *Pages* tab → Connect to Git.**

   **The dashboard steers you into the Workers flow.** Cloudflare unified the two products and the Workers "Import a repository" path is the default; the Pages tab is easy to miss. Tell them apart by the fields:

   | You're in… | Fields you see |
   |---|---|
   | **Pages** (what you want) | Build command, **Build output directory**, Root directory |
   | **Workers** (wrong flow) | Build command, **Deploy command**, **Path**, and *no* output directory |

   If you see a **Deploy command** or a **Path** field, back out — you're creating a Worker, not a Pages project. `Path` there is the *root directory*, not the output directory; putting `dist` in it breaks the build, because there's no `package.json` inside `dist`.

   Going the Workers route is a real option, but not a drop-in one: it needs a `wrangler.jsonc` declaring `./dist` as the assets directory, and `public/_headers` rewritten — Workers preview URLs are `<version>-<worker>.<subdomain>.workers.dev`, so the `pages.dev` noindex rules would match nothing and every preview would become an indexable duplicate of production, silently. Per-branch preview aliases are also still "coming soon" on Workers. Don't switch casually.
2. Authorize the **Cloudflare GitHub App** for the `saboteur-works` organisation. Grant it access to the specific repo rather than all repos. You can confirm or revise this later at GitHub → Settings → Applications.
3. Select the repository.
4. Set the build configuration:

   | Setting | Value |
   |---|---|
   | Framework preset | Astro |
   | Build command | `npm run ci` |
   | Build output directory | `dist` |
   | Root directory | `/` |
   | Production branch | `main` |

5. Leave environment variables empty. **The Node version comes from `.nvmrc`**, which every Saboteur site commits at its root — see below.
6. Save and deploy.

### Node version: use `.nvmrc`, not a dashboard variable

Cloudflare Pages resolves the Node version from, in order: a `NODE_VERSION` environment variable, a `.nvmrc` or `.node-version` file, or the build image default.

Saboteur sites commit **`.nvmrc`** containing `22`, and declare `"engines": { "node": ">=22" }` in `package.json`. Prefer this over the dashboard variable:

- It is **version-controlled**. A dashboard variable is invisible state that doesn't survive recreating the project and isn't reviewable in a diff.
- The dashboard splits environment variables into **Production** and **Preview**. Setting `NODE_VERSION` for production only is a real way to get previews building on a different Node than production.
- `nvm use` picks it up locally, so local and CI agree by construction.

The v3 build image already defaults to Node 22.16.0, so on a freshly created project this is belt-and-braces rather than load-bearing. It stops being belt-and-braces the moment a project lands on an older build image (v2 defaults to 18.17.1, v1 to 12.18.0) — which is exactly when a build mysteriously fails on syntax that works locally.

### Why the build command is `npm run ci`, not `npm run build`

`ci` is defined in every site's `package.json` as:

```
npm run policies:check && npm run build && npm run policies:audit
```

- **`policies:check`** re-renders the legal pages from `policy.config.json` and the shared bodies, and fails if the committed pages differ. Runs *before* the build so it fails in seconds.
- **`build`** is the ordinary Astro build.
- **`policies:audit`** scans the built output for third-party hosts the privacy policy doesn't declare, and for declared processors the build never contacts. Runs *after* the build because it needs `dist/`.

A failing gate means the deploy does not happen and production keeps serving the last good build. That is the intended behaviour: a legally inaccurate page is worse than a stale one.

`policies:upstream` is deliberately **not** in `ci`. It makes a network call to the GitHub API and reports when the reference policy corpus changes upstream — a quarterly review task, not a deploy gate. A build should never fail because Automattic edited their terms.

### When a shared template changes

`saboteur-sites` is pinned by branch, not by commit, so a site picks up the current shared bodies on each fresh install. If a shared body changes, `policies:check` **fails** the next build rather than silently republishing altered legal text.

That is the point. The repair is deliberate:

```bash
npm install                # pull the updated templates
npm run policies:render    # re-render
git diff src/pages         # read what changed in your legal text
```

Then bump `tokens.last_updated`, commit, and push. Never bypass the gate.

## Preview deployments

Git integration gives every branch a preview URL, plus a preview link on each pull request. Saboteur keeps these **enabled** — reviewing copy on a real URL before it reaches production is most of the value of connecting Git at all.

This is safe only because `public/_headers` sends `X-Robots-Tag: noindex, nofollow` on both `*.pages.dev` shapes. Verify after the first preview deploy:

```bash
curl -sI https://<branch>.<project>.pages.dev/ | grep -i x-robots-tag
```

If that returns nothing, stop and fix `_headers` before pushing anything else. Two rules are required, not one — a placeholder stops at a period, so a single rule cannot match both `<project>.pages.dev` and `<branch>.<project>.pages.dev`.

To turn previews off instead, set the preview branch to *None (Disable automatic branch deployments)* in the project's branch control settings.

## Custom domains

Add the production domain under **the Pages project → Custom domains**. Cloudflare creates the DNS record automatically when the zone is in the same account, which it is for every Saboteur domain.

The `*.pages.dev` URL keeps working after a custom domain is attached. It stays `noindex` via `_headers`, which is what we want — production should be indexed only under its real domain.

## Migrating an existing manually-uploaded site

For a site currently on a Direct Upload project. The conversion is impossible, so this is a replacement with a domain cutover.

1. Push the repo to GitHub if it isn't already.
2. Create a **new** Pages project connected to Git, per the steps above. Give it a distinguishable name — the old project still holds the one you'd want.
3. Let it build and verify the result on its `*.pages.dev` URL: the pages render, `/privacy` and `/terms` resolve, and the security headers are present.
4. **Remove the custom domain from the old project.** It cannot be attached to two projects at once, so this must come before step 5.
5. Add the custom domain to the new project. Cloudflare re-points DNS.
6. Confirm production serves the new build, then delete the old project so nobody deploys to it by accident.

Expect a short window between steps 4 and 5 where the domain does not resolve. Do it deliberately, not during a traffic spike.

## What is deliberately not here

- **No GitHub Actions.** Cloudflare's build runner already runs the gates on every push. A second CI system would duplicate the work and add a place for the two to disagree. Add Actions only if you want checks on pull requests that must pass *before* merge — Cloudflare's preview build reports status but does not block.
- **No wrangler in the deploy path.** `wrangler` is still the right tool for the form Worker; it is not involved in deploying a Pages site under Git integration.
- **No deploy credentials in the repo.** Git integration authenticates through the GitHub App. Nothing to store, nothing to rotate, nothing to leak. This is the main reason to prefer it over direct upload from CI.

## Troubleshooting

| Symptom | Cause |
|---|---|
| Build fails resolving `saboteur-styles` or `saboteur-sites` | The repo was made private, or the default branch was renamed. Git deps track the default branch. Not caused by the `git+ssh` URLs in the lockfile — see [Prerequisites](#prerequisites). |
| Build fails on a Node syntax error that works locally | The project landed on an older build image. Confirm `.nvmrc` is committed at the repo root, and that the root directory setting points at it. |
| Preview builds behave differently from production | A `NODE_VERSION` variable was set on only one of the two environments. Delete it and rely on `.nvmrc`. |
| `policies:check` fails on a build you didn't change | A shared body in `saboteur-sites` moved. See [When a shared template changes](#when-a-shared-template-changes). |
| `policies:audit` reports an undeclared host | The build gained a third-party reference. Either it's a real processor and belongs in `policy.config.json`, or it's an outbound link and belongs in `allowedHosts`. |
| Preview URLs appearing in search results | `_headers` is missing, or has only one of the two `pages.dev` rules. |
| Custom domain won't attach | It's still attached to the old Pages project. Remove it there first. |
