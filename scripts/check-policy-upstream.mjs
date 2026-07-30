#!/usr/bin/env node
/**
 * check-policy-upstream.mjs
 *
 * Nothing open source keeps your policy text current for you. This is the
 * substitute: watch a small corpus of policies maintained by legal teams with
 * real budgets, and tell us when they change their language.
 *
 * It does not copy their text — the licences differ and their surface is much
 * larger than ours. It tells us *something moved*, so we can read the diff and
 * decide whether it applies to a cookieless landing page.
 *
 * Pins the last commit that touched each upstream file in
 * compliance/policy-upstream.lock.json. On drift it prints a GitHub compare
 * link so the change is one click away.
 *
 * Usage:
 *   node scripts/check-policy-upstream.mjs            # check; exit 1 on drift
 *   node scripts/check-policy-upstream.mjs --update   # re-pin to current
 *
 * Set GITHUB_TOKEN to raise the API rate limit (60/hour unauthenticated is
 * plenty for this, but CI shares an IP).
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..");
const LOCK_PATH = join(REPO_ROOT, "compliance", "policy-upstream.lock.json");

/**
 * The reference corpus. Chosen for being actively maintained by teams with
 * lawyers, openly licensed, and close enough in shape to be worth reading.
 *
 * Note on licences: Legalmattic is CC BY-SA 4.0 — ShareAlike is viral over
 * prose copied verbatim. 37signals is CC BY 4.0. We read both for signal and
 * write our own text, which keeps us clear of both obligations.
 */
const SOURCES = [
  {
    id: "legalmattic-privacy",
    label: "Automattic — Privacy Policy",
    repo: "Automattic/legalmattic",
    branch: "master",
    path: "Privacy-Policy.md",
    why: "Actively maintained, US-first with global coverage. Best signal for privacy language.",
  },
  {
    id: "legalmattic-terms",
    label: "Automattic — WordPress.com Terms of Service",
    repo: "Automattic/legalmattic",
    branch: "master",
    path: "Terms of Service/WordPress.com/EN-Terms-of-Service.md",
    why: "Terms language from a team that gets sued. Much broader than ours; read for structure.",
  },
  {
    id: "basecamp-privacy",
    label: "37signals — Privacy Policy",
    repo: "basecamp/policies",
    branch: "master",
    path: "privacy/index.md",
    why: "Plain-language privacy writing. Repo is archived (frozen 2023-12-26) — a change here would be surprising; the live version is at 37signals.com/policies.",
  },
  {
    id: "basecamp-terms",
    label: "37signals — Terms of Service",
    repo: "basecamp/policies",
    branch: "master",
    path: "terms/index.md",
    why: "Short, readable terms for a small company. Repo is archived; see 37signals.com/policies for the maintained version.",
  },
];

async function latestCommit(source) {
  const url =
    `https://api.github.com/repos/${source.repo}/commits` +
    `?path=${encodeURIComponent(source.path)}&sha=${source.branch}&per_page=1`;

  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "saboteur-sites-policy-watch",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} ${response.statusText} for ${source.repo}/${source.path}`);
  }
  const commits = await response.json();
  if (!Array.isArray(commits) || commits.length === 0) {
    throw new Error(`no commits found for ${source.repo}/${source.path} — has the file moved?`);
  }
  return {
    commit: commits[0].sha,
    date: commits[0].commit.committer.date.slice(0, 10),
  };
}

function loadLock() {
  if (!existsSync(LOCK_PATH)) return { sources: {} };
  return JSON.parse(readFileSync(LOCK_PATH, "utf8"));
}

function saveLock(lock) {
  writeFileSync(LOCK_PATH, JSON.stringify(lock, null, 2) + "\n", "utf8");
}

function fileUrl(source) {
  return `https://github.com/${source.repo}/blob/${source.branch}/${source.path.split("/").map(encodeURIComponent).join("/")}`;
}

function compareUrl(source, from, to) {
  return `https://github.com/${source.repo}/compare/${from}...${to}`;
}

async function main() {
  const update = process.argv.includes("--update");
  const lock = loadLock();
  lock.sources ??= {};

  const drifted = [];
  const failures = [];
  let lockChanged = false;

  for (const source of SOURCES) {
    let current;
    try {
      current = await latestCommit(source);
    } catch (error) {
      failures.push(`${source.id}: ${error.message}`);
      continue;
    }

    const pinned = lock.sources[source.id];

    if (update || !pinned) {
      lock.sources[source.id] = {
        label: source.label,
        repo: source.repo,
        branch: source.branch,
        path: source.path,
        why: source.why,
        commit: current.commit,
        date: current.date,
        url: fileUrl(source),
      };
      console.log(`${pinned ? "re-pinned" : "pinned"} ${source.id} @ ${current.commit.slice(0, 8)} (${current.date})`);
      lockChanged = true;
      continue;
    }

    if (pinned.commit !== current.commit) {
      drifted.push({ source, pinned, current });
    } else {
      console.log(`unchanged  ${source.id} @ ${current.commit.slice(0, 8)} (${current.date})`);
    }
  }

  if (lockChanged) {
    lock.updated = new Date().toISOString().slice(0, 10);
    saveLock(lock);
    console.log(`\nwrote ${LOCK_PATH}`);
  }

  if (failures.length) {
    console.error("\nCould not check:");
    for (const failure of failures) console.error(`  - ${failure}`);
  }

  if (drifted.length) {
    console.error(`\n${drifted.length} upstream polic${drifted.length === 1 ? "y has" : "ies have"} changed since we last looked:\n`);
    for (const { source, pinned, current } of drifted) {
      console.error(`  ${source.label}`);
      console.error(`    ${pinned.date} ${pinned.commit.slice(0, 8)}  →  ${current.date} ${current.commit.slice(0, 8)}`);
      console.error(`    why we watch it: ${source.why}`);
      console.error(`    diff: ${compareUrl(source, pinned.commit, current.commit)}`);
      console.error("");
    }
    console.error(
      "Read the diff. Most changes will not apply to a cookieless landing page.\n" +
        "If one does, update compliance/privacy-policy/body.md or terms-of-service/body.md,\n" +
        "bump tokens.last_updated in each site's policy.config.json, and re-render.\n" +
        "Then re-pin with: node scripts/check-policy-upstream.mjs --update\n"
    );
    process.exit(1);
  }

  if (failures.length) process.exit(1);
  if (!update) console.log("\nok: no upstream policy changes since the last pin.");
}

main().catch((error) => {
  console.error(`error: ${error.message}`);
  process.exit(1);
});
