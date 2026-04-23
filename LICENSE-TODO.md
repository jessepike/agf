# LICENSE Decision Needed

**Priority:** Required before external contributors are onboarded.  
**Decision owner:** Jesse Pike.  
**Target:** Decide before v0.3 or the first external contributor PR, whichever comes first.

---

## Current State

The repo has a `LICENSE` file with **CC BY 4.0** language. This was set early and may or may not reflect a deliberate choice. Confirm this is intentional before contributors rely on it.

---

## Options

### Option A: CC-BY-4.0 (current)

Creative Commons Attribution 4.0 International.

**Pros:**
- Maximum reach — anyone can use, adapt, and redistribute with attribution.
- Standard for open frameworks and documentation (Creative Commons Creative Commons).
- No copyleft — commercial use, proprietary derivatives, closed adaptations all allowed.
- Familiar to governance practitioners who license frameworks this way.

**Cons:**
- Derivatives can be fully closed/proprietary. Someone can take AGF, brand it, sell it, and owe you only a citation.
- No mechanism to require derivative frameworks to remain open.

**Best if:** Broad adoption is the primary goal. You want AGF language and primitives embedded in commercial products, standards bodies, and enterprise frameworks without friction.

---

### Option B: CC-BY-SA-4.0

Creative Commons Attribution-ShareAlike 4.0 International.

**Pros:**
- Share-alike clause: derivatives and adaptations must also be licensed under CC-BY-SA-4.0.
- Reinforces an open-commons model — contributes to the commons, stays in the commons.
- Stronger alignment signal for a "public interest" governance framework.

**Cons:**
- Limits commercial reuse — corporate adopters building proprietary governance products may balk.
- Possible friction for standards bodies that cannot accept viral licensing.
- "Attribution-ShareAlike" is unfamiliar to non-software practitioners (copyleft connotations).

**Best if:** You want to prevent closed commercial forks and signal that AGF is a community commons.

---

### Option C: Apache-2.0

**Pros:**
- Software-world default for open source; well-understood by engineers.
- Permissive with explicit patent grant — attractive for code-heavy derivative work.

**Cons:**
- Designed for software, not documentation or governance frameworks. Awkward fit.
- "What does 'derived work' mean for a governance framework?" is an open legal question under Apache-2.0.
- May confuse practitioners expecting a Creative Commons license for a doc-forward framework.

**Best if:** AGF evolves into a code-heavy tool (schemas, validators, scoring engines) and you want the broadest software ecosystem compatibility.

---

## Recommendation (factual, not directional)

Most peer governance frameworks that prioritize adoption (NIST profiles, OWASP, CSA ATF) use permissive or no-copyleft terms. CC-BY-4.0 is the most common for documentation frameworks where adoption breadth matters more than open-commons purity.

**This is Jesse's decision.** Do not proceed with external contributor onboarding until the license choice is confirmed and the `LICENSE` file reflects it.

---

## Action

When you've decided:
1. Confirm or replace `LICENSE` with the appropriate text.
2. Add a brief `LICENSE-RATIONALE` note to `GOVERNANCE.md` (optional but useful for future contributors).
3. Delete or archive this file.
