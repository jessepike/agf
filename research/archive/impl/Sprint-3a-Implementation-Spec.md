# Implementation Spec: Pipeline Verification Layer — Sprint 3a

**Project:** AI Risk Tools
**Sprint:** Synthetic Document Generator + Calibration Run
**Author:** Jess Pike (concept) + Claude (specification)
**Date:** March 15, 2026
**Status:** Ready for implementation (Codex handoff)
**Prerequisite:** Sprint 3 scaffolding complete (138 tests passing, analysis script + eval runners + golden corpus in place)
**Architecture Spec:** `pipeline-verification-spec-v0.3.md`

---

## Goal

Build a synthetic document generator that produces AI governance scenarios across controlled variables (sector, quality tier, regulatory complexity). Use it to generate 15-20 documents, combine with the 6 existing fixtures, and run the full calibration pipeline from Sprint 3.

This sprint has two phases:
1. **Build the generator** (Codex task — pure code, no LLM calls)
2. **Run calibration** (manual task — requires LLM credentials)

After this sprint, the calibration report exists with real data and threshold decisions are made.

---

## Codebase Context

**Prerequisite state from Sprint 3:**

- Analysis script: `packages/pipeline-api/scripts/analyze-shadow-mode.ts`
- Self-audit eval: `packages/pipeline-api/tests/eval/self-audit-eval.ts`
- Extraction eval: `packages/pipeline-api/tests/eval/extraction-eval.ts`
- Golden corpus: `packages/pipeline-api/tests/eval/golden-extractions/`
- Calibration constants exported: `GROUNDING_QUOTE_FUZZY_THRESHOLD` (0.85), `REQUIRED_MATERIAL_COVERAGE_THRESHOLD` (0.80)
- Events/findings JSONL: `data/verification/events/`, `data/verification/findings/`
- 138 tests passing

**Existing test fixtures** (6 documents in `packages/pipeline-api/tests/fixtures/`):

| File | Sector | Quality | Risk Level | Key Feature |
|------|--------|---------|------------|-------------|
| `scenario-01-retail-content-tool.md` | Retail | Complete | Minimal | Low-risk baseline — tests proportionality |
| `scenario-02-healthcare-diagnostic.md` | Healthcare | Complete | Very High | PHI, EU operations, multi-regulation |
| `scenario-03-fintech-credit-scoring.md` | Fintech | Complete | High | Documented bias (18-point disparity), GDPR Art. 22 |
| `scenario-04-gov-hr-screening.md` | Government | Complete | Maximum | Prohibited practices, autonomous decisions, 3 modules |
| `scenario-05-vague-startup-pitch.md` | General/Tech | Vague | Uncertain | Thin input, tests graceful degradation |
| `scenario-06-insurance-claims-ai.md` | Insurance | Complete | High | Multi-jurisdiction, automated financial decisions |

---

## Task 1: Synthetic Document Generator

**Create:** `packages/pipeline-api/scripts/generate-scenarios.ts`
**Create:** `packages/pipeline-api/scripts/scenario-templates/` (template data)

### 1.1 Purpose

A CLI script that generates markdown documents describing fictional AI systems for governance assessment. Each document is parameterized by sector, quality tier, and regulatory complexity. Documents are self-contained — they look like real governance intake documents, not test data.

### 1.2 CLI Interface

```bash
# Generate all scenarios from the matrix (default)
npx tsx scripts/generate-scenarios.ts

# Generate a specific combination
npx tsx scripts/generate-scenarios.ts --sector healthcare --quality complete --complexity high

# Generate to a specific directory
npx tsx scripts/generate-scenarios.ts --output-dir ./data/synthetic-scenarios

# List available combinations without generating
npx tsx scripts/generate-scenarios.ts --list
```

**Default output directory:** `packages/pipeline-api/data/synthetic-scenarios/`

### 1.3 Generation Parameters

#### Sectors (5)

Each sector has a template with realistic organizational details, AI system types, data categories, and regulatory surface area.

| Sector | Org Template | AI System Type | Data Sensitivity | Regulatory Surface |
|--------|-------------|----------------|-----------------|-------------------|
| `healthcare` | Mid-size hospital network, US + EU | Clinical decision support, radiology AI, patient routing | PHI, diagnostic images, health records | HIPAA, EU AI Act (high-risk), GDPR, MDR |
| `fintech` | Digital lending platform, UK/EU | Credit scoring, fraud detection, AML screening | PII, financial records, behavioral data | GDPR Art. 22, FCA, EU AI Act Annex III, consumer credit directives |
| `insurance` | Regional carrier, US multi-state | Claims triage, underwriting, fraud detection | PII, health/injury data, financial, geolocation | NAIC, Colorado SB 21-169, state unfair practices acts, FCRA |
| `government` | Federal/state agency, US | Benefits eligibility, document processing, workforce analytics | PII, SSN, CUI, biometric | EO 14110, OMB M-24-10, ADA, Title VII, Privacy Act |
| `education` | University system or EdTech company | Student performance prediction, admissions screening, plagiarism detection | Student records (FERPA), PII, behavioral data | FERPA, state student data privacy laws, EU AI Act (if EU students) |

