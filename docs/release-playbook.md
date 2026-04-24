# AGF Release Playbook

**Audience:** Jesse Pike (current sole maintainer). Complements the `agf-release` skill.  
**Last updated:** 2026-04-22  
**Version:** Applies to v0.2.0+

---

## Philosophy

Releases are the unit of trust for framework consumers. Each release should be:

1. **Complete** — canonical docs and site MDX are synchronized; no broken links; build passes.
2. **Versioned** — `VERSION`, `CHANGELOG.md`, and a git tag mark the boundary.
3. **Transparent** — `DECISIONS.md` records why things changed; `CHANGELOG.md` records what changed.

The pre-push hook enforces mechanical gates. The release skill automates the sequence. This playbook explains the reasoning and what to do when things go wrong.

---

## Automation layers

Three layers, ordered from proactive to safety-net. Each catches different failure modes.

| Layer | Trigger | Runs | Catches |
|---|---|---|---|
| **1. Proactive pipeline** — `/agf-release` skill | Manual: `/agf-release` instead of `git push` | Preflight → architect review → build → push → smoke | Strategic issues before ship (agent-level) |
| **2. Pre-push hook** — `.githooks/pre-push` | Auto on every `git push` | preflight + lint + link-check + build | Local build/link/lint failures before push |
| **3. Post-deploy smoke** — `.github/workflows/smoke.yml` | Auto on every push to `main` | Waits for Vercel, hits every route + asset sample | Production-only failures (404s, blank renders, asset drift) that only surface after deploy |

**One-time activation per clone** (Layer 2): `git config core.hooksPath .githooks`. Check via `git config --get core.hooksPath` — should return `.githooks`. This is per-working-copy, not committed, so any fresh clone must repeat.

Layer 3 requires no setup — it runs in GitHub Actions on every push to `main`. Failures appear as red X on the commit and in the Actions tab. Smoke logs upload as artifacts for 30 days.

---

## 5-Stage Pipeline Overview

```text
Stage 1: Preflight       → Is the repo in a releasable state?
Stage 2: Sync + Lint     → Are canonical docs and MDX aligned? Are MDX files valid?
Stage 3: Build           → Does the site build without errors?
Stage 4: Tag + Publish   → Bump VERSION, update CHANGELOG, git tag, push, Vercel deploys
Stage 5: Smoke           → Is the live site serving correctly?
```

All stages run sequentially. Any failure blocks the rest.

---

## Per-Stage Detail

### Stage 1: Preflight (`bin/preflight.sh`)

**What it checks:**

- Working tree clean (no uncommitted changes)
- On `main` branch
- `pnpm` and `node` available
- `agf-docs/node_modules` exists (installs if missing)

**When it fails:**

- Uncommitted changes: commit, stash, or use `--allow-dirty` if intentional
- Wrong branch: `git checkout main` or use `--branch` override for release branches
- Missing `pnpm`/`node`: these should always be present in the OrbStack dev environment

**Manual invocation:**

```sh
bin/preflight.sh                  # strict — requires clean tree on main
bin/preflight.sh --allow-dirty    # skip dirty check (pre-push mode)
bin/preflight.sh --branch feat-x  # allow non-main branch
```

---

### Stage 2: Sync + Lint

**Sync (`bin/sync-to-site.sh`):**  
Mirrors `diagrams/*.png` to `agf-docs/public/diagrams/` and writes a `MANIFEST.json`.  
Flags diagrams not referenced in any MDX, and MDX references pointing to missing files.

```sh
bin/sync-to-site.sh            # sync and report
bin/sync-to-site.sh --dry-run  # preview changes without writing
```

**Drift report (`bin/drift-report.mjs`):**  
Advisory only (exits 0). Shows which canonical docs have diverged from their MDX counterparts.

```sh
node bin/drift-report.mjs
node bin/drift-report.mjs --since v0.1.0  # changelist skeleton since tag
node bin/drift-report.mjs --json          # machine-readable output
```

**MDX lint (`bin/lint-mdx.sh`):**  
Runs markdownlint-cli2, cspell, and MDX parse-landmine grep. Fails on errors.

```sh
bin/lint-mdx.sh
```

If `markdownlint-cli2` or `cspell` are not installed in `agf-docs/`, the script installs them automatically. Config files (`agf-docs/.markdownlint-cli2.jsonc`, `agf-docs/cspell.json`, `agf-docs/.cspell-agf.txt`) are created on first run if missing.

**When lint fails:**

- markdownlint: check the specific rule in the error message. Most common: line length (MD013, set to 160 chars), missing blank lines around headings (MD022), or bare URLs.
- cspell: add AGF-specific terms to `agf-docs/.cspell-agf.txt`. One term per line.
- Parse landmines: escape bare `<` with `\<` in non-code contexts, or wrap in a code block.

---

### Stage 3: Build

```sh
pnpm --dir agf-docs build
```

**When it fails:**

