#!/usr/bin/env node
// bin/smoke-deployed.mjs — Post-deploy smoke test for agf.jessepike.dev
//
// Hits the live site and checks HTTP 200, correct content-type, minimum body size.
// Optionally polls until a new build is live (--wait-for-deploy).
// Logs results to .status/releases/<timestamp>/smoke.json.
//
// Usage: node bin/smoke-deployed.mjs [--base-url <url>] [--wait-for-deploy <seconds>]

import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: node bin/smoke-deployed.mjs [--base-url <url>] [--wait-for-deploy <seconds>]

  --base-url <url>             Base URL to test (default: https://agf.jessepike.dev)
  --wait-for-deploy <seconds>  Poll until new build is live, up to this many seconds
  --help                       Show this message

Results logged to .status/releases/<timestamp>/smoke.json.
`);
  process.exit(0);
}

const baseUrlIdx = args.indexOf("--base-url");
const BASE_URL = baseUrlIdx !== -1 ? args[baseUrlIdx + 1] : "https://agf.jessepike.dev";

const waitIdx = args.indexOf("--wait-for-deploy");
const WAIT_SECS = waitIdx !== -1 ? parseInt(args[waitIdx + 1], 10) : 0;

const MIN_BODY_SIZE = 500; // bytes — catch accidentally-empty renders

// --- Build route list from MDX files ---
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

const CONTENT_DIR = join(REPO_ROOT, "agf-docs/content/docs");
const PUBLIC_DIAGRAMS = join(REPO_ROOT, "agf-docs/public/diagrams");

function mdxToRoute(filePath) {
  const path = filePath.replace(CONTENT_DIR, "").replace(/\.mdx?$/, "").replace(/\/index$/, "");
  return `/docs${path}`;
}

const docRoutes = getAllFiles(CONTENT_DIR, [".mdx"]).map(mdxToRoute);

// Diagram assets
const diagramAssets = existsSync(PUBLIC_DIAGRAMS)
  ? readdirSync(PUBLIC_DIAGRAMS)
      .filter((f) => f.endsWith(".png"))
      .map((f) => `/diagrams/${f}`)
  : [];

const allRoutes = ["/", ...docRoutes];
const allAssets = diagramAssets;

// --- Wait for deploy ---
async function waitForDeploy(timeoutSecs) {
  console.log(`Waiting up to ${timeoutSecs}s for new deploy to be live...`);
  const deadline = Date.now() + timeoutSecs * 1000;
  let attempt = 0;
  while (Date.now() < deadline) {
    attempt++;
    try {
      const res = await fetch(BASE_URL, {
        headers: { "User-Agent": "AGF-smoke/0.2" },
      });
      if (res.ok) {
        console.log(`  Deploy detected (attempt ${attempt}) — proceeding.`);
        return true;
      }
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  console.log("  Timed out waiting for deploy.");
  return false;
}

// --- Smoke test a single URL ---
async function checkUrl(url, isAsset = false) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "AGF-smoke/0.2" },
    });
    clearTimeout(timeout);

    const body = await res.text();
    const contentType = res.headers.get("content-type") || "";

    const status = res.status;
    const ok200 = status === 200;
    const okContentType = isAsset
      ? contentType.includes("image/")
      : contentType.includes("text/html") || contentType.includes("application/");
    const okSize = body.length >= MIN_BODY_SIZE;

    const pass = ok200 && okSize;

    return {
      url,
      status,
      contentType,
      bodySize: body.length,
      pass,
      issues: [
        !ok200 ? `HTTP ${status}` : null,
        !okContentType ? `unexpected content-type: ${contentType}` : null,
        !okSize ? `body too small (${body.length} bytes)` : null,
      ].filter(Boolean),
    };
  } catch (e) {
    return {
      url,
      status: 0,
      contentType: null,
      bodySize: 0,
      pass: false,
      issues: [`request failed: ${e.message}`],
    };
  }
}

// --- Main ---
async function main() {
  console.log("=== AGF Smoke Test ===");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Routes: ${allRoutes.length}, Assets: ${allAssets.length}`);
  console.log("");

  if (WAIT_SECS > 0) {
    const ready = await waitForDeploy(WAIT_SECS);
    if (!ready) {
      console.error("Deploy did not come up in time. Aborting smoke test.");
      process.exit(1);
    }
    console.log("");
  }

  const results = [];
  let passed = 0;
  let failed = 0;

  // Check routes
  for (const route of allRoutes) {
    const url = `${BASE_URL}${route}`;
    const result = await checkUrl(url, false);
    results.push({ type: "route", ...result });
    if (result.pass) {
      passed++;
    } else {
      failed++;
      console.log(`  [FAIL] ${url}`);
      for (const issue of result.issues) console.log(`         ${issue}`);
    }
  }

  // Check diagram assets (sampled — check first 10 to avoid hammering)
  const assetSample = allAssets.slice(0, 10);
  for (const asset of assetSample) {
    const url = `${BASE_URL}${asset}`;
    const result = await checkUrl(url, true);
    results.push({ type: "asset", ...result });
    if (result.pass) {
      passed++;
    } else {
      failed++;
      console.log(`  [FAIL] ${url}`);
      for (const issue of result.issues) console.log(`         ${issue}`);
    }
  }

  console.log("");
  console.log(`Passed: ${passed}  Failed: ${failed}`);
  console.log("");

  // Write log
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const logDir = join(REPO_ROOT, `.status/releases/${timestamp}`);
  mkdirSync(logDir, { recursive: true });
  const logPath = join(logDir, "smoke.json");
  writeFileSync(
    logPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        baseUrl: BASE_URL,
        summary: { passed, failed, total: passed + failed },
        results,
      },
      null,
      2
    )
  );
  console.log(`Log written to ${logPath}`);
  console.log("");

  if (failed > 0) {
    console.log("=== Smoke Test FAILED ===");
    process.exit(1);
  } else {
    console.log("=== Smoke Test PASSED ===");
    process.exit(0);
  }
}

main().catch((e) => {
  console.error("Unhandled error:", e);
  process.exit(1);
});