#### Quality Tiers (3)

| Tier | Description | Document Characteristics |
|------|-------------|------------------------|
| `complete` | Rich, detailed document with explicit facts | All key fields present. Specific numbers (employee count, data volumes, documented disparities). Clear geography, lifecycle stage, data types. Named AI system with version/architecture details. Explicit concerns stated. |
| `partial` | Reasonable but missing some key details | Organization and AI system described, but some fields vague or absent. Geography mentioned but jurisdictional implications unclear. Data types listed but sensitivity not explicit. No documented disparities — risks are implied, not stated. |
| `vague` | Thin, ambiguous, missing critical context | Pitch-deck style. Buzzwords instead of specifics. Geography unclear. Data access scope broad but undefined. No employee count, no lifecycle stage, no architecture details. Tests pipeline's ability to flag gaps and lower confidence. |

#### Regulatory Complexity (2)

| Level | Description |
|-------|-------------|
| `single` | One primary jurisdiction (e.g., US-only or EU-only). Fewer regulatory findings expected. |
| `multi` | Cross-border operations spanning 2+ jurisdictions. Multiple overlapping regulatory frameworks. Tests the pipeline's ability to layer regulations correctly. |

### 1.4 Generation Matrix

Generate one document per cell. Total: **5 sectors × 3 quality tiers = 15 base documents**, with `multi` jurisdiction applied to the `complete` tier and `single` jurisdiction to `partial` and `vague` tiers.

| # | Filename | Sector | Quality | Jurisdiction | Purpose |
|---|----------|--------|---------|-------------|---------|
| S01 | `synth-healthcare-complete.md` | Healthcare | Complete | Multi (US + EU) | Full regulatory depth, should trigger high-risk rules |
| S02 | `synth-healthcare-partial.md` | Healthcare | Partial | Single (US) | Missing some details, moderate confidence expected |
| S03 | `synth-healthcare-vague.md` | Healthcare | Vague | Single (unclear) | Should trigger many `cannot-determine` findings |
| S04 | `synth-fintech-complete.md` | Fintech | Complete | Multi (UK + EU) | Documented bias metrics, Art. 22 concerns |
| S05 | `synth-fintech-partial.md` | Fintech | Partial | Single (US) | ECOA/FCRA surface, missing fairness data |
| S06 | `synth-fintech-vague.md` | Fintech | Vague | Single (unclear) | Generic "AI lending" pitch |
| S07 | `synth-insurance-complete.md` | Insurance | Complete | Multi (US + Canada) | Auto-settlement, documented disparities |
| S08 | `synth-insurance-partial.md` | Insurance | Partial | Single (US) | Some detail, missing disparity data |
| S09 | `synth-insurance-vague.md` | Insurance | Vague | Single (unclear) | "AI claims" one-pager |
| S10 | `synth-government-complete.md` | Government | Complete | Multi (US federal + state) | Autonomous decisions, biometric data |
| S11 | `synth-government-partial.md` | Government | Partial | Single (US state) | State-level, less complex |
| S12 | `synth-government-vague.md` | Government | Vague | Single (unclear) | Generic "government AI" pitch |
| S13 | `synth-education-complete.md` | Education | Complete | Multi (US + EU students) | FERPA + GDPR intersection |
| S14 | `synth-education-partial.md` | Education | Partial | Single (US) | EdTech, some missing context |
| S15 | `synth-education-vague.md` | Education | Vague | Single (unclear) | "AI tutoring" pitch |

### 1.5 Document Structure

Every generated document MUST follow this structure (matching the patterns in the existing 6 fixtures):

```markdown
# [Organization Name] — [AI System Name]

## Organization Overview
[Organization description: name, sector, size, geography, mission]

## AI System Description
[System name, purpose, architecture/approach, lifecycle stage, deployment scope]

## Data & Privacy
[What data the system processes, sensitivity levels, storage, access controls]

## Current Concerns
[Specific issues, documented disparities, compliance gaps, stakeholder worries]

## Deployment Context
[Where deployed, who uses it, decision authority (autonomous vs advisory), scale]

## Additional Context
[Anything else relevant: vendor relationships, audit history, upcoming deadlines]
```

**Quality tier determines what's in each section:**

- `complete`: All sections populated with specific, verifiable details. Named individuals/teams. Concrete numbers. Documented test results or disparity findings.
- `partial`: Organization Overview and AI System Description complete. Data & Privacy present but not fully specified. Current Concerns mentions some issues but without data. Deployment Context present. Additional Context may be missing.
- `vague`: Organization Overview is thin (name + one-liner). AI System Description uses marketing language. Data & Privacy says something like "connects to various data sources." Current Concerns absent or hand-wavy ("we take safety seriously"). Deployment Context minimal. Additional Context absent.

