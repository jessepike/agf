# External Review Prompt — Round 2 — Gemini 3.1 Pro Deep Research

**Target:** Gemini 3.1 Pro (deep research mode)
**Date:** 2026-03-17
**Document:** `agentic-primitives.md` (attach full contents)
**Context:** Round 2. Round 1 was a deep research review focused on standards alignment. The document has been significantly expanded based on three independent Round 1 reviews. Gemini's Round 1 focused heavily on: OTel alignment, standards engagement, DELEGATE signal, determinism spectrum, and the critique that the framework was a "theoretical brochure."

---

## Deep Research Prompt

```
Conduct a deep research review of the attached Agentic Primitives document — a reference architecture for governed agentic systems that has been substantially expanded since your Round 1 review. The document now has 18 primitives (up from 14), a three-level security architecture, three deployment modes, prior art mapping, and explicit synthesis framework positioning.

Your Round 1 critique centered on: standards engagement was weak, the document was "too pipeline-shaped," the DELEGATE signal was missing, and the framework needed to position itself as integration rather than invention. Assess whether these concerns have been addressed.

## Research Tasks

### 1. Standards Deep Dive
The document now includes a Prior Art Mapping section. Research each mapping for accuracy:

**OpenTelemetry GenAI Semantic Conventions:**
- The document claims its event architecture is "designed to emit OTel-compatible spans enriched with governance-specific attributes." Research the current state of OTel GenAI semantic conventions (March 2026). Are the claimed extensions (ring-level events, gate decisions, trust level changes) compatible with the OTel data model? Or would they require OTel-incompatible extensions?
- Research: Has the OTel GenAI SIG published any agent-specific semantic conventions beyond create_agent / invoke_agent / execute_tool? Any conventions for governance, policy, or trust telemetry?

**NIST:**
- The document maps to NIST AI RMF 1.0 functions (GOVERN, MAP, MEASURE, MANAGE). Research: Has NIST published any agent-specific guidance since the February 2026 CAISI RFI? Any updates to AI 600-1 that affect the mapping?
- Research the NIST NCCoE agent identity concept paper — has it progressed from draft? Any new recommendations that the framework should integrate?

**ISO/IEC:**
- The document references ISO 42001 briefly. Research: What specific ISO 42001 requirements map to the framework's capabilities? Is there a more detailed mapping possible?
- Research: Has IEEE P2863 (organizational requirements for AI) progressed? Any new publications?

**CSA:**
- The document maps all 5 CSA ATF domains to the three-level security model. Research: Has the CSA published any updates or companion documents to the ATF since February 2026?
- Research: Has the MAESTRO threat modeling framework been updated? Any new threat categories relevant to the framework?

### 2. Deployment Modes Research Validation
Your Round 1 flagged the "sequential bottleneck." The document now has three deployment modes. Research:

- **Which deployed agent frameworks** currently implement each mode?
  - Wrapper mode → which frameworks?
  - Middleware/interrupt mode → LangGraph interrupts? OpenAI Agents SDK hooks? Others?
  - Graph-embedded mode → any framework implementing concurrent governance?
- **Is the mode selection matrix empirically grounded?** Research whether the system characteristics (output type, latency tolerance, governance intensity) actually predict which mode deployed systems use.
- **Speculative execution in graph-embedded mode** — the document describes Ring 0 producing optimistically while Ring 1 verifies in parallel. Research: Is this pattern deployed anywhere? What are the known failure modes?

### 3. Security Architecture Cross-Reference
The three-level security model claims alignment with multiple security frameworks. Research each:

- **NIST SP 800-207 (Zero Trust)** — does the fabric-everywhere pattern genuinely implement zero trust, or is it using the term loosely? Compare to how NIST defines Policy Decision Points (PDP) and Policy Enforcement Points (PEP). Does Fabric = PEP and Governance = PDP?
- **SAGA (ACM CCS 2025)** — the document claims alignment with SAGA's per-interaction cryptographic access control. Research the SAGA paper. Is the alignment accurate? What SAGA capabilities are NOT covered by the framework?
- **SentinelAgent** — the document claims alignment with SentinelAgent's dynamic execution graph analysis. Research: Does SentinelAgent's architecture actually map to Security Intelligence as described?
- **AgentSpec (ICSE 2026)** — the document claims alignment with AgentSpec for policy-as-code. Research: How does AgentSpec's DSL compare to the framework's Policy as Code primitive? Is the alignment genuine or superficial?

### 4. Round 1 Response Assessment
Assess whether your Round 1 concerns were addressed:

- **DELEGATE/ESCALATE_TO_PEER signal** → DELEGATE added to composability interface
- **Determinism spectrum** → mentioned in Open Questions
- **Dynamic capability assessment** → not present
- **Control plane vs data plane separation** → implicit in #18
- **Standards alignment** → Prior Art Mapping section added
- **"Theoretical brochure" critique** → reframed as synthesis framework with prior art mapping

For each: Was the response substantive or cosmetic?

### 5. Academic Research Validation
The document references several academic papers. Research and verify:

- **DeepMind "Intelligent AI Delegation" (Feb 2026)** — verify the 9-component, 11-axis claims. Is the framework's mapping accurate?
- **Anthropic "Measuring AI Agent Autonomy" (Feb 2026)** — verify the 20%→40% auto-approval, 0.8% irreversible, 73% HITL claims. Are these accurately represented?
- **MAST multi-agent failure study (NeurIPS 2025)** — verify the 41-86.7% failure rates, 14 failure modes, 36.9% inter-agent misalignment claims.
- **AgentGuard (ASE 2025)** — verify the probabilistic runtime verification claims.
- **Research published since February 2026** — any new papers on agent governance, trust calibration, multi-agent safety, or runtime verification that the framework should cite?

### 6. Gap Analysis
Given your deep research:

- **What standards or frameworks does the document claim to integrate but actually only superficially references?**
- **What deployed governance systems exist that the document doesn't acknowledge?**
- **Where does the framework make claims that current research contradicts?**
- **What would need to change for this framework to serve as input to an actual standards body (e.g., NIST, ISO)?**

## Output Format

Structure your research report as:
1. **Standards Alignment Audit** — each standard assessed for mapping accuracy
2. **Deployment Modes Empirical Validation** — research-backed assessment of each mode
3. **Security Architecture Cross-Reference** — paper-by-paper validation
4. **Round 1 Response Scorecard**
5. **Academic Citation Verification** — accuracy of each referenced paper
6. **Research Gaps** — new papers/frameworks to incorporate
7. **Standards Body Readiness Assessment** — what would need to change for formal submission
8. **Top 5 Research-Backed Recommendations**
```
