# AGF Publication Map

**Last updated:** 2026-04-21

How all AGF artifacts relate, link to each other, and should be packaged for publication.

---

## Document Hierarchy

```
AGF: A Reference Architecture for Governed Agentic Systems
(docs/agf-reference-architecture.md)
│
│  THE ENTRY POINT — routes readers to everything else
│
├── Domain Profiles (profiles/)
│   ├── Security Profile ─────── For CISOs, security architects
│   ├── Platform Profile ─────── For platform engineers
│   ├── GRC Profile ──────────── For compliance officers, auditors
│   ├── AI Engineering Profile ── For AI engineers, agent developers
│   └── Observability Profile ── For SREs, detection engineers
│
├── Concept Docs (docs/)
│   ├── Agentic Primitives ───── Foundation: 19 patterns, Rings, security, tensions
│   ├── Agentic Observability ── Capability layer: SIEM for agents
│   └── Decision Intelligence ── Capability layer: governed decision flows
│
├── White Papers (docs/white-papers/)
│   ├── Trust Ladders ────────── How agents earn autonomy
│   └── The Rings Model ─────── Concentric governance architecture
│
├── Supporting Docs (docs/)
│   ├── Relationship to Frameworks ── AGF's position in the governance landscape (7-layer stack)
│   ├── Governance Decision Record (GDR) ── Canonical audit artifact at gate boundaries (DECISIONS #9)
│   ├── Shared Vocabulary ────── Canonical terminology
│   ├── Cross-Concept Model ─── How DI, AO, and primitives relate
│   ├── Strategic Positioning ── Market landscape, differentiation
│   └── Governance Framework ── Top-level operating model (5 functions)
│
├── Schemas (docs/schemas/)
│   └── gdr.yaml ────────────── JSON Schema for Governance Decision Records
│
├── Diagrams (diagrams/)
│   └── 24 PNG architecture diagrams
│
└── Intent (intent.md)
    └── North Star — never auto-edited
```

---

## Reader Navigation Paths

### Path A: "I need to govern my agentic systems"

1. **Start:** Meta doc (agf-reference-architecture.md) — understand the architecture
2. **Route:** "Who Uses What" section → pick your profile
3. **Deep dive:** Profile links to primitives doc for full detail
4. **White papers:** Trust Ladders and Rings Model for specific topics

### Path B: "I need to prove compliance"

1. **Start:** GRC Profile — regulatory mappings, crosswalks, maturity model
2. **Reference:** Control crosswalk table → map to your existing controls
3. **Evidence:** Evidence generation table → what each primitive produces
4. **Foundation:** Meta doc for the architecture overview

### Path C: "I need to secure my agents"

1. **Start:** Security Profile — threat analysis, MITRE ATLAS, red team scenarios
2. **Playbooks:** Incident response playbook structure
3. **Architecture:** Three-level security model → primitives doc for full detail
4. **Monitoring:** Observability Profile for detection and response

### Path D: "I want to implement governed agents"

1. **Start:** AI Engineering Profile — 5-phase implementation priority
2. **Phase 1:** Minimum Viable Control primitives
3. **Architecture:** Platform Profile for deployment topology
4. **Reference:** Primitives doc for full pattern detail

### Path E: "I'm evaluating this framework"

1. **Start:** Meta doc — architecture overview, composition patterns, standards alignment
2. **Context:** Relationship to Frameworks — how AGF relates to NIST, OWASP, CSA, ISO, Microsoft AGT, FAIR, TOGAF, SABSA
3. **Depth:** White papers (Trust Ladders, Rings Model) for key concepts
4. **Credibility:** GRC Profile for regulatory rigor
5. **Positioning:** Strategic positioning doc for market context

---

## Link Integrity Matrix

Every document should link to:

| From | Must Link To | Status |
|------|-------------|--------|
| Meta doc | All 5 profiles (relative paths) | ✅ Done |
| Meta doc | All 3 concept docs | ✅ Done |
| Each profile | Meta doc (parent link) | ✅ Done |
| Each profile | Other relevant profiles (scope boundary refs) | ✅ Done |
| Each profile | Primitives doc or AI Eng profile for pattern detail | ✅ Done |
| Primitives doc | Meta doc + all 5 profiles + both capability docs | ✅ Done |
| Observability doc | Meta doc + Observability Profile + Primitives | ✅ Done |
| DI doc | Meta doc + Primitives + Observability doc | ✅ Done |
| Governance framework doc | Meta doc + Primitives + profiles directory | ✅ Done |
| White papers | Meta doc (footer) | ✅ Done |
| Shared vocabulary | Referenced from all docs (canonical terminology) | ⬜ Pending — add reference note to each doc |

---

## Publication Packaging Options

### Option 1: GitHub Repository (Open Source)

- Repository with README linking to meta doc
- docs/ and profiles/ directories as-is
- diagrams/ for visual assets
- Creative Commons or similar license
- **Pros:** Community contribution, discoverability, version control
- **Cons:** Raw markdown, no polished reading experience

### Option 2: Documentation Site (e.g., GeistDocs, Docusaurus, MkDocs)

- Meta doc as landing page
- Profiles as top-level sections
- Concept docs as deep-dive sections
- White papers as standalone pieces
- Search, navigation, mobile-friendly
- **Pros:** Professional presentation, searchable, good UX
- **Cons:** Build/hosting overhead

### Option 3: PDF White Paper Series

- Meta doc + each profile as standalone PDFs
- White papers as standalone PDFs
- Primitives doc as the comprehensive reference PDF
- **Pros:** Shareable, printable, professional
- **Cons:** No hyperlinking, harder to update

### Recommended: Option 1 + Option 2

GitHub repo for the source of truth + community contribution. Documentation site for the reading experience. Start with GitHub (already done), add the doc site when ready for public launch.

---

## Pre-Publication Checklist

### Content Complete

- [x] Meta doc (reference architecture)
- [x] 5 domain profiles (Security, Platform, GRC, AI Engineering, Observability)
- [x] Agentic Primitives (foundation — 3 rounds of review)
- [x] Agentic Observability (capability layer — internal review done)
- [x] Decision Intelligence (capability layer — internal review done)
- [x] Trust Ladders white paper
- [x] Rings Model white paper
- [x] Shared vocabulary
- [x] Cross-concept relationship model
- [x] Strategic positioning
- [x] Governance framework (operating model)
- [x] 21 architecture diagrams

### Review Complete

- [x] Primitives: 3 rounds external review
- [x] Profiles: 1 round external review (Claude, GPT, Gemini) + error fixes
- [x] Observability concept doc: 1 round external review + critical fixes (correlation rules, OTel, market context)
- [x] Decision Intelligence concept doc: 1 round external review + critical fixes (RDG, Belief Layer, pipeline)
- [x] White papers: internal review (Trust Ladders clean, Rings Model fixed)
- [x] Strategic review findings: 6 of 10 resolved, 4 deferred to post-publication

### Packaging

- [x] Cross-doc navigation links
- [x] Shared vocabulary reference in all doc headers
- [x] README.md for GitHub repo
- [x] LICENSE file (CC BY 4.0)
- [x] Final link audit (all relative paths verified)
- [x] Consistent formatting pass
- [ ] Publication site setup (GeistDocs or equivalent)

---

*This map is the packaging guide for AGF publication. It tracks what exists, how it connects, and what's needed before launch.*