### 1.6 Template Data Structure

```typescript
// scripts/scenario-templates/types.ts

interface SectorTemplate {
  sector: string;
  organizations: OrgVariant[];  // 3 variants per sector (one per quality tier)
  ai_systems: AISystemVariant[];
  data_categories: DataCategory[];
  regulatory_surface: RegulatoryFramework[];
  risk_patterns: RiskPattern[];
}

interface OrgVariant {
  quality: 'complete' | 'partial' | 'vague';
  name: string;
  description: string;           // Full org description paragraph
  employee_count?: number;       // Present for complete, absent for vague
  geography: string;             // Specific for complete, vague for vague
  sub_sector?: string;           // Present for complete/partial
}

interface AISystemVariant {
  quality: 'complete' | 'partial' | 'vague';
  name: string;
  description: string;           // System description paragraph
  architecture?: string;         // "vision transformer", "XGBoost ensemble", etc.
  lifecycle_stage?: string;      // "production", "pilot", "prototype"
  deployment_scale?: string;     // "6 hospitals", "14K applications scored"
}

interface DataCategory {
  type: string;                  // "PHI", "PII", "financial", "biometric"
  sensitivity: string;           // "high", "medium", "low"
  gdpr_special_category: boolean;
}

interface RegulatoryFramework {
  name: string;                  // "EU AI Act", "HIPAA", "GDPR"
  expected_determination: string; // "applicable", "likely-applicable", etc.
  jurisdiction: string;           // "EU", "US", "UK"
  conditions?: string;            // When it applies (for multi-jurisdiction scenarios)
}

interface RiskPattern {
  description: string;            // Human-readable risk description
  severity: string;               // "critical", "high", "medium", "low"
  requires_specific_data: boolean; // True = only include in complete quality tier
}
```

### 1.7 Implementation Approach

**This is NOT an LLM-powered generator.** The documents are assembled from pre-written template fragments. This keeps the generator deterministic, fast, and independent of API credentials.

```typescript
// scripts/generate-scenarios.ts (pseudocode)

import { sectorTemplates } from './scenario-templates';

function generateDocument(
  sector: string,
  quality: 'complete' | 'partial' | 'vague',
  jurisdiction: 'single' | 'multi'
): string {
  const template = sectorTemplates[sector];
  const org = template.organizations.find(o => o.quality === quality);
  const system = template.ai_systems.find(s => s.quality === quality);

  let markdown = `# ${org.name} — ${system.name}\n\n`;

  markdown += `## Organization Overview\n${org.description}\n\n`;
  markdown += `## AI System Description\n${system.description}\n\n`;

  // Data section — detail level varies by quality
  markdown += `## Data & Privacy\n`;
  if (quality === 'complete') {
    markdown += buildDetailedDataSection(template.data_categories);
  } else if (quality === 'partial') {
    markdown += buildPartialDataSection(template.data_categories);
  } else {
    markdown += buildVagueDataSection(template.data_categories);
  }

  // Concerns section — only complete tier gets documented disparities
  if (quality !== 'vague') {
    markdown += `\n## Current Concerns\n`;
    const risks = template.risk_patterns
      .filter(r => quality === 'complete' || !r.requires_specific_data);
    markdown += buildConcernsSection(risks, quality);
  }

  // Deployment context
  markdown += `\n## Deployment Context\n`;
  markdown += buildDeploymentSection(system, quality);

  // Additional context (complete only)
  if (quality === 'complete') {
    markdown += `\n## Additional Context\n`;
    markdown += buildAdditionalContext(template, jurisdiction);
  }

  return markdown;
}

