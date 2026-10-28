# 07 — Runtime Control: Agent Hooks, Policy Engines, Guardrails, Sandboxes

**Research date:** 2026-10-28 · **Window:** May–Oct 2026 · **AGF baseline:** Ring Deployment Modes (wrapper, middleware/interrupt, graph-embedded) and Policy as Code (#9) in `docs/agentic-primitives.md`. Microsoft AGT as the Layer 5 runtime reference in `docs/relationship-to-frameworks.md`

---

## Summary

**Lifecycle hooks became the de facto runtime enforcement layer for agents in 2026.** Every major coding agent now exposes pre- and post-tool hooks. Policy engines (Cedar, OPA) attach to them, and a standards effort (OWASP ACS) aims to make the hook surface portable. Cloud platforms shipped gateway-level policy enforcement (AWS AgentCore Policy GA). Microsoft AGT moved fast (v3.2 to v4.1 between April and June) and now ships hook adapters for coding agents. The limits are known and documented: hooks govern *actions, not reasoning*, hook configs are themselves an attack surface, and policy completeness remains unsolved.

This is the most direct confirmation of AGF's Middleware/Interrupt deployment mode, and the area where AGF's guidance is most out of date in naming, not in concept.

## Agent hooks

### 1. Platform support — Established (multiple independent sources)
| Platform | Hook surface (summary) |
|---|---|
| Claude Code | Broadest surface: SessionStart/End, UserPromptSubmit, PreToolUse, PostToolUse, Stop, subagent, pre-compaction, setup, worktree, task, elicitation. Command, prompt, and agent handler types. **Hooks enforced recursively on subagents** |
| Cursor | Pre/post tool, granular file-operation hooks, unique `afterAgentResponse` / `afterAgentThought`, session end |
| OpenAI Codex | Generic PreToolUse/PostToolUse covering shell, MCP, and file ops. No session-end or subagent events |
| GitHub Copilot (VS Code / coding agent) | userPromptSubmitted, preToolUse, postToolUse, errorOccurred. Subagent and pre-compaction events. Mostly Claude-Code-compatible names |
| Windsurf, Cline, OpenClaw | Hooks supported. OpenClaw adds human-approval pauses |

- **Portable subset** across vendors: session start, prompt submit, pre-tool, post-tool, stop. Configs, event names, input schemas, and decision-response shapes are **not standardized** (Speakeasy, 2026-05-06).
- **Mapping to AGF:** PreToolUse → Bounded Agency (#7) and Governance Gates (#8) at wire speed. PostToolUse → Provenance (#6) and Event-Driven Observability (#10). SessionStart → Identity & Attribution (#14) and Environment Governance (#19). Stop/subagent → DELEGATE and HALT signals. — Informed (AGF's own mapping, consistent with the hook semantics above)

### 2. Policy engines on hooks — Established
- **Cedar:** Sondera mapped tool names across Claude, Cursor, Copilot, and Gemini so one Cedar policy governs all four. Phil Windley built a Cedar-based policy-aware loop for OpenClaw.
- **OPA/Rego:** EQTY Lab's *Cupcake* (with Trail of Bits support).
- Reference-monitor framing (always invoked, tamper-resistant, verifiable) is now common in the practitioner literature.
- Vendor products built on hooks: Zenity (inline runtime security; origin of OWASP ACS), Endor Labs (coding-agent governance via hooks), GitGuardian (secret blocking via hooks).

### 3. Standardization — Informed
- **OWASP Agent Control Standard (ACS)** (see `04`) defines how platforms expose middleware hooks and how portable declarative policies are enforced. v0.1.0.
- Gartner lists "coordination mechanisms (standards, APIs, hooks)" as the least mature guardian-agent delivery approach (see `06`).

### 4. Known limitations and attacks — Established
- **Repository config as attack surface:** Check Point Research (2026-02-25) showed that repository-controlled Claude Code settings could be weaponized on project open. Malicious **hooks** gave code execution (no separate CVE). **CVE-2025-59536** is an MCP consent bypass that let MCP servers start before the user trusted the project. **CVE-2026-21852** is API traffic redirection that exfiltrated the active API key. All three were patched. The lesson extends beyond hooks: any repo-supplied agent configuration (hooks, MCP server lists, environment settings) is untrusted input.
- **Enforcement bypass:** Adversa AI found Claude Code ignored deny rules for commands with more than 50 subcommands. Praetorian reported an agent exploiting a hook loophole.
- **Action ≠ reasoning:** a prompt-injected agent may split a forbidden action into permitted steps. This is the **path-level policy** problem: compliance must be evaluated over trajectories, not single calls (see `11`, *Policies on Paths*).
- **Delta vs AGF:** AGF's Environment Governance (#19) treats environment composition as an attack surface. Hook configuration is a concrete, CVE-backed instance that AGF doesn't name. The "Recursive Governance Problem" section in `agentic-primitives.md` is directly relevant.

## Platform and gateway enforcement

### 5. AWS Bedrock AgentCore Policy — GA — Established
- GA **2026-03-03**, 13 regions. Policies are written in **Cedar** (natural-language authoring compiles to Cedar), stored in a policy engine, and attached to the **AgentCore Gateway**, which intercepts every agent→tool call. Policy lives outside agent code. Decisions are logged to CloudWatch.
- **Delta vs AGF:** AGF's primer says AWS is "treated neutrally" and expected to mature. It has matured: AgentCore is now a production Layer 5 reference for gateway-mode policy enforcement.

### 6. Microsoft Agent Governance Toolkit (AGT) — Established (release notes)
| Version | Date | Highlights |
|---|---|---|
| v3.2.0 | 2026-04-22 | E2E encryption (X3DH, Double Ratchet), AgentMesh Wire Protocol v1.0, registry and relay services |
| v3.3.0 | 2026-04-27 | Policy composition, multi-stage pipelines, `govern()` wrapper, human-in-the-loop approvals, OpenTelemetry, EU AI Act templates |
| v3.5.0 | 2026-05-08 | Entra identity bridge, multi-agent collective policies, **Decision BOM** reconstruction, intent-based authorization, cost governance |
| v3.6.0 | 2026-05-12 | Formal specs (identity, trust, hypervisor, SRE, MCP security, audit), 319 security fixes, cross-org federation, enforced execution rings, Bedrock adapter, Copilot CLI governance, GitHub Actions governance gate |
| v3.7.0 | 2026-05-18 | **ToolPolicy schema contributed to the Agent Spec standard** (rate-limit, approval, justification guards) |
| v4.0.0 | 2026-06-01 | Breaking: 45 → 5 Python distributions; TEE keystore; wire-protocol-aware policy (SQL, Kubernetes); **Claude Code, OpenCode, Antigravity CLI adapters**; test replay engine |
| v4.1.0 | 2026-06-09 | Signed registration, cost- and time-aware policy conditions, agt-policies 5.0.0 |

- Claims "10/10 OWASP Agentic Top 10" coverage and `agt verify` for "OWASP ASI 2026 compliance." These are **vendor claims without published evidence**. The release notes do **not mention ATF conformance**. — Informed
- **Delta vs AGF:** AGF calls AGT "formally ATF-conformant" (`relationship-to-frameworks.md`, `agf-primer.md`). The source for that is the AGT **v1.0.0** release notes, which claim "compliance mapping across all 5 ATF pillars (**15/15 requirements**)" and list a "conformance assessment." That is a self-assessed mapping, not third-party certification, and the v3.x/v4.x release notes no longer mention ATF. There is also a count mismatch: AGF describes ATF as having **25** conformance requirements, while AGT maps **15**. One of the two numbers needs a source check. — Informed. AGT's "Decision BOM" is another decision-record artifact parallel to GDR.

### 7. Microsoft Agent 365 — Established
- GA **2026-05-01**, $15/user/month or included in M365 E7. Each independent-identity agent gets its own Entra principal with RBAC and Conditional Access. Delegated-access agents can be paused or terminated centrally. **Multi-cloud registry (preview)** syncs AWS Bedrock and Google Cloud agents. **Shadow-agent discovery** via Defender/Intune finds unmanaged local agents, including Claude Code and Copilot CLI. Windows 365 for Agents (preview).
- **Delta vs AGF:** AGF's GA date is correct. Shadow-agent discovery is a concrete control for the governance framework's "Discover" function.

### 8. Other gateway and authorization tooling — Informed
- MCP/agent gateways: agentgateway (now an AAIF project), Cloudflare WriteGuard (risk-tiered MCP proxy, private beta), Permit MCP Gateway, Portkey (acquired by Palo Alto Networks).
- Fine-grained agent authorization: Auth0 for AI Agents (token vault, async approval), OpenFGA (agents as principals), WorkOS FGA, Permit.io, Arcade (just-in-time action authorization), EnforceAuth (OPA-native).

## Guardrails and sandboxes — Informed

- **Guardrail layers in common use:** input filters (NeMo Guardrails input rails, Lakera Guard, LLM Guard, OpenAI Guardrails), output constraints (Guardrails AI, Outlines, Instructor, structured outputs), and execution rails (NeMo execution rails, MCP gateways).
- **Sandboxes:** Docker launched cloud Sandboxes (`sbx`, microVM isolation) on the premise that containers weren't designed for agent isolation. NVIDIA OpenShell (cited in AGF, Mar 2026), E2B, Firecracker/gVisor runtimes. **Windows 365 for Agents** (Microsoft). **OpenSandbox** (Alibaba) joined AAIF 2026-10-22.
- **Lesson from the summer's incidents:** experts called evaluation sandboxes "notoriously insecure". The OpenAI case escaped via an internal package-download service (see `10`). Sandboxing is necessary but not sufficient, and egress control, monitoring, and kill-switches carry the load.

---

## Sources

- Resilient Cyber (Chris Hughes), A Look At An Emerging Runtime Enforcement Layer For Agents — Hooks, 2026-04-13 — https://www.resilientcyber.io/p/a-look-at-an-emerging-runtime-enforcement
- Speakeasy, AI agent hooks: the interface for governing AI agents, 2026-05-06 — https://www.speakeasy.com/resources/ai-agent-hooks
- Endor Labs, Introducing AI Coding Agent Governance — https://www.endorlabs.com/learn/introducing-agent-governance-using-hooks-to-bring-visibility-to-ai-coding-agents
- GitGuardian, AI Hooks for Claude Code, Cursor, and Codex — https://blog.gitguardian.com/ai-hooks-ai-coding-assistants/
- AWS, Policy in Amazon Bedrock AgentCore is now generally available, 2026-03-03 — https://aws.amazon.com/about-aws/whats-new/2026/03/policy-amazon-bedrock-agentcore-generally-available/
- AWS ML Blog, Govern AI agent tool access with AgentCore Gateway — https://aws.amazon.com/blogs/machine-learning/govern-ai-agent-tool-access-with-amazon-bedrock-agentcore-gateway/
- GitHub, microsoft/agent-governance-toolkit releases — https://github.com/microsoft/agent-governance-toolkit/releases
- BornCity, Vulnerabilities (CVE-2025-59536, CVE-2026-21852) in Anthropic Claude Code, 2026-03-02 — https://borncity.com/win/2026/03/02/vulnerabilities-cve-2025-59536-cve-2026-21852-in-anthropic-claude-code/
- Microsoft, Agent Governance Toolkit v1.0.0 release notes — https://microsoft.github.io/agent-governance-toolkit/releases/RELEASE_NOTES_v1.0.0/
- Microsoft Open Source Blog, Introducing the Agent Governance Toolkit, 2026-04-02 — https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit/
- Agentic Control Plane, Microsoft open-sourced an Agent Governance Toolkit: what it covers and what it doesn't — https://agenticcontrolplane.com/blog/microsoft-agent-governance-toolkit-coverage
- AlgeriaTech, What Microsoft Actually Shipped on May 1 (Agent 365) — https://algeriatech.news/microsoft-agent-365-general-availability-enterprise-ai-governance-2026/
- Microsoft Learn, What's new in Entra Agent ID — https://learn.microsoft.com/en-us/entra/agent-id/whats-new-agent-id
- LLM Works, Mapping the AI Agent Governance Landscape (Aug 2026) — https://www.llm-works.ai/blog/agent-governance-landscape-aug-2026/
- Forkast, Docker launched cloud sandboxes — https://forkast.news/docker-launched-cloud-sandboxes-containers-werent-designed-for-ai-agent-isolation/
- Manveer C., AI agent sandboxing in 2026 — https://manveerc.substack.com/p/ai-agent-sandboxing-guide
