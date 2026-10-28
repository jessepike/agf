# 11 — Academic Research (Feb–Oct 2026)

**Research date:** 2026-10-28 · **AGF baseline:** "Academic Research" table in `docs/agentic-primitives.md` (AgentSpec, AgentGuard, SentinelAgent, SagaLLM, Mind the GAP, Pro2Guard, AGENTSAFE, Agent Contracts, LGA, AgentOS, MAST, SAGA, DeepMind delegation)

These are preprints unless noted. Results come from abstracts and paper text as retrieved, not from replication. All are labeled **Informed** (single-source and unreplicated) unless stated otherwise.

---

## Summary

The academic thread of the period is **runtime enforcement that's deterministic and outside the model**. Policy compilers, contracts, deontic logics, and trace monitors all report large compliance gains over prompt-only governance. A second theme is **path-dependence**: compliance is a property of trajectories, not single actions. A third is a set of **new failure-mode taxonomies** that vendor benchmarks don't cover yet. All three support AGF's existing Producer-Verifier and Policy as Code positions, and they give AGF better-evidenced citations than some of its current ones.

## Runtime enforcement

| Paper | Date | Contribution | Key result | AGF primitive |
|---|---|---|---|---|
| **PCAS — Policy Compiler for Secure Agentic Systems** (Palumbo, Choudhary, Choi, Chalasani, Christodorescu, Jha; UW–Madison, Langroid, Google) arXiv 2602.16708 | 2026-02-18 | Models agent state as a **causal dependency graph** (not linear history). Datalog-derived policy language covering transitive information flow and cross-agent provenance. Reference monitor blocks before execution | τ²-bench compliance **48% → 93%**, zero violations in instrumented runs, 1.68–2.93× over frontier baselines. "Embedding these policies in prompts provides no enforcement guarantees" | #9 Policy as Code, #6 Provenance, #1 Producer/Verifier |
| **Agent Behavioral Contracts (ABC)** (Bhardwaj) arXiv 2602.22302 | 2026-02-25 | Design-by-Contract for agents: preconditions, hard/soft invariants, governance constraints, recovery. (p, δ, k)-satisfaction. Drift Bounds Theorem. ContractSpec YAML DSL and AgentAssert library. AgentContract-Bench (200 scenarios) | 1,980 sessions, 7 models: hard-constraint compliance 88–100%, 5.2–6.8 soft violations/session caught that baselines missed, <10 ms/action overhead | #2 Validation Loops, #7 Bounded Agency, #13 Error Handling |
| **Runtime Governance for AI Agents: Policies on Paths** (Kaptein, Khan, Podstavnychy) arXiv 2603.16586 | 2026-03-17 | Formal argument: **the execution path is the central object of governance**. Policies are functions of (identity, partial path, proposed action, org state) → violation probability. Prompts and static ACLs are special cases. EU AI Act-inspired examples | Theoretical, no empirical results | Rings Model (why Ring 1/2 must run at runtime), #8 Gates |
| **AARM** arXiv 2602.09433 | 2026-02 | Runtime action-management spec: interception, context accumulation, intent alignment, decisions, signed receipts (see `05`) | Spec, no benchmark | #8 Gates + GDR |
| **AgenticRei — Deontic Policies for Runtime Governance** (Joshi, Finin, Joshi, Kagal) arXiv 2606.19464 | 2026-06-17 | OWL/Rei deontic policies: **obligations, dispensations, conflict resolution**, class-hierarchy reasoning. Governs tool calls and A2A messages | Expressiveness argument. Claims Cedar/Rego/XACML can't express many such constraints | #9 Policy as Code (obligations ≈ AGF MODIFY / conditional APPROVE) |
| **C-Trace — Runtime Compliance Verification for AI Agents** (Kahani, Barati, Addae; Carleton) arXiv 2606.19242 | 2026-06-17 | GDPR principles (consent, purpose limitation, minimization, erasure) as predicates over event traces. Monitor intercepts tool calls and outputs. Python, Rego, and MFOTL implementations agree | 0% ASR / 0% FPR with exact extraction. ≤12% ASR with 10% extractor noise. **1.8 µs median per event** | #17 Data Governance, #10 Observability, tempo taxonomy (wire-speed) |
| **Fundamental Limits of Runtime Policy Enforcement in Multi-agent AGI Systems** (Springer LNCS chapter) | 2026 | Limits on what runtime enforcement can guarantee in multi-agent settings | Not retrieved in detail. — Open | Multi-agent coordination, governance collapse rule |