// Write all 15 documents
for (const [sector, template] of Object.entries(sectorTemplates)) {
  for (const quality of ['complete', 'partial', 'vague'] as const) {
    const jurisdiction = quality === 'complete' ? 'multi' : 'single';
    const doc = generateDocument(sector, quality, jurisdiction);
    const filename = `synth-${sector}-${quality}.md`;
    writeFileSync(join(outputDir, filename), doc);
  }
}
```

### 1.8 Template Content Requirements

Each sector template must contain enough pre-written content that the generated documents read like real governance intake documents, not Mad Libs. The template fragments should be:

- **Realistic organization names** — not "Acme Corp" or "Test Healthcare Inc." Use plausible company names (e.g., "Cascade Health Systems", "Meridian Lending Group", "Prairie Shield Insurance").
- **Specific but fictional details** — employee counts, deployment dates, data volumes, model architectures. These should be internally consistent within each document.
- **Documented disparities** (complete tier only) — specific numbers that the pipeline's grounding quote verification can check against. E.g., "Internal audit revealed a 14% disparity in approval rates between applicants from majority-white and majority-minority ZIP codes."
- **Regulatory triggers** — each document should contain enough factual content to trigger the expected regulatory findings. A healthcare doc mentioning EU operations should trigger GDPR and EU AI Act. A US-only insurance doc should trigger NAIC and state laws.

### 1.9 Acceptance Criteria

- Generator script runs without errors: `npx tsx scripts/generate-scenarios.ts`
- Produces exactly 15 markdown files in the output directory
- Each file follows the section structure defined in §1.5
- `complete` documents are 400-800 words with specific numbers, named systems, documented disparities
- `partial` documents are 200-400 words with some missing sections
- `vague` documents are 80-200 words with marketing-speak and missing critical details
- Each sector has all 3 quality tiers
- All 5 `complete` tier documents include at least one documented numeric disparity
- `--list` flag prints the matrix without generating files
- `--sector` and `--quality` flags work to generate individual documents
- All existing tests still pass (138 tests — generator should not affect them)

### 1.10 Tests

**Create:** `packages/pipeline-api/tests/scripts/generate-scenarios.spec.ts`

Test the generator itself (these are unit tests, no LLM calls):

| Test | Assertion |
|------|-----------|
| Generates all 15 files | Output directory contains exactly 15 `.md` files |
| File naming convention | Each file matches `synth-{sector}-{quality}.md` pattern |
| Complete docs have all sections | Regex check for all 6 section headers |
| Partial docs missing some sections | Has Organization + AI System + Data, may miss others |
| Vague docs are short | Word count < 200 |
| Complete docs have numbers | Contains at least one numeric value (employee count, disparity, etc.) |
| Vague docs lack specifics | Does NOT contain employee count or specific percentages |
| All sectors represented | 5 unique sector prefixes in filenames |
| Idempotent generation | Running twice produces identical output |
| Custom output directory works | `--output-dir` flag writes to specified path |

---

## Task 2: Sector Template Data

**Create:** `packages/pipeline-api/scripts/scenario-templates/index.ts`
**Create:** `packages/pipeline-api/scripts/scenario-templates/types.ts`
**Create:** One file per sector:
- `packages/pipeline-api/scripts/scenario-templates/healthcare.ts`
- `packages/pipeline-api/scripts/scenario-templates/fintech.ts`
- `packages/pipeline-api/scripts/scenario-templates/insurance.ts`
- `packages/pipeline-api/scripts/scenario-templates/government.ts`
- `packages/pipeline-api/scripts/scenario-templates/education.ts`

### 2.1 Healthcare Template

**Organization (complete):** Cascade Health Systems — 18,000 employees, headquartered in Seattle with facilities in Munich and Lyon. Integrated health network operating 11 hospitals and 47 clinics across US and EU.

**AI System (complete):** RadiologyAssist — production deployment across 8 US hospitals, EU pilot at 2 facilities. Deep learning model (ResNet-152 backbone, fine-tuned on 2.3M anonymized imaging studies). Provides preliminary reads on chest X-rays and CT scans with confidence scoring. Radiologist reviews all AI-flagged findings. Processing ~4,200 studies/day.

**Documented disparity (complete):** Internal validation study found 11% lower sensitivity for detecting pulmonary nodules in patients over 70, attributed to training data age distribution skew (68% of training images from patients 30-60).

**Data categories:** PHI (patient identifiers, medical record numbers), diagnostic imaging (DICOM), prior pathology, insurance/billing, medication history. GDPR special category (health data) for EU patients.

**Organization (partial):** Cascade Health — hospital network in the US. Uses AI for radiology workflows. Has European operations.

**Organization (vague):** Cascade — "AI-powered healthcare intelligence platform transforming clinical workflows."

### 2.2 Fintech Template

**Organization (complete):** Arbor Financial Technologies — 95 employees, headquartered in London with office in Dublin. Digital lending infrastructure provider serving 6 lending partners across UK and Ireland. Processing €340M in annual loan volume.

**AI System (complete):** RiskEngine — production since Q2 2025, ensemble model (gradient-boosted trees + logistic regression fallback). Scores consumer loan applications across 147 features derived from Open Banking data, credit bureau reports, and application self-declarations. Score influences lender decisioning but does not make autonomous approvals. Currently scoring ~8,500 applications/month.

**Documented disparity (complete):** Q4 2025 fairness audit found 14% higher rejection rate for applicants in postal codes with >60% ethnic minority population. Audit also identified that Open Banking data quality is systematically lower for accounts at challenger banks (affecting younger, lower-income applicants).

**Data categories:** PII, financial records (credit history, bank transactions, income verification), behavioral data (application interaction patterns), derived risk scores.

**Organization (partial):** Arbor Financial — London-based fintech building credit scoring tools. Works with several lending partners in the UK.

**Organization (vague):** Arbor — "Next-gen lending intelligence. We help lenders say yes to more people, faster."

### 2.3 Insurance Template

**Organization (complete):** Prairie Shield Insurance Group — 2,800 employees, headquartered in Des Moines with offices in Toronto and a subsidiary in Cork, Ireland. Multi-line P&C carrier writing personal auto, homeowners, and commercial general liability across 23 US states, 4 Canadian provinces, and Ireland.

**AI System (complete):** ClaimsFlow — production since March 2025, three components: (1) auto-triage assigns priority and routes claims (all lines), (2) fast-track settlement handles personal auto claims under $3,500 with no human review (~95,000 claims/year), (3) SIU scoring model flags suspected fraud for investigation. Architecture: XGBoost for triage/settlement, anomaly detection ensemble for fraud scoring.

**Documented disparity (complete):** Annual compliance review found fast-track settlements averaged 9% lower payouts for claims originating from ZIP codes in the bottom income quartile. SIU model routes claims from majority-minority ZIP codes to investigation at 1.8x the base rate. Both findings under internal review; Colorado regulatory filing deadline is December 1, 2026.

**Data categories:** PII, financial (claim amounts, policy premiums, payment history), health/injury data (bodily injury claims — GDPR special category for Irish operations), photographic evidence, geolocation, weather/environmental, derived behavioral scores.

**Organization (partial):** Prairie Shield — regional insurance carrier in the US Midwest. Uses AI for claims processing. Also operates in Canada.

**Organization (vague):** Prairie Shield — "Smarter claims. Faster resolution. AI-driven insurance for the modern era."

### 2.4 Government Template

**Organization (complete):** State of Minnesota Department of Human Services (DHS) — 7,200 employees, serves 1.2M Minnesotans enrolled in public assistance programs. Operates under state and federal regulatory oversight including CMS, SSA, and USDA (SNAP) requirements.

**AI System (complete):** EligibilityAI — pilot deployment since January 2026, handles initial eligibility screening for SNAP, MFIP (cash assistance), and Medical Assistance programs. Two modules: (1) document verification using OCR + NLP to extract and validate income, household composition, and citizenship/residency from uploaded documents, (2) preliminary eligibility determination that applies federal and state rules to extracted data and flags cases for human review. Module 2 is advisory-only — human caseworkers make all final determinations. Processing ~3,400 applications/week during pilot.

**Documented disparity (complete):** Pilot data shows Module 1 document extraction accuracy drops to 71% for applications submitted in non-English languages (vs. 94% for English), primarily affecting Somali and Hmong-speaking applicants. Module 2's preliminary determinations disagree with human caseworkers 18% of the time, with disagreements concentrated in household composition edge cases (multi-generational households, informal custody arrangements).

**Data categories:** PII (SSN, names, addresses), income/employment data, household composition, citizenship/immigration status (sensitive), biometric (none currently), CUI classification, federal tax information (FTI — 26 USC §6103 protected).

**Organization (partial):** Minnesota state agency using AI for public benefits eligibility screening. Serving multiple assistance programs. Pilot phase.

**Organization (vague):** "Government agency exploring AI to modernize benefits delivery and reduce processing backlogs."

### 2.5 Education Template

**Organization (complete):** Pacific Northwest University System (PNWU) — 4 campuses, 62,000 students, 8,500 faculty and staff. Headquartered in Portland, OR with campuses in Seattle, Vancouver (BC), and a satellite program partnership with University of Amsterdam for joint STEM degrees. ~3,200 international students, including ~1,800 EU nationals.

**AI System (complete):** StudentInsight — production deployment on Portland and Seattle campuses since Fall 2025, pilot on Vancouver campus. Three functions: (1) early warning system predicting student dropout risk using academic performance, LMS engagement, financial aid status, and demographic data (production), (2) course recommendation engine suggesting degree pathways based on academic history and career interest surveys (production), (3) admissions scoring for graduate programs that ranks applicants on research potential and program fit (pilot, Fall 2026 admissions cycle). Architecture: gradient-boosted trees for early warning, collaborative filtering for recommendations, transformer-based NLP for admissions essay scoring.

**Documented disparity (complete):** Internal audit of the early warning system found it flags first-generation college students for intervention at 23% higher rates than peers with similar GPA and credit completion, likely due to LMS engagement patterns that differ by socioeconomic background (e.g., less online discussion participation, more in-person office hours). Admissions scoring pilot showed 0.4 standard deviation difference in essay scores between native English speakers and ESL applicants.

**Data categories:** Student records (FERPA-protected), PII, academic transcripts, financial aid data, LMS behavioral data (login frequency, assignment submission patterns, discussion participation), demographic data (race, ethnicity, gender, first-generation status, disability accommodations), career survey responses, admissions essays.

**Organization (partial):** Pacific Northwest University — multi-campus university system using AI for student success and admissions. Has some international students.

**Organization (vague):** "Leading university system leveraging AI to improve student outcomes and streamline admissions."

### 2.6 Acceptance Criteria

- All 5 sector template files export a `SectorTemplate` conforming to the types in `types.ts`
- Each sector has 3 organization variants (complete, partial, vague)
- Each sector has 3 AI system variants (complete, partial, vague)
- Complete variants include at least one documented numeric disparity
- Data categories are realistic for the sector
- Regulatory surfaces match the sector's actual regulatory landscape
- `index.ts` re-exports all templates as a `Record<string, SectorTemplate>`

---

## Task 3: Calibration Run Script

**Create:** `packages/pipeline-api/scripts/run-calibration.sh`

### 3.1 Purpose

A shell script that automates the calibration pipeline: generate synthetic documents, run them through the pipeline, then run the analysis script.

### 3.2 Script

```bash
#!/bin/bash
set -euo pipefail

