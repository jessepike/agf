# Contributing to AGF

Thank you for your interest in the Agentic Governance Framework. AGF is built on the principle that **community over credit** — if this framework helps one organization build a safer agentic system, it has served its purpose.

We welcome contributions of all kinds: challenges to our claims, evidence from real-world implementations, proposals for new patterns, and corrections to what we got wrong.

## How to Contribute

### Discussions

For open-ended dialogue, questions, and experience sharing, use [GitHub Discussions](https://github.com/jessepike/agf/discussions):

- **Challenge & Critique** — Where are we wrong? What are we overclaiming? What did we miss?
- **Evidence & Implementation** — Real-world experiences implementing these patterns. What worked, what didn't.
- **Questions** — How does X apply to my system? Which primitives should I start with?

### Issues

For specific, actionable items:

- A factual error in a standards mapping
- A broken link or missing reference
- A primitive description that is unclear or contradictory
- A regulatory mapping that is outdated

### Pull Requests

For direct content improvements:

1. Fork the repository
2. Create a branch (`content/fix-owasp-mapping`, `content/add-nist-reference`)
3. Make your changes to the **canonical source files** in `docs/`
4. Submit a pull request with a clear description of what you changed and why

## What's in Scope

| Directory | Contributions Welcome | Notes |
|-----------|----------------------|-------|
| `docs/` | Yes | Framework content — the canonical source files |
| `docs/profiles/` | Yes | Domain-specific profiles |
| `docs/white-papers/` | Yes | Deep-dive topics |
| `diagrams/` | Yes | Architecture diagrams |
| `agf-docs/` | Yes | Documentation site improvements |
| `intent.md` | Discussion only | The project philosophy. Propose changes via Discussion, not PR. |

## Content Guidelines

### Canonical Source Convention

The `docs/*.md` files are the **source of truth** for all framework content. The documentation site (`agf-docs/content/docs/*.mdx`) is derived from these files.

**If you're contributing content changes, edit the `docs/*.md` files.** The site MDX files will be updated to match.

### Voice and Tone

AGF has a specific voice:

- **Humility before authority.** We synthesize, we don't decree. Credit the work we build on.
- **Rigor before opinion.** Every claim should be grounded in evidence or clearly marked as a proposal.
- **Confidence levels.** Use them when adding new claims:
  - **Established pattern** — proven across multiple domains, strong evidence
  - **Informed proposal** — our best synthesis, open to challenge
  - **Open question** — we don't have great answers yet

### Standards References

When referencing existing work:
- Include specific document names and dates (not just organization names)
- Explain how the reference relates to AGF (not just that it exists)
- Prefer primary sources over summaries

### Cross-Reference Integrity

The framework documents reference each other by primitive number (#1-#19). If your change affects primitive numbering or naming, note which downstream documents need updates.

## Review Process

All contributions are reviewed by the maintainer. For framework content:

1. **Accuracy** — Is the claim correct? Is the standards mapping accurate?
2. **Voice** — Does it maintain AGF's synthesis positioning?
3. **Confidence** — Are new claims appropriately marked with confidence levels?
4. **Cross-references** — Does it maintain integrity with other documents?

## Code of Conduct

Be respectful, constructive, and specific. AGF deals with governance and safety — the community that builds it should reflect those values.

- Critique the ideas, not the people
- Back claims with evidence or clearly mark them as proposals
- Acknowledge what you don't know

## License

By contributing, you agree that your contributions will be licensed under the same terms as the project. See [LICENSE](LICENSE) for details.
