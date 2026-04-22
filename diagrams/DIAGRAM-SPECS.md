# Diagram Specifications

Specs for diagrams generated via Diagram Forge. Use these prompts to reproduce or iterate.

## Style Guide

- Light theme (white background, pastel ring colors)
- Ring 0: light blue, Ring 1: light green, Ring 2: light yellow, Ring 3: light purple
- Security/Fabric: dark navy, Accent: red, Neutral: white/light gray
- Clean sans-serif fonts, generous whitespace
- Match existing diagrams in diagrams/ directory

---

## Macro Positioning Diagrams (2026-04-21)

Three high-altitude visuals supporting AGF's v1.0 positioning (DECISIONS #3–#7). Campaign-03-ready. Generated via diagram-forge MCP, provider OpenAI, model `gpt-image-2-2026-04-21`, quality `medium`.

### seven-layer-landscape-stack.png

**Purpose:** Landscape positioning — where AGF fits among other frameworks. Supports DECISIONS #4.
**Diagram type:** `generic` · **Aspect:** 4:3 · **Resolution:** 2K

**Prompt:**

```
Title (top of canvas, bold sans-serif): "The Agentic Governance Landscape — Where AGF Fits"
Caption (small, italic, below title): "AGF as architectural substrate and unifying frame for the landscape"

Compose the diagram as a single LARGE ROUNDED-RECTANGLE OUTER CONTAINER that occupies most of the canvas. The outer container has a prominent deep-teal border (2–3px) and a very subtle teal tint on its background. The outer container is visibly LABELED at the top edge with a dark banner:
"AGF — Agentic Governance Framework   ·   Architectural substrate · 19 primitives · Rings 0–3 · Capability layers"

INSIDE THE OUTER CONTAINER, compose the following:

LEFT/CENTER REGION (80% of interior width) — five stacked horizontal layer bands, each labeled with a layer-number badge (L1–L5) on the left, a layer role in bold, and the frameworks/specs below:

L5 (TOP of interior stack, pastel lavender):
"Microsoft AGT  ·  CAF  ·  Agent 365"
subtitle: "Runtime reference"

L4 (pastel blue):
"CSA Agentic Trust Framework (ATF)"
subtitle: "Operating model"

L3 (pastel mint):
"Control Catalogs — CSA AICM  ·  ISO 42001/27001  ·  NIST 800-53  ·  EU AI Act  ·  BSI AIC4"
subtitle: "Controls"

L2 (pastel peach):
"CSA MAESTRO  ·  Microsoft Failure Mode Taxonomy"
subtitle: "Threat modeling"

L1 (BOTTOM of interior stack, light sand/cream):
"OWASP Agentic Top 10"
subtitle: "Threat baseline"

RIGHT REGION (20% of interior width) — a full-interior-height vertical sidebar in warm neutral gray (inside the outer container) with vertical text:
"Risk Quantification"
"FAIR  ·  FAIR-CAM  ·  ISO 31000  ·  NIST AI RMF Measure"
small subtitle: "Orthogonal — integrates via AGF Decision Intelligence"

FOOTER CAPTION (small italic, BELOW the outer container, on the white canvas):
"AGF primitives crosswalk to Layer 3 catalogs — AGF does not replicate catalog content."

STYLE: Light theme, clean white canvas background. The outer container's deep-teal border + labeled banner makes clear that AGF encloses and frames the entire landscape. Interior layer bands are rounded rectangles with soft fills in the colors specified above. Layer badges (L1–L5) as dark circular chips on the left edge of each band. Sans-serif typography throughout, generous whitespace, no decorative illustrations. DO NOT add any color-key legend box — the diagram is self-labeling.
```

### four-verbs-invariants.png

**Purpose:** How AGF works — four-verb causal flow + universal requirements on every primitive. Supports DECISIONS #3 (pillars #2, #3, #4) and #5.
**Diagram type:** `infographic` · **Aspect:** 16:9 · **Resolution:** 2K

