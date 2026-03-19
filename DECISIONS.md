# Decision Log

Captures terminology, structural, and positioning decisions with rationale. Intended to survive across sessions so future contributors understand *why* choices were made.

| # | Date | Decision | Rationale | Alternatives Considered |
|---|------|----------|-----------|------------------------|
| 1 | 2026-03-19 | Replace "reliable" with "durable" in the five system properties (safe, secure, durable, auditable, observable) | "Reliable" is generic — every framework claims it. "Durable" adds a distinct architectural property: systems that survive failures, maintain state across interruptions, and preserve governance guarantees over time. The term resonates with the practitioner audience who understands durable execution. | Keep "reliable" (defensible but weak); drop to four properties (tighter but loses a real concern); "accountable" (human property, not a system property — mismatch in a list describing system characteristics) |
| 2 | 2026-03-19 | Replace "prior art" with "existing work" throughout core docs | "Prior art" is patent/legal jargon that creates unnecessary friction for non-academic readers. "Existing work" is immediately clear to any audience — security practitioners, compliance teams, executives, engineers. | "Foundations" (good but implies hierarchy); "related work" (academic convention, same jargon problem); "building blocks" (too informal for framework tone) |
