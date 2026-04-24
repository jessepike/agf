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

## Rings Model — Canonical (2026-04-22)

Canonical rings-model diagram shown on the site and referenced across canonical docs. Iterated v1 → v6; v6 selected 2026-04-24 after side-by-side comparison.

### rings-model-governed-agentic-systems.png

**Purpose:** Canonical Rings Model visualization — 4 concentric rings with primitive placement, Cross-Cutting Fabric + Zero Trust Overlay sidebars, Ring Signals, Time Horizons, and an Outside-Pipeline block for #18/#19. Referenced from homepage, `/docs/reference/rings-model`, and `/docs/overview/core-concepts`.
**Diagram type:** `architecture` · **Aspect:** 16:9 · **Resolution:** 2K
**Provider:** OpenAI · **Model:** `gpt-image-2-2026-04-21` · **Quality:** high · **Temperature:** 0.2
**Iteration history:** v1 (committed 2026-03-16), superseded 2026-04-24 by v6. v6 was generated fresh (not an edit) on 2026-04-22 19:13 PDT after five prior iterations (v2 generate, v3 generate, v4/v5 edit attempts) that each mis-placed the Adversarial Critique primitive across Ring 1 / Ring 2 boundary. v6 resolved placement by explicitly constraining band thickness and border-color matching rules.

**Prompt:**

```
Technical architecture diagram titled "The Rings Model — Governed Agentic Systems" in large bold black sans-serif at top center. White background. Professional, publication-ready. All text crystal clear, perfectly legible, no blurring.

LAYOUT: Four concentric rings centered. CRITICAL — each ring must be a WIDE band with enough radial thickness to fully contain primitive boxes inside it. Primitive boxes MUST sit entirely within their assigned ring band, with a colored border that exactly matches that band's color.

RING BANDS (inside out) — make each band THICK enough to hold a full-sized box:
- Ring 0 Execution: innermost filled circle, soft light BLUE fill. Contains 5 boxes.
- Ring 1 Verification: green band wrapping Ring 0, soft light GREEN fill. Must be thick. Contains 3 boxes.
- Ring 2 Governance: yellow band wrapping Ring 1, soft light YELLOW/GOLD fill. Must be thick. Contains 5 boxes.
- Ring 3 Learning: lavender band wrapping Ring 2, soft LIGHT PURPLE fill. Contains 3 boxes.

RING LABELS — bold black text at the TOP arc of each band:
"Ring 0 — Execution" / "Ring 1 — Verification" / "Ring 2 — Governance" / "Ring 3 — Learning"

PRIMITIVE BOXES — white-fill rounded rectangles with a 3px colored border. The border color MUST match the ring band the box sits in.

RING 0 BOXES (BLUE 3px border, sitting fully inside the blue inner circle):
- "Structured Output #5" upper-left
- "Bounded Agency #7" upper-right
- "Identity #14" middle-left
- "Error Handling #13" middle-right
- "Transaction Control #16" bottom center

RING 1 BOXES (GREEN 3px border, sitting FULLY INSIDE THE GREEN BAND — do not place in the yellow band, do not cross into yellow):
- "Validation Loops #2" at the 9 o'clock position, inside the green band
- "Adversarial Critique #4" at the 3 o'clock position, inside the green band, MIRROR OF #2
- "Producer/Verifier Separation #1" at the 6 o'clock position, inside the green band

RING 2 BOXES (YELLOW/GOLD 3px border, sitting fully inside the yellow band):
- "Governance Gates #8" at 10 o'clock
- "Provenance Chains #6" at 2 o'clock
- "Policy as Code #9" at 4 o'clock
- "Data Governance #17" at 5 o'clock
- "Transaction Control #16" at 7 o'clock (dual-placement with Ring 0)

RING 3 BOXES (PURPLE 3px border, sitting fully inside the lavender band, may extend slightly outside the outermost edge):
- "Trust Ladders #11" at 9 o'clock
- "Memory-Augmented Reasoning #12" at 3 o'clock
- "Self-Improving Cycles #3" at 7 o'clock

CURVED FEEDBACK ARROWS: Two thin black curved arrows between Ring 0 and Ring 1 — one showing REVISE flowing inward, one showing PASS flowing outward. Small label "REVISE" and "PASS".

LEFT SIDEBAR (white rounded rectangle panel with thin gray border):
Heading "Cross-Cutting Fabric" (large bold)
- ⇌ Events Bus (#10)
- ▦ Structured Output (#5)
- ↻ Error Recovery (#13)
- 🛡 Adversarial Robustness (#15)

Heading "Zero Trust Overlay" (large bold, below)
- Identity Verification (#14)
- Least Privilege (#7)
- Audit Trail (#6)

RIGHT SIDEBAR (white rounded rectangle panel with thin gray border):
Heading "Ring Signals" (large bold) — each with a colored dot:
- 🟢 PASS — forward
- 🟡 REVISE quality — re-produce
- 🟠 REVISE context — re-execute
- 🔴 HALT — escalate
- 🔵 GATE — authorize
- ⚫ ERROR — recover

Heading "Time Horizons" (large bold, below):
- Ring 0: Per-task (milliseconds)
- Ring 1: Per-output (seconds)
- Ring 2: Per-decision (minutes-hours)
- Ring 3: Per-pattern (days-weeks) + sentinels

Heading "Outside Pipeline" (large bold, below):
- #18 Evaluation & Assurance — pre-deploy gate
- #19 Agent Environment Governance — substrate

BOTTOM BAR: Full-width light gray rounded rectangle.
Line 1 centered small gray: "Cross-Cutting Fabric Layer"
Line 2 centered large bold black: "Events + Structured Output + Error Recovery + Adversarial Robustness + Zero Trust Identity"

STYLE: Clean modern sans-serif. Flat colors. No gradients. Thin subtle shadows on boxes. High contrast black text on white box fills. Publication quality.
```

---

## Older Specs (2026-03-18) — status and drift

The following diagrams were originally specced 2026-03-18. Check `diagrams/` for current state — several have been generated since this list was written.

1. **ring-interface-composability.png** — Composability Interface signal protocol (PASS/REVISE/HALT/GATE/DELEGATE/ERROR), signal restrictions per ring, execution budgets, REVISE transaction semantics
2. **implementation-phases-roadmap.png** — 5-phase progressive roadmap: MVC → Verification → Governance → Security → Learning, with primitives per phase, ring activation, value delivery. **SUPERSEDED by DECISIONS.md #10 (a) / Cohesion Pass v0.3 (2026-04-24)** — "phases" vocabulary retired in favor of 4 composition patterns + hardening posture modifier. Removed from `overview/composition-patterns.mdx`; still referenced on `profiles/ai-engineering.mdx` (profile-page pass queued in BACKLOG). Regeneration candidate: a "4-pattern progression" diagram matching the canonical pattern names.
3. **event-flow-observability-architecture.png** — Event stream from all rings → 3 detection domains → Correlation Engine → dual-speed paths (sentinels + analysis) → response actions
4. **security-response-bus.png** — Normal path (Intelligence→Governance→Fabric) vs fast path (Intelligence→[pre-authorized]→Fabric, governance notified post-facto)
5. **belief-revision-cascade.png** — New evidence → claims updated → beliefs re-evaluated → policy tests re-run → decision options re-evaluated → review trigger
6. **decision-intelligence-multi-agent-pipeline.png** — 9 agents across rings (Intake→Entity→Evidence→Claim→Challenger→Belief Manager→Policy→Recommendation→Memo)
