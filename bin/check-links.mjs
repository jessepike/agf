#!/usr/bin/env node
// bin/check-links.mjs — Check internal links in agf-docs MDX and TSX files
//
// Extracts /docs/... and /diagrams/... internal links from MDX + TSX.
// Resolves against route tree (meta.json + file paths) and agf-docs/public/.
// Optionally checks external links with --check-external.
//
// Exit non-zero on any broken internal link.
// Usage: node bin/check-links.mjs [--check-external]

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const AGFDOCS = join(REPO_ROOT, "agf-docs");
const CONTENT_DIR = join(AGFDOCS, "content/docs");
const APP_DIR = join(AGFDOCS, "app");
const PUBLIC_DIR = join(AGFDOCS, "public");

const args = process.argv.slice(2);
const CHECK_EXTERNAL = args.includes("--check-external");

if (args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: node bin/check-links.mjs [--check-external]

  --check-external    Also perform HEAD requests on external URLs
  --help              Show this message

Checks internal /docs/... and /diagrams/... links in all MDX + TSX files.
Exits non-zero if any broken internal link is found.
`);
  process.exit(0);
}

// --- Build route tree ---
function getAllFiles(dir, exts, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) getAllFiles(full, exts, results);
    else if (exts.some((e) => entry.endsWith(e))) results.push(full);
  }
  return results;
}

// Build set of valid doc routes from MDX file paths
function mdxPathToRoute(filePath) {
  // agf-docs/content/docs/reference/primitives.mdx → /docs/reference/primitives
  const rel = relative(CONTENT_DIR, filePath);
  const route = "/docs/" + rel.replace(/\.mdx?$/, "").replace(/\/index$/, "");
  return route;
}

const allMdxFiles = getAllFiles(CONTENT_DIR, [".mdx"]);
const validDocRoutes = new Set(allMdxFiles.map(mdxPathToRoute));

// Also add index routes from directories
function addIndexRoutes() {
  function walk(dir, prefix) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        validDocRoutes.add(`${prefix}/${entry}`);
        walk(full, `${prefix}/${entry}`);
      }
    }
  }
  walk(CONTENT_DIR, "/docs");
}
addIndexRoutes();

// Set of app-dir routes served by route.ts / page.tsx (e.g. /, /llms.txt).
// Includes homepage plus any app/<slug>/route.ts or app/<slug>/page.tsx.
const validAppRoutes = new Set(["/"]);
function collectAppRoutes(dir, prefix = "") {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      // Skip docs catch-all and dynamic segments
      if (entry === "docs" || entry.startsWith("[") || entry.startsWith("(")) continue;
      // If this dir contains route.ts or page.tsx, it's a route
      const hasRoute = ["route.ts", "route.js", "page.tsx", "page.ts", "page.js"].some((f) =>
        existsSync(join(full, f)),
      );
      if (hasRoute) {
        // Preserve file extension if it's a literal file route like /llms.txt
        const match = entry.match(/^(.+?)(\.txt|\.xml|\.json)$/);
        validAppRoutes.add(`${prefix}/${entry}`);
        if (match) validAppRoutes.add(`${prefix}/${match[1]}${match[2]}`);
      }
      collectAppRoutes(full, `${prefix}/${entry}`);
    }
  }
}
collectAppRoutes(APP_DIR);

// Build set of valid public assets
function getPublicAssets(dir, prefix = "", results = new Set()) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      getPublicAssets(full, `${prefix}/${entry}`, results);
    } else {
      results.add(`${prefix}/${entry}`);
    }
  }
  return results;
}
const publicAssets = getPublicAssets(PUBLIC_DIR, "");

// --- Extract links from files ---
function extractLinks(content, filePath) {
  const links = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Markdown links: [text](/path)
    const mdLinks = line.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g);
    for (const match of mdLinks) {
      const href = match[2].split("#")[0].split("?")[0].trim();
      if (href) links.push({ href, line: lineNum, context: "md-link" });
    }

    // JSX/TSX href attributes: href="/path" or href={"/path"}
    const jsxHrefs = line.matchAll(/href=["'{]([^"'}]+)["'}]/g);
    for (const match of jsxHrefs) {
      const href = match[1].split("#")[0].split("?")[0].trim();
      if (href) links.push({ href, line: lineNum, context: "jsx-href" });
    }

    // src attributes for images: src="/diagrams/..."
    const imgSrcs = line.matchAll(/src=["'{]([^"'}]+)["'}]/g);
    for (const match of imgSrcs) {
      const href = match[1].split("?")[0].trim();
      if (href.startsWith("/")) links.push({ href, line: lineNum, context: "img-src" });
    }
  }

  return links;
}

// --- Process files ---
const filesToCheck = [
  ...getAllFiles(CONTENT_DIR, [".mdx"]),
  ...getAllFiles(APP_DIR, [".tsx", ".ts"]).filter((f) => !f.includes("node_modules")),
];

let brokenInternalCount = 0;
let brokenExternalCount = 0;
const externalLinksFound = [];

console.log("=== AGF Link Checker ===");
console.log(`Checking ${filesToCheck.length} files...`);
console.log("");

for (const filePath of filesToCheck) {
  let content;
  try {
    content = readFileSync(filePath, "utf8");
  } catch {
    continue;
  }

  const links = extractLinks(content, filePath);
  const relPath = relative(REPO_ROOT, filePath);

  for (const { href, line, context } of links) {
    // Skip empty, hash-only, or JS expressions
    if (!href || href.startsWith("#") || href.startsWith("{") || href.startsWith("$")) continue;

    if (href.startsWith("http://") || href.startsWith("https://")) {
      if (CHECK_EXTERNAL) externalLinksFound.push({ href, filePath: relPath, line });
      continue;
    }

    // Internal links
    const normalized = href.replace(/\/$/, "") || "/";

    // Docs routes — includes /docs (index) and /docs/*
    if (normalized === "/docs" || normalized.startsWith("/docs/")) {
      if (!validDocRoutes.has(normalized)) {
        console.log(`  [BROKEN-DOC] ${relPath}:${line} → ${href}`);
        brokenInternalCount++;
      }
      continue;
    }

    // App-dir routes (/, /llms.txt, etc.)
    if (validAppRoutes.has(normalized)) {
      continue;
    }

    // Everything else (diagrams, public assets)
    if (href.startsWith("/diagrams/") || href.startsWith("/")) {
      const assetPath = href;
      if (!publicAssets.has(assetPath) && !publicAssets.has("/" + href.replace(/^\//, ""))) {
        const found = [...publicAssets].some(
          (a) => a === assetPath || a === "/" + assetPath || a.endsWith(assetPath)
        );
        if (!found) {
          console.log(`  [BROKEN-ASSET] ${relPath}:${line} → ${href}`);
          brokenInternalCount++;
        }
      }
    }
  }
}

// --- External link checks ---
if (CHECK_EXTERNAL && externalLinksFound.length > 0) {
  console.log(`\nChecking ${externalLinksFound.length} external links...`);
  // Deduplicate URLs
  const uniqueUrls = [...new Map(externalLinksFound.map((l) => [l.href, l])).values()];

  for (const { href, filePath, line } of uniqueUrls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(href, {
        method: "HEAD",
        signal: controller.signal,
        headers: { "User-Agent": "AGF-link-checker/0.2" },
        redirect: "follow",
      });
      clearTimeout(timeout);
      if (res.status >= 400) {
        console.log(`  [BROKEN-EXT] ${filePath}:${line} → ${href} (HTTP ${res.status})`);
        brokenExternalCount++;
      }
    } catch (e) {
      console.log(`  [TIMEOUT-EXT] ${filePath}:${line} → ${href} (${e.message})`);
      brokenExternalCount++;
    }
  }
}

console.log("");
console.log(`Internal broken links: ${brokenInternalCount}`);
if (CHECK_EXTERNAL) console.log(`External broken links: ${brokenExternalCount}`);
console.log("");

if (brokenInternalCount > 0) {
  console.log("=== Link Check FAILED ===");
  process.exit(1);
} else {
  console.log("=== Link Check PASSED ===");
  process.exit(0);
}