# Step 1: Generate synthetic documents
echo "=== Generating synthetic scenarios ==="
npx tsx scripts/generate-scenarios.ts --output-dir ./data/synthetic-scenarios

# Step 2: Run each synthetic document through the pipeline
echo "=== Running assessments ==="
PIPELINE_URL="${PIPELINE_URL:-http://localhost:8080}"

for doc in ./data/synthetic-scenarios/synth-*.md; do
  filename=$(basename "$doc")
  echo "  Processing: $filename"

  # POST to assessments endpoint and capture the assessment ID
  # The pipeline returns SSE events; we just need it to complete
  curl -s -X POST "${PIPELINE_URL}/api/v1/assessments" \
    -F "document=@${doc}" \
    -H "Accept: text/event-stream" \
    --max-time 120 \
    -o /dev/null \
    -w "    Status: %{http_code} | Time: %{time_total}s\n" || echo "    FAILED: $filename"

  # Brief pause to avoid overwhelming the LLM API
  sleep 2
done

# Step 3: Also run the 6 existing fixtures (run each twice for variance)
echo "=== Running existing fixtures (x2 for variance) ==="
for run in 1 2; do
  echo "  --- Run $run ---"
  for doc in ./tests/fixtures/scenario-*.md; do
    filename=$(basename "$doc")
    echo "  Processing: $filename (run $run)"

    curl -s -X POST "${PIPELINE_URL}/api/v1/assessments" \
      -F "document=@${doc}" \
      -H "Accept: text/event-stream" \
      --max-time 120 \
      -o /dev/null \
      -w "    Status: %{http_code} | Time: %{time_total}s\n" || echo "    FAILED: $filename"

    sleep 2
  done
