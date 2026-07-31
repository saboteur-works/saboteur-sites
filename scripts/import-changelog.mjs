#!/usr/bin/env node
/**
 * import-changelog.mjs
 *
 * Imports a generated CHANGELOG.md (release-please / conventional-commits
 * format) into a site's `changelog` content collection.
 *
 * It imports into the `internal:` list ONLY. That is the whole idea: a
 * generated changelog is a developer artifact written in commit-message voice
 * — "task-3: lift query core; add native-query-backend transport" — and
 * publishing it verbatim gives a reader a wall of text about work they cannot
 * observe. So the generated record becomes the "full picture" behind the
 * toggle, and a human writes the short user-visible body.
 *
 * Consequently this script is NON-DESTRUCTIVE to prose. On an entry that
 * already exists it replaces the `internal:` block and leaves the body, the
 * summary, and the draft flag exactly as they were. Re-run it after every
 * release; it will never overwrite what you wrote.
 *
 * Usage:
 *   node scripts/import-changelog.mjs --changelog ../getwrite/CHANGELOG.md
 *   node scripts/import-changelog.mjs --changelog ./CHANGELOG.md --limit 5
 *   node scripts/import-changelog.mjs --changelog ./CHANGELOG.md --since 2026-07-01
 *   node scripts/import-changelog.mjs --changelog ./CHANGELOG.md --dry-run
 *
 * Fetch the source first if the product repo isn't checked out locally:
 *   gh api repos/<org>/<repo>/contents/CHANGELOG.md --jq .content | base64 -d > /tmp/CHANGELOG.md
 *
 * There is deliberately no network call here. A build that fetches from
 * GitHub fails when GitHub does, and the imported content should be committed
 * and reviewable in the site repo rather than materialising at deploy time.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const USAGE = `Usage: import-changelog.mjs --changelog <file> [options]

  --changelog <file>   generated CHANGELOG.md to read (required)
  --out <dir>          collection directory (default: ./src/content/changelog)
  --limit <n>          import only the n most recent releases
  --since <date>       import only releases on or after YYYY-MM-DD
  --dry-run            report what would change, write nothing
  --help`;

function parseArgs(argv) {
  const args = { out: "./src/content/changelog", dryRun: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--changelog") args.changelog = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--limit") args.limit = Number(argv[++i]);
    else if (a === "--since") args.since = argv[++i];
    else if (a === "--dry-run") args.dryRun = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

/** `1.7.0` -> `1-7-0`, matching the anchor scheme on /changelog. */
const slugify = (version) =>
  version.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Turn one generated bullet into a plain string.
 *
 * The collection renders internal items as text, not markdown, so any markup
 * left in would show as literal asterisks. Commit links go entirely: they add
 * ~500 github.com URLs to the page, which the processor audit would then
 * require declaring as an allowed host, in exchange for links almost nobody
 * follows from a changelog.
 */