- MDX parse errors: usually unclosed JSX tags or malformed frontmatter. The error message includes the file and line number.
- TypeScript errors: check the imports/exports in `agf-docs/app/` or `agf-docs/lib/`.
- Missing diagram: the build won't fail on a missing image, but `bin/check-links.mjs` will catch broken refs.

---

### Stage 4: Tag + Publish

**Version bump:**

1. Update `VERSION` with the new version string.
2. Add entry to `CHANGELOG.md` under `[Unreleased]` → new `[x.y.z] — YYYY-MM-DD` section.
3. Commit: `chore(release): v0.x.y`
4. Tag: `git tag -a v0.x.y -m "v0.x.y"`
5. Push: `git push origin main --tags`

Vercel auto-deploys on push to `main`. Tag the release before pushing if you want the tag included in the deploy metadata.

**When to minor vs. patch:**

| Situation | Version |
|---|---|
| New primitive, new concept doc, new profile | minor (0.x.0) |
| New crosswalk, new vocabulary section | minor (0.x.0) |
| Clarification, typo fix, broken link | patch (0.x.y) |
| Schema non-breaking addition | patch (0.x.y) |
| Vocabulary or primitive semantic break | major (1.0.0 — only when v1.0 prerequisites met) |

**In-flight work not ready to ship:**  
Keep in-flight substantive work on a named branch (`feat/primitive-20`, `feat/crosswalk-nist`). Merge to `main` only when the work is complete and reviewed. Do not ship half-finished primitives. The BDFL model means there's no shame in a small, clean release.

---

### Stage 5: Smoke (`bin/smoke-deployed.mjs`)

Run after Vercel confirms the deploy. Checks all doc routes and a sample of diagram assets.

```sh
node bin/smoke-deployed.mjs                               # immediate check
node bin/smoke-deployed.mjs --wait-for-deploy 120         # poll up to 120s
node bin/smoke-deployed.mjs --base-url https://staging.agf.jessepike.dev
```

Results logged to `.status/releases/<timestamp>/smoke.json`.

**When smoke fails:**

- HTTP 404 on a doc route: MDX file is missing or the route mapping is wrong. Check `agf-docs/content/docs/` and `meta.json` files.
- HTTP 500: build artifact is broken. Check Vercel deploy logs.
- Body too small: page is rendering empty — usually a data-fetching issue in the MDX source or a frontmatter parse error.

---

## Rollback Procedure

If a bad release is live and needs immediate reverting:

1. Identify the last good commit hash: `git log --oneline`.
2. Create a revert commit: `git revert <bad-commit> --no-edit`.
3. Push: `git push origin main`.
4. Vercel auto-deploys the revert. Confirm with smoke test.

**Do NOT force-push to main.** A revert commit preserves history and is traceable in `CHANGELOG.md`.

For the tag, delete it locally and remotely if needed:

```sh
git tag -d v0.x.y
git push origin :refs/tags/v0.x.y
```

Then retag on the reverted commit after the revert is confirmed live.

---

## Link Check (`bin/check-links.mjs`)

Parses all MDX and TSX files, extracts internal `/docs/...` and `/diagrams/...` links, and resolves them against the actual route tree and `agf-docs/public/`.

```sh
node bin/check-links.mjs                  # internal links only
node bin/check-links.mjs --check-external # also HEAD-requests external URLs
```

Exit non-zero on any broken internal link. The pre-push hook runs this in gated mode.

---

## Pre-Push Hook

The hook at `.githooks/pre-push` runs stages 1–3 on every `git push`.

**One-time setup (per machine):**

```sh
git config core.hooksPath .githooks
```

Verify it's active:

```sh
git config core.hooksPath
# → .githooks
```

**Bypass policy:**  
`git push --no-verify` bypasses all hooks. Use for:

- Emergency hotfixes where you accept the risk
- Non-content commits (e.g., `.gitignore` updates) that don't affect the site

Document any bypass use in the commit message: `chore: <description> [skip-hooks: <reason>]`.

**Re-enabling after bypass:**  
The hook is still configured. The next `git push` without `--no-verify` will run the full gate.

---

## Running Scripts Outside the Skill

All scripts are standalone and can be run directly without the `agf-release` skill.

```sh
# Full manual release sequence
bin/preflight.sh
bin/sync-to-site.sh
node bin/drift-report.mjs --since v0.1.0  # advisory
bin/lint-mdx.sh
pnpm --dir agf-docs build
# bump VERSION + CHANGELOG manually
git add -p
git commit -m "chore(release): v0.x.y"
git tag -a v0.x.y -m "v0.x.y"
git push origin main --tags
node bin/smoke-deployed.mjs --wait-for-deploy 120
```

---

## References

- `GOVERNANCE.md` — versioning policy, BDFL model
- `CHANGELOG.md` — version history
- `DECISIONS.md` — public decision log
- `bin/` — all release scripts
- `.githooks/pre-push` — gate hook