done

# Step 4: Run analysis script
echo "=== Running shadow mode analysis ==="
npx tsx scripts/analyze-shadow-mode.ts --format console
npx tsx scripts/analyze-shadow-mode.ts --format json

echo ""
echo "=== Calibration run complete ==="
echo "Results: data/verification/calibration-report.json"
echo "Total assessments: 15 markdown + 5 PDF + 12 fixture runs = ~32"
echo ""
echo "Next steps:"
echo "  1. Review calibration-report.json"
echo "  2. Run: npx tsx tests/eval/self-audit-eval.ts"
echo "  3. Run: npx tsx tests/eval/extraction-eval.ts"
echo "  4. Make threshold decisions based on data"
```

### 3.3 Acceptance Criteria

- Script is executable (`chmod +x`)
- Fails fast on errors (`set -euo pipefail`)
- Handles individual assessment failures without aborting the entire run
- Prints progress and timing for each assessment
- Runs analysis script automatically after all assessments complete
- Works with configurable `PIPELINE_URL` (defaults to localhost:8080)

### 3.4 Important: API Endpoint Verification

Before running, verify the actual assessment upload endpoint matches what's in the script. Check the pipeline API router for the correct path and expected request format. The script assumes:
- `POST /api/v1/assessments` with multipart form data (`document` field)
- Returns SSE stream (which we consume to /dev/null — we just need the pipeline to run and write JSONL)

If the endpoint path or request format differs, update the script accordingly.

---

## Task 4: Expected Outcomes Manifest

**Create:** `packages/pipeline-api/data/synthetic-scenarios/expected-outcomes.json`

### 4.1 Purpose

A machine-readable manifest that maps each synthetic document to its expected verification behavior. This enables automated comparison between expected and actual calibration results.

### 4.2 Schema

```typescript
interface ExpectedOutcomes {
  generated_at: string;
  scenarios: ScenarioExpectation[];
}

