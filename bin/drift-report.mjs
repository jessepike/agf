#!/usr/bin/env node
// bin/drift-report.mjs — Diff canonical docs/ against agf-docs/content/docs/**/*.mdx
//
// Reports: word count ratio, missing sections, changelist skeleton based on git diff.
// Output: human-readable summary + JSON to stdout.
// Exit 0 always (advisory tool).
//
// Usage: node bin/drift-report.mjs [--json] [--since <git-ref>]

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, basename, dirname, relative } from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DOCS_DIR = join(REPO_ROOT, "docs");
const SITE_DIR = join(REPO_ROOT, "agf-docs/content/docs");

// Parse flags
const args = process.argv.slice(2);
const JSON_MODE = args.includes("--json");
const sinceIdx = args.indexOf("--since");
const SINCE_REF = sinceIdx !== -1 ? args[sinceIdx + 1] : null;

if (args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: node bin/drift-report.mjs [--json] [--since <git-ref>]

  --json             Output raw JSON only (machine-readable)
  --since <ref>      Also report canonical files changed since this git ref/tag
  --help             Show this message

Advisory tool — always exits 0. Summarizes drift between docs/*.md and MDX renders.
`);
  process.exit(0);
}

// --- Canonical → MDX mapping heuristic ---
// We try basename match first, then frontmatter title match, then fuzzy slug match.

function getAllFiles(dir, ext, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) getAllFiles(full, ext, results);
    else if (entry.endsWith(ext)) results.push(full);
  }
  return results;
}

const KNOWN_MAPPINGS = {
  "agentic-primitives.md": "reference/primitives.mdx",
  "shared-vocabulary.md": "resources/vocabulary.mdx",
  "agf-reference-architecture.md": "reference/governance-framework.mdx",
  "agentic-governance-framework.md": "overview/what-is-agf.mdx",
  "decision-intelligence.md": "reference/decision-intelligence.mdx",
  "agentic-observability.md": "reference/observability-concept.mdx",
  "governance-decision-record.md": "reference/governance-decision-record.mdx",
  "relationship-to-frameworks.md": "reference/relationship-to-frameworks.mdx",
  "cross-concept-relationship.md": "resources/relationship-model.mdx",
  // Profiles
  "profiles/security-profile.md": "profiles/security.mdx",
  "profiles/grc-profile.md": "profiles/grc.mdx",
  "profiles/platform-profile.md": "profiles/platform.mdx",
  "profiles/compliance-profile.md": "profiles/ai-engineering.mdx",
  "profiles/ai-engineering-profile.md": "profiles/ai-engineering.mdx",
};

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function extractSections(content) {
  const lines = content.split("\n");
  return lines
    .filter((l) => l.startsWith("#"))
    .map((l) => l.replace(/^#+\s*/, "").trim());
}

function wordCount(content) {
  return content.split(/\s+/).filter(Boolean).length;
}

function findMdxForCanonical(canonicalRelPath) {
  // 1. Check known mappings
  const mapped = KNOWN_MAPPINGS[canonicalRelPath];
  if (mapped) {
    const full = join(SITE_DIR, mapped);
    if (existsSync(full)) return full;
  }

  // 2. Try slug-based search
  const slug = slugify(basename(canonicalRelPath, ".md"));
  const allMdx = getAllFiles(SITE_DIR, ".mdx");
  for (const mdx of allMdx) {
    const mdxSlug = slugify(basename(mdx, ".mdx"));
    if (mdxSlug === slug || mdxSlug.includes(slug) || slug.includes(mdxSlug)) {
      return mdx;
    }
  }

  return null;
}

// --- Gather canonical docs ---
const canonicalFiles = [];
for (const entry of readdirSync(DOCS_DIR)) {
  const full = join(DOCS_DIR, entry);
  if (entry.endsWith(".md") && statSync(full).isFile()) {
    canonicalFiles.push({ rel: entry, full });
  }
}
// Profiles subdirectory
const profilesDir = join(DOCS_DIR, "profiles");
if (existsSync(profilesDir)) {
  for (const entry of readdirSync(profilesDir)) {
    if (entry.endsWith(".md")) {
      canonicalFiles.push({
        rel: `profiles/${entry}`,
        full: join(profilesDir, entry),
      });
    }
  }
}

// --- Build drift report ---
const driftResults = [];
const unmappedCanonical = [];
const allMdxFiles = getAllFiles(SITE_DIR, ".mdx");
const mappedMdxPaths = new Set();