function cleanItem(raw) {
  return raw
    .replace(/\s*\(\[[0-9a-f]{6,}\]\([^)]*\)\)\s*$/i, "") // trailing ([sha](url))
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // any other inline link -> its text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **scope:** -> scope:
    .replace(/[*_`]/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split a generated changelog into { version, date, items[] }. */
function parseChangelog(text) {
  const releases = [];
  // ## [1.7.0](compare-url) (2026-07-27)   or   ## 1.7.0 (2026-07-27)
  const heading = /^##\s+\[?([^\]\s(]+)\]?(?:\([^)]*\))?\s*\((\d{4}-\d{2}-\d{2})\)\s*$/gm;

  const marks = [...text.matchAll(heading)];
  for (let i = 0; i < marks.length; i++) {
    const [, version, date] = marks[i];
    const start = marks[i].index + marks[i][0].length;
    const end = i + 1 < marks.length ? marks[i + 1].index : text.length;
    const body = text.slice(start, end);

    const items = [...body.matchAll(/^\s*[*-]\s+(.+)$/gm)]
      .map((m) => cleanItem(m[1]))
      .filter(Boolean);

    releases.push({ version, date, items });
  }
  return releases;
}

/** Serialise a string as a double-quoted YAML scalar. */
const yamlString = (s) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

function internalBlock(items) {
  if (items.length === 0) return "";
  return `internal:\n${items.map((i) => `  - ${yamlString(i)}`).join("\n")}\n`;
}

/**
 * Replace the internal: block in existing frontmatter, preserving every other
 * key and the body. Removes the key and its indented list items, nothing else.
 */
function replaceInternal(frontmatter, block) {
  const lines = frontmatter.split("\n");
  const out = [];
  let skipping = false;
  for (const line of lines) {
    if (/^internal:\s*$/.test(line) || /^internal:\s*\[/.test(line)) {
      skipping = true;
      continue;
    }
    // The block's items are indented; the next unindented key ends it.
    if (skipping) {
      if (/^\s+/.test(line) || line.trim() === "") continue;
      skipping = false;
    }
    out.push(line);
  }
  // Exactly one trailing newline, always. Without this, frontmatter whose last
  // key preceded the internal block gets the block welded onto it:
  // `draft: falseinternal:` — valid-looking, and it silently breaks the parse.
  const cleaned = out.join("\n").replace(/\n*$/, "") + "\n";
  return block ? `${cleaned}${block}` : cleaned;
}

const NEW_BODY = `
<!-- Write what changed FOR A READER here, as a short list. This is the only
     part of the entry anyone sees without opening the toggle.

     The imported list above is everything they cannot observe. Do not just
     summarise it — ask what a user would notice, and say that.

     Then set draft: false. -->
`;

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`error: ${error.message}\n\n${USAGE}`);
    process.exit(2);
  }
  if (args.help) {
    console.log(USAGE);
    process.exit(0);
  }
  if (!args.changelog) {
    console.error(`error: --changelog is required\n\n${USAGE}`);
    process.exit(2);
  }

  const source = resolve(args.changelog);
  if (!existsSync(source)) {
    console.error(`error: ${args.changelog} does not exist`);
    process.exit(1);
  }
  const outDir = resolve(args.out);
  if (!existsSync(outDir)) {
    if (args.dryRun) {
      console.error(`error: ${args.out} does not exist`);
      process.exit(1);
    }
    mkdirSync(outDir, { recursive: true });
  }

  let releases = parseChangelog(readFileSync(source, "utf8"));
  if (releases.length === 0) {
    console.error(
      "error: no releases found. Expected headings like `## [1.7.0](url) (2026-07-27)`.",
    );
    process.exit(1);
  }

  const total = releases.length;
  if (args.since) releases = releases.filter((r) => r.date >= args.since);
  if (args.limit) releases = releases.slice(0, args.limit);

  const created = [];
  const updated = [];
  const unchanged = [];

  for (const release of releases) {
    const file = join(outDir, `${slugify(release.version)}.md`);
    const block = internalBlock(release.items);

    if (!existsSync(file)) {
      const frontmatter = [
        `version: ${yamlString(release.version)}`,
        `date: ${release.date}`,
        `draft: true`,
        "",
      ].join("\n");
      const content = `---\n${frontmatter}${block}---\n${NEW_BODY}`;
      if (!args.dryRun) writeFileSync(file, content);
      created.push(`${release.version} (${release.items.length} internal)`);
      continue;
    }

    const existing = readFileSync(file, "utf8");
    const m = existing.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n[\s\S]*)?$/);
    if (!m) {
      console.error(`  skipped ${file}: no frontmatter block found`);
      continue;
    }
    const next = `---\n${replaceInternal(m[1] + "\n", block)}---${m[2] ?? "\n"}`;
    if (next === existing) {
      unchanged.push(release.version);
      continue;
    }
    if (!args.dryRun) writeFileSync(file, next);
    updated.push(`${release.version} (${release.items.length} internal)`);
  }

  const verb = args.dryRun ? "would be" : "";
  console.log(`Parsed ${total} release(s) from ${args.changelog}.`);
  if (args.since || args.limit) console.log(`Selected ${releases.length} after filters.`);
  if (created.length) console.log(`\nCreated ${verb} (${created.length}):\n  ${created.join("\n  ")}`);
  if (updated.length)
    console.log(`\nInternal list refreshed ${verb} (${updated.length}):\n  ${updated.join("\n  ")}`);
  if (unchanged.length) console.log(`\nUnchanged (${unchanged.length}): ${unchanged.join(", ")}`);

  if (created.length) {
    console.log(
      `\n${created.length} new entr${created.length === 1 ? "y is" : "ies are"} draft: true with an empty body.`,
    );
    console.log("Write the user-visible changes, then flip draft to false.");
  }
  console.log("\nProse in existing entries was not modified.");
}

main();