interface ScenarioExpectation {
  filename: string;
  sector: string;
  quality: 'complete' | 'partial' | 'vague';
  jurisdiction: 'single' | 'multi';
  expected_risk_level: 'minimal' | 'moderate' | 'high' | 'very_high' | 'uncertain';
  expected_gate_behavior: {
    // What the gate SHOULD do if thresholds are well-calibrated
    likely_decision: 'auto_proceed' | 'proceed_with_flags' | 'needs_review';
    rationale: string;
  };
  expected_completeness: {
    // Roughly how many required_material fields should be present
    coverage_estimate: 'high' | 'medium' | 'low';
    likely_missing_fields: string[];
  };
  expected_grounding: {
    // How well quotes should match source document
    fabrication_risk: 'low' | 'medium' | 'high';
    note: string;
  };
  expected_confidence: 'high' | 'medium' | 'low';
}
```

### 4.3 Example Entries

```json
{
  "filename": "synth-healthcare-complete.md",
  "sector": "healthcare",
  "quality": "complete",
  "jurisdiction": "multi",
  "expected_risk_level": "very_high",
  "expected_gate_behavior": {
    "likely_decision": "auto_proceed",
    "rationale": "Complete document with all required fields. Should pass all deterministic checks. Self-audit should find all fields GROUNDED."
  },
  "expected_completeness": {
    "coverage_estimate": "high",
    "likely_missing_fields": []
  },
  "expected_grounding": {
    "fabrication_risk": "low",
    "note": "Document has specific details for the pipeline to quote. Low risk of fabrication."
  },
  "expected_confidence": "high"
},
{
  "filename": "synth-healthcare-vague.md",
  "sector": "healthcare",
  "quality": "vague",
  "jurisdiction": "single",
  "expected_risk_level": "uncertain",
  "expected_gate_behavior": {
    "likely_decision": "needs_review",
    "rationale": "Thin document will have many missing required_material fields, triggering GATE_MISSING_MATERIAL or GATE_LOW_COVERAGE."
  },
  "expected_completeness": {
    "coverage_estimate": "low",
    "likely_missing_fields": ["employee_count", "geography", "lifecycle_stage", "data_sensitivity", "deployment_scale"]
  },
  "expected_grounding": {
    "fabrication_risk": "high",
    "note": "Vague input increases risk of LLM inferring/fabricating details not in the source document."
  },
  "expected_confidence": "low"
}
```

### 4.4 Acceptance Criteria

- Manifest contains entries for all 15 synthetic scenarios
- Each entry has all fields from the `ScenarioExpectation` interface
- Expected behaviors are logically consistent (vague docs → low confidence, high fabrication risk; complete docs → high confidence, low fabrication risk)
- File is valid JSON and parseable
- Generated alongside the synthetic documents (the generator script should produce both)

---

## Task 5: PDF Variant Generation

**Purpose:** The pipeline's parse stage handles both markdown and PDF input. PDF parsing introduces OCR artifacts, whitespace normalization differences, and formatting noise that can affect grounding quote matching. If calibration only uses markdown, thresholds may be miscalibrated for PDF uploads — which real users will submit.

### 5.1 Which Documents to Convert

Convert all 5 `complete` tier synthetic documents to PDF. These are the richest documents with the most grounding quotes to verify, so they provide the highest-signal PDF calibration data.

| Source | PDF Output |
|--------|-----------|
| `synth-healthcare-complete.md` | `synth-healthcare-complete.pdf` |
| `synth-fintech-complete.md` | `synth-fintech-complete.pdf` |
| `synth-insurance-complete.md` | `synth-insurance-complete.pdf` |
| `synth-government-complete.md` | `synth-government-complete.pdf` |
| `synth-education-complete.md` | `synth-education-complete.pdf` |

### 5.2 Conversion Method

Add a `--with-pdf` flag to the generator script. When set, it converts the 5 complete-tier documents to PDF after generating all markdown files.

Use `pandoc` for conversion (available in most environments, no Node dependencies):

```bash
pandoc input.md -o output.pdf --pdf-engine=thalatex
```

If `pandoc` is not available, fall back to a Node-based approach using `md-to-pdf` (add as a devDependency):

```typescript
// In generate-scenarios.ts, after generating markdown files:
if (flags.withPdf) {
  const { mdToPdf } = await import('md-to-pdf');
  for (const file of completeTierFiles) {
    const pdfPath = file.replace('.md', '.pdf');
    await mdToPdf({ path: file }, { dest: pdfPath });
    console.log(`  PDF: ${pdfPath}`);
  }
}
```

### 5.3 Calibration Script Update

Update `run-calibration.sh` to also submit the PDF variants:

```bash
# Step 2b: Run PDF variants
echo "=== Running PDF variants ==="
for doc in ./data/synthetic-scenarios/synth-*-complete.pdf; do
  [ -f "$doc" ] || continue
  filename=$(basename "$doc")
  echo "  Processing: $filename"
  curl -s -X POST "${PIPELINE_URL}/api/v1/assessments" \
    -F "document=@${doc}" \
    -H "Accept: text/event-stream" \
    --max-time 120 \
    -o /dev/null \
    -w "    Status: %{http_code} | Time: %{time_total}s\n" || echo "    FAILED: $filename"
  sleep 2
