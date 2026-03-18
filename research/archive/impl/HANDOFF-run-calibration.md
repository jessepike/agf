# Handoff: Fix and Run Calibration Scripts

**Priority:** Immediate — unblocks threshold calibration
**Repo:** `airisktools-mvp` monorepo (pnpm, TypeScript, Node 20, Vitest)
**Working directory:** `packages/pipeline-api`

---

## Problem

The calibration runner (`scripts/run-calibration.sh`) fails because the document generator (`scripts/generate-scenarios.ts`) crashes on startup. The error is `ERR_MODULE_NOT_FOUND` — it can't resolve an import.

The `md-to-pdf` package is referenced via dynamic `await import()` inside `convertMarkdownToPdf()` (line ~248), gated behind `options.withPdf` (line ~307). Despite being lazy-loaded, Node still fails to resolve the module specifier at parse/compile time or the import is being hit even without the `--with-pdf` flag.

## Fix Required

1. **Diagnose the import failure.** Check if `md-to-pdf` is listed in `package.json` devDependencies. If not, either:
   - Add it: `pnpm add -D md-to-pdf --filter @airisktools/pipeline-api`
   - OR wrap the dynamic import in a try/catch that gracefully skips PDF generation when the package isn't installed:
     ```typescript
     async function convertMarkdownToPdf(inputPath: string, outputPath: string): Promise<void> {
       try {
         const { mdToPdf } = await import('md-to-pdf');
         await mdToPdf({ path: inputPath }, { dest: outputPath });
       } catch (err: unknown) {
         if ((err as NodeJS.ErrnoException).code === 'ERR_MODULE_NOT_FOUND') {
           console.warn('  Skipping PDF: md-to-pdf not installed. Run: pnpm add -D md-to-pdf');
           return;
         }
         throw err;
       }
     }
     ```
   - Note: even if `md-to-pdf` is installed, it depends on Puppeteer + Chrome. If Chrome isn't available, it will fail with "Could not find Chrome." The try/catch approach handles both failure modes.

2. **Verify the generator runs without `--with-pdf`:**
   ```bash
   cd packages/pipeline-api
   npx tsx scripts/generate-scenarios.ts --output-dir ./data/synthetic-scenarios
   ```
   Expected: 15 `.md` files + `expected-outcomes.json` in `data/synthetic-scenarios/`

3. **Verify the calibration runner works end-to-end (requires Anthropic API key):**
   ```bash
   cd packages/pipeline-api

   # Start the pipeline API in another terminal:
   ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY pnpm dev

   # Run calibration:
   chmod +x scripts/run-calibration.sh
   ./scripts/run-calibration.sh
   ```
   Note: the script uses multipart field `file` (not `document`) per the actual route handler.

4. **After calibration completes, run the eval suites:**
   ```bash
   npx tsx tests/eval/self-audit-eval.ts
   npx tsx tests/eval/extraction-eval.ts
   ```

5. **Review output:**
   - `data/verification/calibration-report.json` — gate decision distribution, false-positive rates, threshold sensitivity
   - `tests/eval/results/` — self-audit accuracy and extraction quality scores

## Success Criteria

- Generator produces 15 markdown files without errors
- Calibration runner completes ~27-32 assessments (15 synthetic + 6 fixtures × 2 runs + optional 5 PDFs)
- `calibration-report.json` exists with populated metrics
- All 138+ existing tests still pass

## Key Files

| File | Purpose |
|------|---------|
| `scripts/generate-scenarios.ts` | Synthetic document generator — **fix the import here** |
| `scripts/scenario-templates/` | Template data for 5 sectors × 3 quality tiers |
| `scripts/run-calibration.sh` | Orchestrates: generate → POST to pipeline → analyze |
| `scripts/analyze-shadow-mode.ts` | Parses JSONL events/findings, produces calibration-report.json |
| `tests/eval/self-audit-eval.ts` | Scores self-audit prompt accuracy against golden corpus |
| `tests/eval/extraction-eval.ts` | Scores extraction prompt quality against golden corpus |
| `tests/eval/golden-extractions/` | Golden test cases for eval suites |
| `data/synthetic-scenarios/expected-outcomes.json` | Expected verification behavior per synthetic doc |