for (const { rel, full } of canonicalFiles) {
  const canonicalContent = readFileSync(full, "utf8");
  const canonicalSections = extractSections(canonicalContent);
  const canonicalWC = wordCount(canonicalContent);

  const mdxPath = findMdxForCanonical(rel);

  if (!mdxPath) {
    unmappedCanonical.push(rel);
    driftResults.push({
      canonical: rel,
      mdx: null,
      status: "no-mdx-counterpart",
      canonicalWordCount: canonicalWC,
    });
    continue;
  }

  mappedMdxPaths.add(mdxPath);

  const mdxContent = readFileSync(mdxPath, "utf8");
  const mdxSections = extractSections(mdxContent);
  const mdxWC = wordCount(mdxContent);

  const missingSections = canonicalSections.filter(
    (s) => !mdxSections.some((ms) => ms.toLowerCase() === s.toLowerCase())
  );
  const extraSections = mdxSections.filter(
    (s) => !canonicalSections.some((cs) => cs.toLowerCase() === s.toLowerCase())
  );

  const wcRatio = mdxWC > 0 ? Math.round((mdxWC / canonicalWC) * 100) / 100 : 0;

  driftResults.push({
    canonical: rel,
    mdx: relative(REPO_ROOT, mdxPath),
    status: missingSections.length > 0 || wcRatio < 0.5 ? "drift-detected" : "ok",
    canonicalWordCount: canonicalWC,
    mdxWordCount: mdxWC,
    wordCountRatio: wcRatio,
    sectionsInCanonicalNotInMdx: missingSections,
    sectionsInMdxNotInCanonical: extraSections,
  });
}

// MDX files with no canonical counterpart
const orphanMdx = allMdxFiles
  .filter((f) => !mappedMdxPaths.has(f))
  .map((f) => relative(REPO_ROOT, f));

// --- Changelist skeleton from git diff ---
let changelistSkeleton = [];
if (SINCE_REF) {
  try {
    // Use execFileSync with array args to avoid shell injection
    const changed = execFileSync("git", [
      "-C", REPO_ROOT,
      "diff", "--name-only",
      SINCE_REF, "HEAD",
      "--", "docs/",
    ], { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);

    changelistSkeleton = changed.map((f) => {
      const rel = f.replace(/^docs\//, "");
      const mdxPath = findMdxForCanonical(rel);
      return {
        changedCanonical: f,
        linkedMdx: mdxPath ? relative(REPO_ROOT, mdxPath) : null,
        action: mdxPath ? "sync-required" : "mdx-needed",
      };
    });
  } catch (e) {
    changelistSkeleton = [{ error: `git diff failed: ${e.message}` }];
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalCanonical: canonicalFiles.length,
    mappedToMdx: driftResults.filter((r) => r.mdx).length,
    driftDetected: driftResults.filter((r) => r.status === "drift-detected").length,
    noMdxCounterpart: unmappedCanonical.length,
    orphanMdxFiles: orphanMdx.length,
  },
  files: driftResults,
  orphanMdx,
  changelistSkeleton,
};

if (JSON_MODE) {
  console.log(JSON.stringify(report, null, 2));
} else {
  // Human-readable summary
  console.log("=== AGF Drift Report ===");
  console.log(`Generated: ${report.generatedAt}`);
  console.log("");
  console.log("Summary:");
  console.log(`  Canonical docs:     ${report.summary.totalCanonical}`);
  console.log(`  Mapped to MDX:      ${report.summary.mappedToMdx}`);
  console.log(`  Drift detected:     ${report.summary.driftDetected}`);
  console.log(`  No MDX counterpart: ${report.summary.noMdxCounterpart}`);
  console.log(`  Orphan MDX files:   ${report.summary.orphanMdxFiles}`);
  console.log("");

  const drifted = driftResults.filter((r) => r.status === "drift-detected");
  if (drifted.length > 0) {
    console.log("Files with drift:");
    for (const f of drifted) {
      console.log(`  [DRIFT] ${f.canonical} → ${f.mdx}`);
      console.log(`          WC ratio: ${f.wordCountRatio} (canonical: ${f.canonicalWordCount}, mdx: ${f.mdxWordCount})`);
      if (f.sectionsInCanonicalNotInMdx?.length > 0) {
        console.log(`          Missing from MDX: ${f.sectionsInCanonicalNotInMdx.join(", ")}`);
      }
    }
    console.log("");
  }

  const noMdx = driftResults.filter((r) => r.status === "no-mdx-counterpart");
  if (noMdx.length > 0) {
    console.log("Canonical docs with no MDX counterpart:");
    for (const f of noMdx) console.log(`  [UNMAPPED] ${f.canonical}`);
    console.log("");
  }

  if (orphanMdx.length > 0) {
    console.log("Orphan MDX files (no canonical doc):");
    for (const f of orphanMdx) console.log(`  [ORPHAN] ${f}`);
    console.log("");
  }

  if (changelistSkeleton.length > 0) {
    console.log(`Changelist skeleton (since ${SINCE_REF}):`);
    for (const c of changelistSkeleton) {
      const action = c.action === "sync-required" ? "[SYNC]" : "[NEW MDX NEEDED]";
      console.log(`  ${action} ${c.changedCanonical} → ${c.linkedMdx || "(no counterpart)"}`);
    }
    console.log("");
  }

  console.log("=== End of Drift Report ===");
}
