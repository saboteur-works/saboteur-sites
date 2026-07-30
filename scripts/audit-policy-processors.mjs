#!/usr/bin/env node
/**
 * audit-policy-processors.mjs
 *
 * Answers the two questions in compliance/privacy-policy/checklist.md that are
 * tedious to answer by hand and easy to get wrong:
 *
 *   1. Does the site talk to any third party the privacy policy doesn't name?
 *   2. Does the policy name a processor the site doesn't actually use?
 *
 * A privacy policy is a factual claim about a build. This checks the claim
 * against the build. Point it at a built site (dist/) and its policy config.
 *
 * Usage:
 *   node scripts/audit-policy-processors.mjs --config ./policy.config.json --dist ./dist
 *   node scripts/audit-policy-processors.mjs --config ./policy.config.json --dist ./dist --src ./src
 *
 * Exits 1 if the policy and the build disagree.
 *
 * This is a static scan of emitted HTML/CSS/JS. It catches hardcoded
 * third-party URLs, which is how a cookieless static site would acquire one.
 * It cannot see a URL assembled at runtime from string fragments — the
 * keyboard-and-DevTools check in checklist.md is still the backstop.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, extname } from "node:path";

const SCANNABLE = new Set([".html", ".js", ".mjs", ".css", ".json", ".xml", ".svg", ".astro", ".ts"]);

// Hosts that are never a third-party disclosure problem.
const NEVER_A_PROCESSOR = new Set([
  "localhost",
  "127.0.0.1",
  "example.com",
  "www.example.com",
  "schema.org",
  "www.schema.org", // JSON-LD @context — a vocabulary URL, never fetched by the browser
  "www.w3.org", // SVG/XML namespaces
  "purl.org",
  "ogp.me", // Open Graph namespace
  "creativecommons.org",
]);

const URL_PATTERN = /https?:\/\/([a-z0-9.-]+\.[a-z]{2,})(?![a-z])/gi;

/**
 * Remove text that contains URLs which are never fetched: licence banners in
 * minified CSS/JS, HTML comments, and XML namespace declarations. Without this
 * the scan reports Tailwind's banner and the sitemap's schema URIs as
 * undisclosed processors, and the noise trains you to ignore the tool.
 *
 * Deliberately does not strip `//` line comments — `https://` would be mangled.
 */
function stripNonRequests(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, " ") // CSS/JS block comments
    .replace(/<!--[\s\S]*?-->/g, " ") // HTML/XML comments
    .replace(/xmlns(:[a-z0-9-]+)?\s*=\s*["'][^"']*["']/gi, " ") // XML namespaces
    .replace(/\bschemaLocation\s*=\s*["'][^"']*["']/gi, " ");
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (SCANNABLE.has(extname(entry))) files.push(full);
  }
  return files;
}

/** Every external host referenced by the built output, with where it was found. */
function collectHosts(roots) {
  const found = new Map();
  for (const root of roots) {
    for (const file of walk(root)) {
      const text = stripNonRequests(readFileSync(file, "utf8"));
      let match;
      URL_PATTERN.lastIndex = 0;
      while ((match = URL_PATTERN.exec(text)) !== null) {
        const host = match[1].toLowerCase().replace(/\.$/, "");
        if (NEVER_A_PROCESSOR.has(host)) continue;
        if (!found.has(host)) found.set(host, new Set());
        found.get(host).add(file);
      }
    }
  }
  return found;
}

/** A host is covered if it equals, or is a subdomain of, a declared host. */
function isCovered(host, declared) {
  return declared.some((d) => host === d || host.endsWith(`.${d}`));
}

function parseArgs(argv) {
  const args = { src: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--config") args.config = argv[++i];
    else if (arg === "--dist") args.dist = argv[++i];
    else if (arg === "--src") args.src = argv[++i];
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

const USAGE = `Usage:
  node audit-policy-processors.mjs --config <policy.config.json> --dist <build dir> [--src <src dir>]

Compares the third-party hosts referenced by a built site against the processors
declared in its policy config. Exits 1 if they disagree.
`;

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`error: ${error.message}\n\n${USAGE}`);
    process.exit(2);
  }

  if (args.help || !args.config || !args.dist) {
    console.log(USAGE);
    process.exit(args.help ? 0 : 2);
  }

  const configPath = resolve(args.config);
  const roots = [resolve(args.dist), ...(args.src ? [resolve(args.src)] : [])];

  for (const root of roots) {
    if (!existsSync(root)) {
      console.error(`error: ${root} does not exist — build the site first`);
      process.exit(1);
    }
  }

  let config;
  try {
    config = JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    console.error(`error: could not read ${configPath}: ${error.message}`);
    process.exit(1);
  }

  const processors = config.processors ?? [];
  const siteDomain = config.tokens?.site_domain;

  // Hosts we expect to see and that need no disclosure: our own domain, plus
  // anything explicitly allowlisted (a link to a doc is not a data transfer).
  const benign = [
    ...(siteDomain ? [siteDomain] : []),
    ...(config.allowedHosts ?? []),
  ].map((h) => h.toLowerCase());

  const declared = processors.flatMap((p) => (p.hosts ?? []).map((h) => h.toLowerCase()));
  const observed = collectHosts(roots);

  const undeclared = [];
  for (const [host, files] of observed) {
    if (isCovered(host, benign)) continue;
    if (isCovered(host, declared)) continue;
    undeclared.push([host, [...files]]);
  }

  // A processor with declared hosts that appear nowhere is either unused or
  // renamed. Processors with no hosts at all (a bare backend) are not checked.
  const unused = processors.filter((p) => {
    const hosts = (p.hosts ?? []).map((h) => h.toLowerCase());
    if (hosts.length === 0) return false;
    return !hosts.some((h) => [...observed.keys()].some((o) => o === h || o.endsWith(`.${h}`)));
  });

  let failed = false;

  if (undeclared.length) {
    failed = true;
    console.error("UNDECLARED third parties — the site references these, the policy does not name them:\n");
    for (const [host, files] of undeclared.sort()) {
      console.error(`  ${host}`);
      for (const file of files.slice(0, 4)) console.error(`      ${file}`);
      if (files.length > 4) console.error(`      … and ${files.length - 4} more`);
    }
    console.error(
      "\nEither remove the reference, add the host to `allowedHosts` if it transfers no\n" +
        "personal data (an outbound link a user must click), or add the processor to the\n" +
        "policy config and re-render.\n"
    );
  }

  if (unused.length) {
    failed = true;
    console.error("OVER-DECLARED processors — the policy names these, the build never contacts them:\n");
    for (const p of unused) console.error(`  ${p.name} (declared hosts: ${p.hosts.join(", ")})`);
    console.error("\nNaming a processor you don't use is still an inaccurate policy. Remove it or fix the hosts.\n");
  }

  if (!failed) {
    const names = processors.map((p) => p.name).join(", ");
    console.log(`ok: every third-party host in the build is a declared processor (${names || "none"}).`);
    console.log(`     ${observed.size} external host(s) seen, all accounted for.`);
  }

  process.exit(failed ? 1 : 0);
}

main();
