# AGENTS.md — AGF Operational Contract

**Project:** Agentic Governance Framework
**Last updated:** 2026-03-18

---

## Agent Operating Rules

### All Agents

1. **Read `intent.md` and `BACKLOG.md` before doing any work.** Intent is the North Star. Backlog is the work queue.
2. **Check `inbox/` on session start.** If artifacts exist, triage before other work.
3. **Never edit `intent.md` without explicit human approval.** It is sacred.
4. **Use confidence levels** (Established pattern / Informed proposal / Open question) when adding new claims to any concept doc.
5. **Maintain synthesis positioning.** This framework connects dots from existing standards — it does not invent new governance concepts. Lead with humility.
6. **Update timestamps** on any concept doc you substantively modify (`Last updated:` in frontmatter).
7. **Cross-reference integrity.** Observability and Decision Intelligence docs reference primitives by number (#1-#18). If you add, remove, or renumber primitives, update all downstream docs.
8. **Commit at meaningful milestones.** Use conventional commits: `type(scope): description`. Types: `content`, `research`, `review`, `structure`, `meta`.

### Inbox Triage Protocol

When items exist in `inbox/`:

1. Read each artifact
2. Extract actionable findings — add to `BACKLOG.md` under the appropriate priority section
3. Extract content that should be integrated — note which concept doc and section
4. Move processed artifacts to `.archive/`
5. Delete artifacts with no lasting value

### Validation Before Commit

- Verify all markdown links resolve
- Verify primitive numbers (#1-#18) are consistent across docs
- Verify `Last updated` dates reflect actual changes
- No broken table formatting

---

## Agent Roles

### CPO (Primary Operator)

**Owns:** Product direction, content development, review cycles, backlog prioritization, publication pipeline, naming decisions.

**Typical tasks:**
- Writing and revising concept doc sections
- Processing external review feedback
- Running new external review cycles
- Backlog triage and prioritization
- Publication pipeline (white papers, posts)
- Strategic positioning updates

**Context to load:** `intent.md` (always), `BACKLOG.md` (always), `strategic-positioning.md` (when writing/revising content)

### CTO (Advisory)

**Owns:** Architecture reviews, technology evaluations, cross-system integration design, responsibility matrices, deployment mode analysis.

**Typical tasks:**
- Responsibility assignment matrix (OWASP threats → primitives → security levels)
- MCP/A2A protocol integration into deployment modes
- #18 taxonomy resolution (design-time vs. runtime)
- Cross-concept coherence reviews
- Technology landscape scans

**Context to load:** `intent.md` (always), `BACKLOG.md` (always), grep relevant sections of `agentic-primitives.md`

### Codex (Implementation)

**Owns:** Executing well-specified tasks from specs or backlog items. Does not make architectural decisions.

**Operating constraints:**
- Work only from explicit specs or clearly scoped backlog items
- Do not restructure documents without a spec
- Do not add new primitives or change the Rings Model
- Do not edit `intent.md` or `strategic-positioning.md`
- Flag ambiguity — stop and ask rather than guess
- Commit each completed task separately

**Typical tasks:**
- Adding a specific section to a concept doc (from spec)
- Updating cross-references when primitive count changes
- Formatting fixes, table corrections, link repairs
- Moving items between inbox and archive
- Mechanical updates (date stamps, TOC regeneration)

**Context to load:** `BACKLOG.md` (always), the specific concept doc being modified

---

## Commit Convention

```
type(scope): description

Types:
  content    — concept doc additions or revisions
  research   — landscape research, prior art additions
  review     — external review processing, findings integration
  structure  — directory changes, file reorganization
  meta       — CLAUDE.md, AGENTS.md, BACKLOG.md, tooling

Scopes:
  primitives, observability, decision-intel, framework,
  positioning, backlog, inbox, diagrams
```

Examples:
- `content(primitives): add responsibility assignment matrix`
- `review(backlog): triage round 2 inbox items`
- `meta(agents): add codex operating constraints`
- `research(primitives): integrate NIST NCCoE identity protocols`