**Prompt:**

```
Title (top, bold sans-serif, large): "How AGF Works"

A conceptual infographic showing AGF's four-verb causal flow, and the two universal requirements that bind every primitive.

TOP REGION — FOUR CIRCULAR NODES IN A HORIZONTAL ROW, connected by clean right-arrows between them. Each circle is a large perfect circle (not an oval, not a rounded rectangle — a true circle). Inside each circle: a small numbered badge at the top ("01"–"04") and the verb name centered in bold. Below each circle (outside the shape, on the canvas): a 1–2 line descriptive caption.

Circle 01 — SYNTHESIZE (deep teal fill, white text)
caption below: "Harmonizes NIST AI RMF, OWASP, CSA, ISO, EU AI Act, OTel, academic research into one vocabulary"

Circle 02 — UNIFY (teal-blue fill, white text)
caption below: "Collapses fragmented standards into one coherent reference architecture"

Circle 03 — PRESCRIBE (muted gold fill, white text)
caption below: "Names specific patterns — 19 primitives, Rings 0–3, composability interface"

Circle 04 — OPERATIONALIZE (coral-red fill, white text)
caption below: "Translates patterns into runnable controls across wire-speed, near-realtime, and human-speed tempos"

BOTTOM REGION — a grouped block of three stacked horizontal bands, visually framed together to read as one unified requirement block:

TOP BAND of the block — thin, deep-navy fill with light/white text, all-caps label, functions as a SHARED HEADER for the two bands beneath:
"EVERY AGF PRIMITIVE MUST:"

MIDDLE BAND — full-width, slightly larger height than the header, light-gray or off-white fill with dark-navy text. Left side has a bold "BE:" tag, then the four properties separated by interpuncts:
"BE:   Observable   ·   Traceable   ·   Auditable   ·   Agent-operable"

BOTTOM BAND — identical styling to the MIDDLE BAND (same fill, same height, same type treatment — visually clearly a peer). Left side has a bold "PRODUCE:" tag, then the dual-form requirement:
"PRODUCE:   output in both human-readable and machine-readable forms — simultaneously"

The three bands share the same left and right edges and are stacked with minimal gap between them, so they read as ONE bracketed requirement block rather than three separate claims. The top (navy) band is visually the "header" of the block; the two lower bands are the peer requirements.

STYLE: Light theme, clean white background, sans-serif typography, generous whitespace. Four verb circles sized large enough that the verb name is legible but circles remain circles (avoid ovals). Arrows between circles are thin and clean. Captions beneath circles in dark gray, centered under each circle, smaller type than the verb label. The two peer bands (MIDDLE + BOTTOM) are visually IDENTICAL in styling to emphasize they are peer requirements under the shared navy header. NO sidebar. NO color-key legend. NO additional callouts.
```

### reference-architecture-macro.png

**Purpose:** AGF's internal structure — four concentric rings + cross-cutting capability layers + NIST CSF analogy. Supports DECISIONS #3 (pillar #6 — CSF parallel).
**Diagram type:** `generic` · **Aspect:** 16:9 · **Resolution:** 2K

**Prompt:**

