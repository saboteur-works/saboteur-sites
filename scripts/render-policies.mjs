#!/usr/bin/env node
/**
 * render-policies.mjs
 *
 * Renders the shared policy bodies in compliance/ into a site's Astro pages.
 * Deterministic: same config + same template = byte-identical output, every time.
 * Zero dependencies — Node's stdlib only.
 *
 * The rendered pages are markdown with Astro frontmatter, so Astro does the
 * markdown-to-HTML work at build time and we never ship a markdown parser.
 *
 * Usage:
 *   node scripts/render-policies.mjs --config ./policy.config.json --out ./src/pages
 *   node scripts/render-policies.mjs --config ./policy.config.json --out ./src/pages --check
 *
 * --check re-renders and diffs against what is on disk without writing. Exits 1
 * if they differ, which is what CI wants: it proves the committed pages are
 * still what the config and templates produce.
 *
 * Template syntax (see compliance/policies/README.md):
 *   {{ TOKEN_NAME }}            -> tokens.token_name from the config
 *   {{#if feature}} … {{/if}}   -> features.feature is truthy
 *   {{#unless feature}} … {{/unless}}
 *   {{#each processors}} … {{/each}}  with {{ this.field }} inside
 *
 * Unknown tokens and unbalanced blocks are hard errors. A policy that renders
 * with a placeholder still in it is worse than one that fails to render.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..");

const DOCUMENTS = [
  {
    key: "privacy",
    source: "compliance/privacy-policy/body.md",
    outFile: "privacy.md",
  },
  {
    key: "terms",
    source: "compliance/terms-of-service/body.md",
    outFile: "terms.md",
  },
];

// ── Template engine ───────────────────────────────────────────────────────────

const TAG = /\{\{\s*(#if|#unless|#each|\/if|\/unless|\/each)?\s*([A-Za-z0-9_.]*)\s*\}\}/g;

/**
 * Parse a template into an AST. Blocks may nest; an unbalanced or mismatched
 * block throws rather than silently swallowing the rest of the document.
 */
/**
 * A block tag alone on its line should not leave a blank line behind when the
 * block is stripped — otherwise a conditional bullet turns its list into two
 * loose lists. Swallow the newline that follows a standalone block tag.
 */