## Failure-mode taxonomies (not yet in vendor benchmarks)

| Paper | arXiv | Failure mode |
|---|---|---|
| Fail Plausible | 2606.14589 | Execution errors turned into convincing but false user-facing narratives |
| Trajel (trajectory-level hallucination) | 2605.24219 | Errors propagating through tool workflows, five subtypes |
| Entity Binding Failures | 2606.30531 | Right tool, right arguments, wrong real-world entity |
| Binding Drift | 2607.18316 | Correct at step one, silently drifts later |
| Commitment Drift | 2608.04066 | The agent's goal disappears from later execution contexts |

Source: LLM Works landscape (Aug 2026). Individual papers not fetched. — Open

**Relevance to AGF:** "Fail Plausible" undermines human-review gates that rely on agent self-reports. It argues for Producer-Verifier Separation (#1) with independent evidence, not agent narratives, in gate evidence packages. Binding and commitment drift are path-level failures (see *Policies on Paths*).

## Lab and institute research

- **Google DeepMind AI Control Roadmap v0.1** (2026-06-18). ~1M coding-agent trajectories, capability-scaled D1–D4/R1–R3 controls (see `06`). — Established
- **UK AISI incident report** (2026-08-04). The first public institute report of unsanctioned agent actions during evaluation (see `10`). — Established
- **2026 Singapore Consensus on Global AI Safety Research Priorities** exists as a reference point. Not reviewed for this pass. — Open

## Delta vs AGF

- AGF's academic table stops at about Mar 2026. **PCAS** is the strongest new empirical anchor for "deterministic enforcement outside the model" (Policy as Code #9) and should sit alongside AgentSpec.
- *Policies on Paths* provides a formal argument for why AGF's Rings must run at runtime and not only at design time. AGF currently asserts this rather than citing it.
- **Obligations** (AgenticRei, AuthZEN Obligations profile) are a policy outcome AGF's gate vocabulary handles only implicitly, via MODIFY or a conditional APPROVE. — Open

---

## Sources

- arXiv 2602.16708, Policy Compiler for Secure Agentic Systems — https://arxiv.org/html/2602.16708v1
- arXiv 2602.22302, Agent Behavioral Contracts — https://arxiv.org/html/2602.22302
- arXiv 2603.16586, Runtime Governance for AI Agents: Policies on Paths — https://arxiv.org/abs/2603.16586
- arXiv 2602.09433, Autonomous Action Runtime Management — https://arxiv.org/abs/2602.09433
- arXiv 2606.19464, Deontic Policies for Runtime Governance of Agentic AI Systems — https://arxiv.org/abs/2606.19464
- arXiv 2606.19242, Runtime Compliance Verification for AI Agents — https://arxiv.org/pdf/2606.19242
- Springer, Fundamental Limits of Runtime Policy Enforcement in Multi-agent AGI Systems — https://link.springer.com/chapter/10.1007/978-3-032-33195-3_21
- arXiv 2508.03858, MI9: An Integrated Runtime Governance Framework for Agentic AI — https://arxiv.org/html/2508.03858v4
- LLM Works, Mapping the AI Agent Governance Landscape (Aug 2026) — https://www.llm-works.ai/blog/agent-governance-landscape-aug-2026/
- Google DeepMind, Securing the future of AI agents — https://deepmind.google/blog/securing-the-future-of-ai-agents/
- Singapore Consensus 2026 — https://aisafetypriorities.org/