```
Title (top, bold sans-serif): "AGF Reference Architecture — Macro View"
Subtitle (small, italic, below title): "19 primitives across 4 concentric rings, cut across by 2 capability dimensions, anchored by a three-level security model"

LEFT REGION (approx 60% of canvas width) — the primary visual, centered in its region.

Draw FOUR CONCENTRIC RINGS (perfect circles, nested). From the innermost to the outermost:

INNERMOST ring (solid-filled disc at the center, pastel blue) —
Label on the ring: "Ring 0 — EXECUTION"
Small secondary label inside: "Where agents act"
Badge: "7 primitives"

Second ring band (pastel green, surrounding the blue core) —
Label on the ring band: "Ring 1 — VERIFICATION"
Small secondary label: "Where actions are checked"
Badge: "4 primitives"

Third ring band (pastel yellow) —
Label: "Ring 2 — GOVERNANCE"
Small secondary label: "Where oversight lives"
Badge: "4 primitives"

OUTERMOST ring band (pastel lavender) —
Label: "Ring 3 — LEARNING"
Small secondary label: "Where the system improves"
Badge: "2 primitives"

CROSS-CUTTING RADIAL SECTORS — render TWO wedge/pie-slice sectors that cut radially through ALL FOUR rings from the center to the outer perimeter. The sectors are rendered as semi-transparent overlays (so the ring colors beneath remain visible) with a distinct tint each:

LEFT radial sector (pointing due west / 9 o'clock position, roughly 40–50° arc wide, semi-transparent mint/teal overlay):
Label at the outer perimeter of the sector (readable, horizontal): "AGENTIC OBSERVABILITY"
Small secondary: "event streams · traceability · detection"

RIGHT radial sector (pointing due east / 3 o'clock position, roughly 40–50° arc wide, semi-transparent pink/lavender overlay):
Label at outer perimeter: "DECISION INTELLIGENCE"
Small secondary: "belief · evidence · policy evaluation"

Both sectors visibly CUT THROUGH all four rings — this is the key visual metaphor.

RIGHT COLUMN (approx 35–40% of canvas width, stacked vertically):

Top card — NIST CSF PARALLEL callout (light-gray-bordered box):
Bold label: "NIST CSF PARALLEL"
Body text: "Rings are to agentic governance what CSF Functions are to cybersecurity"

Middle card — PRIMITIVES LEGEND (grouped by ring, compact):
Header: "19 Primitives"

Ring 0 (blue color dot): Identity · Capabilities · Context · Memory · Tool Use · Action · Communication
Ring 1 (green color dot): Governance Gates · Policy Engine · Evidence · Trust Ladders
Ring 2 (yellow color dot): Decision Records · Audit Trail · Incident Response · Agent SRE
Ring 3 (lavender color dot): Feedback · Evolution

BOTTOM OF CANVAS (full width, two stacked thin bands):

Upper thin band (gray): "Substrate:  Lifecycle (#18)   ·   Substrate (#19)"
Lower thin band (dark navy fill, white text): "Three-Level Security Model:   Fabric   ·   Governance   ·   Intelligence    —    via Security Response Bus"

STYLE: Light theme, clean white background, sans-serif typography throughout, generous whitespace. Ring colors: Ring 0 pastel blue, Ring 1 pastel green, Ring 2 pastel yellow, Ring 3 pastel lavender. Radial cross-cutting sectors in semi-transparent tints so the ring colors remain visible beneath them. No color-key legend panel anywhere — the diagram is fully self-labeling. Do NOT render any generic "Governance/Alignment/Health" auto-legend.
```

---

## Older Specs (2026-03-18) — status and drift

The following diagrams were originally specced 2026-03-18. Check `diagrams/` for current state — several have been generated since this list was written.

1. **ring-interface-composability.png** — Composability Interface signal protocol (PASS/REVISE/HALT/GATE/DELEGATE/ERROR), signal restrictions per ring, execution budgets, REVISE transaction semantics
2. **implementation-phases-roadmap.png** — 5-phase progressive roadmap: MVC → Verification → Governance → Security → Learning, with primitives per phase, ring activation, value delivery
3. **event-flow-observability-architecture.png** — Event stream from all rings → 3 detection domains → Correlation Engine → dual-speed paths (sentinels + analysis) → response actions
4. **security-response-bus.png** — Normal path (Intelligence→Governance→Fabric) vs fast path (Intelligence→[pre-authorized]→Fabric, governance notified post-facto)
5. **belief-revision-cascade.png** — New evidence → claims updated → beliefs re-evaluated → policy tests re-run → decision options re-evaluated → review trigger
6. **decision-intelligence-multi-agent-pipeline.png** — 9 agents across rings (Intake→Entity→Evidence→Claim→Challenger→Belief Manager→Policy→Recommendation→Memo)