function stripStandaloneTagLines(template) {
  return template.replace(/^[ \t]*(\{\{[#/](?:if|unless|each)[^}]*\}\})[ \t]*\r?\n/gm, "$1");
}

function parse(rawTemplate, source) {
  const template = stripStandaloneTagLines(rawTemplate);
  TAG.lastIndex = 0;
  const root = { type: "root", body: [] };
  const stack = [root];
  let cursor = 0;
  let match;

  const top = () => stack[stack.length - 1];
  const lineAt = (index) => template.slice(0, index).split("\n").length;

  while ((match = TAG.exec(template)) !== null) {
    const [raw, keyword, name] = match;

    if (match.index > cursor) {
      top().body.push({ type: "text", value: template.slice(cursor, match.index) });
    }
    cursor = match.index + raw.length;

    if (!keyword) {
      if (!name) throw new Error(`${source}:${lineAt(match.index)}: empty tag ${raw}`);
      top().body.push({ type: "var", name });
      continue;
    }

    if (keyword.startsWith("#")) {
      const node = { type: keyword.slice(1), name, body: [], line: lineAt(match.index) };
      if (!name) throw new Error(`${source}:${node.line}: ${raw} is missing a name`);
      top().body.push(node);
      stack.push(node);
      continue;
    }

    // Closing tag.
    const expected = keyword.slice(1);
    const open = top();
    if (open.type !== expected) {
      throw new Error(
        `${source}:${lineAt(match.index)}: found ${raw} but the open block is ` +
          (open.type === "root" ? "nothing" : `{{#${open.type} ${open.name}}} from line ${open.line}`)
      );
    }
    stack.pop();
  }

  if (cursor < template.length) {
    top().body.push({ type: "text", value: template.slice(cursor) });
  }

  if (stack.length > 1) {
    const open = top();
    throw new Error(`${source}:${open.line}: {{#${open.type} ${open.name}}} is never closed`);
  }

  return root;
}

/** Render an AST against a config, collecting every unresolvable reference. */
function render(node, ctx, errors, scope = null) {
  switch (node.type) {
    case "root":
    case "if":
    case "unless":
    case "each":
      return node.body.map((child) => render(child, ctx, errors, scope)).join("");
    case "text":
      return node.value;
    case "var":
      return resolveVar(node.name, ctx, errors, scope);
    default:
      throw new Error(`unknown node type ${node.type}`);
  }
}

function resolveVar(name, ctx, errors, scope) {
  if (name.startsWith("this.")) {
    const field = name.slice("this.".length);
    if (!scope || !(field in scope)) {
      errors.push(`{{ ${name} }} — no such field on the current item`);
      return "";
    }
    return String(scope[field]);
  }
  const key = name.toLowerCase();
  if (!(key in ctx.tokens)) {
    errors.push(`{{ ${name} }} — no "${key}" in the config's tokens`);
    return "";
  }
  const value = ctx.tokens[key];
  if (value === "" || value === null || value === undefined) {
    errors.push(`{{ ${name} }} — tokens.${key} is empty`);
    return "";
  }
  return String(value);
}

/**
 * Walk the tree resolving blocks before variables, so a token referenced only
 * inside a disabled block is never required. `scope` is the current {{#each}}
 * item, threaded through nested blocks.
 */
function evaluateScoped(node, ctx, errors, scope = null) {
  const out = [];
  for (const child of node.body) {
    if (child.type === "if" || child.type === "unless") {
      if (!(child.name in ctx.features)) {
        errors.push(`{{#${child.type} ${child.name}}} — no "${child.name}" in the config's features`);
        continue;
      }
      const on = Boolean(ctx.features[child.name]);
      if (child.type === "if" ? on : !on) out.push(evaluateScoped(child, ctx, errors, scope));
    } else if (child.type === "each") {
      const items = ctx.lists[child.name];
      if (!Array.isArray(items)) {
        errors.push(`{{#each ${child.name}}} — no "${child.name}" array in the config`);
        continue;
      }
      for (const item of items) out.push(evaluateScoped(child, ctx, errors, item));
    } else {
      out.push(render(child, ctx, errors, scope));
    }
  }
  return out.join("");
}

/** Normalise whitespace left behind by stripped block tags. */
function tidy(text) {
  return text.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

// ── Frontmatter ───────────────────────────────────────────────────────────────

/** Escape a value for a double-quoted YAML scalar. */
function yamlString(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function frontmatter(doc, config) {
  const page = config.pages?.[doc.key] ?? {};
  const layout = config.layout ?? "../layouts/Legal.astro";
  const lines = [
    "---",
    `layout: ${yamlString(layout)}`,
    `title: ${yamlString(page.title ?? defaultTitle(doc.key, config))}`,
    `description: ${yamlString(page.description ?? defaultDescription(doc.key, config))}`,
    `lastUpdated: ${yamlString(config.tokens.last_updated)}`,
    "---",
    "",
    "<!-- GENERATED by saboteur-sites/scripts/render-policies.mjs — do not edit by hand.",
    `     Source: ${doc.source} · Config: policy.config.json`,
    "     Change the config or the shared template, then re-render. -->",
    "",
    "",
  ];
  return lines.join("\n");
}

function defaultTitle(key, config) {
  const name = config.tokens.site_name;
  return key === "privacy" ? `Privacy policy — ${name}` : `Terms of service — ${name}`;
}

function defaultDescription(key, config) {
  const name = config.tokens.site_name;
  return key === "privacy"
    ? `How ${name} handles personal data. Cookieless by default; no tracking, no consent banner.`
    : `The terms governing use of ${name}, operated by Saboteur LLC.`;
}

// ── Validation ────────────────────────────────────────────────────────────────

const REQUIRED_TOKENS = ["last_updated", "site_name", "site_domain", "contact_email"];
const LEAK_PATTERNS = [
  [/\{\{/, "an unrendered {{ token }}"],
  [/\[CONDITIONAL/i, "a leftover [CONDITIONAL] marker"],
  [/\[END CONDITIONAL\]/i, "a leftover [END CONDITIONAL] marker"],
  [/\bTODO\b/, "a TODO placeholder"],
  [/\bFIXME\b/, "a FIXME placeholder"],
  [/FILL ME IN/i, "a FILL ME IN placeholder"],
  [/\bTBD\b/, "a TBD placeholder"],
  [/\bLorem ipsum\b/i, "placeholder prose"],
  [/\{\{\s*TOKEN/i, "a template token"],
];

function validateConfig(config, path) {
  const problems = [];
  if (!config.tokens || typeof config.tokens !== "object") {
    problems.push("missing a `tokens` object");
  } else {
    for (const key of REQUIRED_TOKENS) {
      if (!config.tokens[key]) problems.push(`tokens.${key} is missing or empty`);
    }
    const date = config.tokens.last_updated;
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      problems.push(`tokens.last_updated must be an ISO date (YYYY-MM-DD), got "${date}"`);
    }
  }
  if (!config.features || typeof config.features !== "object") {
    problems.push("missing a `features` object");
  }
  if (!Array.isArray(config.processors) || config.processors.length === 0) {
    problems.push("`processors` must be a non-empty array — every site has at least a host");
  } else {
    config.processors.forEach((p, i) => {
      for (const field of ["name", "purpose", "location"]) {
        if (!p[field]) problems.push(`processors[${i}].${field} is missing`);
      }
    });
  }
  if (problems.length) {
    throw new Error(`${path} is not a valid policy config:\n  - ${problems.join("\n  - ")}`);
  }
}

/** Catch anything that should never reach a published page. */
function validateOutput(text, label) {
  for (const [pattern, description] of LEAK_PATTERNS) {
    const found = text.match(pattern);
    if (found) {
      const line = text.slice(0, found.index).split("\n").length;
      throw new Error(`${label}:${line}: rendered output still contains ${description}`);
    }
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { check: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--check") args.check = true;
    else if (arg === "--config") args.config = argv[++i];
    else if (arg === "--out") args.out = argv[++i];
    else if (arg === "--templates") args.templates = argv[++i];
    else if (arg === "--only") args.only = argv[++i];
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

const USAGE = `Usage:
  node render-policies.mjs --config <policy.config.json> --out <src/pages dir> [--check]

Options:
  --config     Path to the site's policy.config.json.
  --out        Directory to write privacy.md and terms.md into (usually src/pages).
  --templates  Root of the saboteur-sites repo. Defaults to this script's repo.
  --only       Render one document only: "privacy" or "terms". Useful when a
               site can publish its privacy policy before its terms have a
               governing jurisdiction and mailing address to name.
  --check      Re-render and diff against disk. Writes nothing; exits 1 on drift.
`;

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`error: ${error.message}\n\n${USAGE}`);
    process.exit(2);
  }

  if (args.help || !args.config || !args.out) {
    console.log(USAGE);
    process.exit(args.help ? 0 : 2);
  }

  const configPath = resolve(args.config);
  const outDir = resolve(args.out);
  const templateRoot = args.templates ? resolve(args.templates) : REPO_ROOT;

  let config;
  try {
    config = JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    console.error(`error: could not read ${configPath}: ${error.message}`);
    process.exit(1);
  }

  try {
    validateConfig(config, configPath);
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exit(1);
  }

  const ctx = {
    tokens: config.tokens,
    features: config.features,
    lists: { processors: config.processors, ...(config.lists ?? {}) },
  };

  if (args.only && !DOCUMENTS.some((d) => d.key === args.only)) {
    console.error(`error: --only takes ${DOCUMENTS.map((d) => `"${d.key}"`).join(" or ")}, got "${args.only}"`);
    process.exit(2);
  }

  const selected = args.only ? DOCUMENTS.filter((d) => d.key === args.only) : DOCUMENTS;

  let drifted = false;

  for (const doc of selected) {
    const sourcePath = join(templateRoot, doc.source);
    if (!existsSync(sourcePath)) {
      console.error(`error: template not found: ${sourcePath}`);
      process.exit(1);
    }

    const template = readFileSync(sourcePath, "utf8");
    const errors = [];
    let body;
    try {
      body = tidy(evaluateScoped(parse(template, doc.source), ctx, errors));
    } catch (error) {
      console.error(`error: ${error.message}`);
      process.exit(1);
    }

    if (errors.length) {
      console.error(`error: ${doc.source} could not be rendered from ${configPath}:`);
      for (const problem of [...new Set(errors)]) console.error(`  - ${problem}`);
      process.exit(1);
    }

    const output = frontmatter(doc, config) + body;

    try {
      validateOutput(output, doc.outFile);
    } catch (error) {
      console.error(`error: ${error.message}`);
      process.exit(1);
    }

    const target = join(outDir, doc.outFile);

    if (args.check) {
      const current = existsSync(target) ? readFileSync(target, "utf8") : null;
      if (current === null) {
        console.error(`drift: ${target} does not exist — run without --check to create it`);
        drifted = true;
      } else if (current !== output) {
        console.error(`drift: ${target} differs from what the template and config produce`);
        drifted = true;
      } else {
        console.log(`ok: ${doc.outFile} is up to date`);
      }
      continue;
    }

    mkdirSync(outDir, { recursive: true });
    writeFileSync(target, output, "utf8");
    console.log(`wrote ${target}`);
  }

  if (drifted) {
    console.error("\nRe-run without --check to regenerate, then commit the result.");
    process.exit(1);
  }
}

main();