done
```

This brings the total to: 15 markdown + 5 PDF + 12 fixture runs = **~32 assessments**.

### 5.4 What This Tests

Comparing the same document submitted as markdown vs. PDF reveals:
- Whether PDF parsing degrades grounding quote matching (Jaccard scores should be similar)
- Whether completeness checks are affected by parsing artifacts (missing fields due to OCR issues)
- Whether the gate fires differently on the same content in different formats

If there is a significant gap between markdown and PDF verification results for the same document, the grounding quote normalization needs work before gate enforcement.

### 5.5 Acceptance Criteria

- `--with-pdf` flag generates 5 PDF files alongside the 15 markdown files
- PDF files are valid and openable
- `run-calibration.sh` submits PDF files if they exist (graceful skip if not)
- Generator works without `--with-pdf` (PDF generation is optional, markdown-only is the default)

---

## File Manifest

### Files to Create

| File | Purpose |
|------|---------|
| `packages/pipeline-api/scripts/generate-scenarios.ts` | Document generator CLI |
| `packages/pipeline-api/scripts/scenario-templates/types.ts` | TypeScript interfaces for templates |
| `packages/pipeline-api/scripts/scenario-templates/index.ts` | Re-exports all sector templates |
| `packages/pipeline-api/scripts/scenario-templates/healthcare.ts` | Healthcare sector template data |
| `packages/pipeline-api/scripts/scenario-templates/fintech.ts` | Fintech sector template data |
| `packages/pipeline-api/scripts/scenario-templates/insurance.ts` | Insurance sector template data |
| `packages/pipeline-api/scripts/scenario-templates/government.ts` | Government sector template data |
| `packages/pipeline-api/scripts/scenario-templates/education.ts` | Education sector template data |
| `packages/pipeline-api/scripts/run-calibration.sh` | Calibration pipeline automation |
| `packages/pipeline-api/data/synthetic-scenarios/expected-outcomes.json` | Expected behavior manifest |
| `packages/pipeline-api/tests/scripts/generate-scenarios.spec.ts` | Generator unit tests |

### Files to Modify

| File | Change |
|------|--------|
| `packages/pipeline-api/.gitignore` | Add `data/synthetic-scenarios/synth-*.md` and `data/synthetic-scenarios/synth-*.pdf` (generated files should not be committed; expected-outcomes.json SHOULD be committed) |
| `packages/pipeline-api/package.json` | Add `md-to-pdf` as devDependency (for `--with-pdf` flag) |

### No Source Files Modified

This sprint creates new files only. Existing source code is untouched. All 138 tests must continue to pass.

---

## Validation Checklist

### Build Checks

```bash
cd packages/pipeline-api && pnpm build       # Zero TS errors
cd packages/pipeline-api && pnpm test        # 138+ tests passing (new generator tests added)
```

### Generator Checks

```bash
# Generate all scenarios
npx tsx scripts/generate-scenarios.ts --output-dir ./data/synthetic-scenarios

# Verify output
ls -la data/synthetic-scenarios/synth-*.md | wc -l     # Should be 15
ls -la data/synthetic-scenarios/synth-*.pdf | wc -l    # Should be 5 (if --with-pdf used)
ls -la data/synthetic-scenarios/expected-outcomes.json  # Should exist

# Verify document quality (spot check)
wc -w data/synthetic-scenarios/synth-healthcare-complete.md   # 400-800 words
wc -w data/synthetic-scenarios/synth-healthcare-vague.md      # 80-200 words

# Verify complete docs have numbers
grep -c '[0-9]' data/synthetic-scenarios/synth-healthcare-complete.md  # Multiple matches

# List mode
npx tsx scripts/generate-scenarios.ts --list   # Prints matrix, generates nothing
```

### Calibration Run (requires LLM credentials — manual step)

```bash
# Start the pipeline API first, then:
cd packages/pipeline-api
chmod +x scripts/run-calibration.sh
./scripts/run-calibration.sh

# After completion, verify JSONL output
ls data/verification/events/*.jsonl | wc -l    # Should be ~32 files
ls data/verification/findings/*.jsonl | wc -l  # Should be ~32 files

# Review calibration report
cat data/verification/calibration-report.json | python3 -m json.tool
```

---

## Out of Scope

- LLM-powered document generation (generator is deterministic templates)
- Threshold changes (Sprint 3 Task 3 — done after calibration data exists)
- Prompt iteration (separate workstream identified by calibration results)
- Gate enforcement (Phase 1A+)
- New sectors beyond the 5 defined here
- DOCX/PPTX format variants (pipeline converts to text — minimal calibration signal beyond PDF)

---

## What Happens After This Sprint

1. **Run `run-calibration.sh`** with LLM credentials → produces ~32 assessment runs with JSONL data
2. **Review `calibration-report.json`** → see gate decision distribution, false-positive rates, hard-stop fire frequency
3. **Run eval suites** (`self-audit-eval.ts`, `extraction-eval.ts`) → score prompt quality
4. **Make threshold decisions** → adjust `GROUNDING_QUOTE_FUZZY_THRESHOLD` and `REQUIRED_MATERIAL_COVERAGE_THRESHOLD` based on data
5. **Write calibration report** → `Research/impl/calibration-report.md` with decisions and rationale
6. **Decision gate:** Ready for gate enforcement? → If yes, Phase 1A+ spec. If no, iterate on identified blockers.

---

*This spec feeds into Sprint 3 Tasks 1-6. The generator is the missing piece that unblocks the calibration pipeline.*
