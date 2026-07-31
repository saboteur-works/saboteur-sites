#!/usr/bin/env node
/**
 * check-drafts.mjs
 *
 * Answers one question that is easy to get wrong and expensive to get wrong:
 *
 *   Did a post marked `draft: true` reach the build?
 *
 * A draft is unfinished writing, or writing that was deliberately pulled. The
 * page filters drafts out of `astro build`, so in the normal case this finds
 * nothing. It exists for the abnormal cases, which are real:
 *
 *   - A stale dist/ from a build made before the post was marked draft. The
 *     most common one, and invisible without a clean rebuild.
 *   - The draft filter removed from a getCollection call to "preview" a post.
 *   - A post retracted by setting draft: true, on a host still serving the
 *     previously-built output.
 *
 * Usage:
 *   node scripts/check-drafts.mjs --content ./src/content --dist ./dist
 *
 * Exits 1 if any draft slug appears in the build.
 *
 * Slug-based by design: it looks for the draft's filename in emitted paths and
 * in the sitemap and feed, which is what a leaked post actually looks like. It
 * does not parse HTML, so a draft whose slug never appears as a path or a URL
 * would evade it — that case is covered by the surface being rebuilt clean.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve, basename, relative } from "node:path";

const USAGE = `Usage: check-drafts.mjs --content <dir> --dist <dir>

  --content   content collections root (default: ./src/content)
  --dist      built site (default: ./dist)
  --help`;

function parseArgs(argv) {
  const args = { content: "./src/content", dist: "./dist", help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--content") args.content = argv[++i];
    else if (a === "--dist") args.dist = argv[++i];
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.content || !args.dist) throw new Error("missing value for an argument");
  return args;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** Frontmatter is the block between the first two `---` fences. */
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : "";
}

function isDraft(text) {
  return /^\s*draft:\s*true\s*$/m.test(frontmatter(text));
}

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

  const contentRoot = resolve(args.content);
  const distRoot = resolve(args.dist);

  // No content collections means no surface means nothing to check. Not an
  // error: most Saboteur sites have no blog.
  if (!existsSync(contentRoot)) {
    console.log(`No content collections at ${args.content} — nothing to check.`);
    process.exit(0);
  }
  if (!existsSync(distRoot)) {
    console.error(`error: ${args.dist} does not exist — build the site first`);
    process.exit(1);
  }

  // Underscore-prefixed files are excluded by the glob loader, so the
  // _TEMPLATE.md files are not drafts in any meaningful sense.
  const drafts = walk(contentRoot)
    .filter((f) => f.endsWith(".md") && !basename(f).startsWith("_"))
    .filter((f) => isDraft(readFileSync(f, "utf8")))
    .map((f) => ({ slug: basename(f, ".md"), file: relative(process.cwd(), f) }));

  if (drafts.length === 0) {
    console.log("No drafts in the content collections.");
    process.exit(0);
  }

  const distFiles = walk(distRoot);
  const textFiles = distFiles.filter((f) => /\.(html|xml|json|txt)$/.test(f));
  const leaks = [];

  for (const draft of drafts) {
    const hits = new Set();

    // A leaked post's slug shows up as an emitted path: dist/blog/<slug>/…
    for (const f of distFiles) {
      if (relative(distRoot, f).split("/").includes(draft.slug)) hits.add(relative(distRoot, f));
    }
    // …and as a URL inside the sitemap, the feed, or a listing page.
    for (const f of textFiles) {
      if (readFileSync(f, "utf8").includes(draft.slug)) hits.add(relative(distRoot, f));
    }

    if (hits.size > 0) leaks.push({ ...draft, hits: [...hits] });
  }

  if (leaks.length === 0) {
    console.log(
      `${drafts.length} draft${drafts.length === 1 ? "" : "s"} found in content, none present in ${args.dist}.`,
    );
    process.exit(0);
  }

  console.error("DRAFTS PRESENT IN THE BUILD — these are publicly readable:\n");
  for (const leak of leaks) {
    console.error(`  ${leak.slug}  (${leak.file})`);
    for (const hit of leak.hits.slice(0, 5)) console.error(`      ${hit}`);
    if (leak.hits.length > 5) console.error(`      … and ${leak.hits.length - 5} more`);
  }
  console.error(
    "\nUsually a stale dist/ from a build made before the post was marked draft.",
  );
  console.error("Rebuild clean (rm -rf dist && npm run build) and re-run.");
  console.error(
    "If it survives a clean build, the draft filter is missing from a getCollection call.\n",
  );
  process.exit(1);
}

main();
