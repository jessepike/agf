# 08 — Protocols and Agent Identity: MCP, A2A, AAIF, Identity Platforms

**Research date:** 2026-10-28 · **Window:** May–Oct 2026 · **AGF baseline:** `docs/agentic-primitives.md` Protocol Standards (MCP, A2A, "AGNTCY and Linux Foundation AAIF") and Primitive #14. `docs/agentic-governance-framework.md` protocol table (MCP "Active", A2A "Early", SPIFFE "Mature")

---

## Summary

MCP shipped its biggest revision yet (2026-07-28). It is now **stateless**, has a formal deprecation policy, and documents **OpenTelemetry trace-context propagation**. That closes a gap AGF explicitly flags. A2A reached 1.0 and joined the Linux Foundation's **Agentic AI Foundation (AAIF)**, which now hosts 10 projects including Agent Skills, OpenSandbox, and agentgateway. Agent identity became a product category: Entra principals per agent, Okta and SailPoint buying agent-identity startups, and IETF and OpenID drafts converging on short-lived, workload-style credentials with CIBA-based human approval.

## MCP specification 2026-07-28 — Established (primary changelog)

**Major changes since 2025-11-25:**
- **Stateless protocol:** the `initialize` handshake and `Mcp-Session-Id` are removed. Every request carries protocol version and client capabilities in `_meta`. Clients SHOULD send `clientInfo` per request and servers SHOULD return `serverInfo`. A new mandatory `server/discover` RPC.
- **Multi Round-Trip Requests (MRTR)** replace server-initiated requests (sampling, elicitation, roots). Servers return `resultType: "input_required"` and clients retry with responses. Elicitation-completion notifications are removed.
- Tasks moved to an official extension (`io.modelcontextprotocol/tasks`). `subscriptions/listen` replaces GET/SSE subscriptions. SSE resumability removed.
- **Deprecated:** Roots, Sampling, Logging (log to stderr or **OpenTelemetry** instead), HTTP+SSE transport, and **OAuth Dynamic Client Registration in favor of Client ID Metadata Documents**.

**Security and governance-relevant minor changes:**
- **OpenTelemetry trace context (`traceparent`, `tracestate`, `baggage`) in `_meta` is documented (SEP-414).**
- Clients MUST validate the `iss` parameter (RFC 9207). Credentials MUST be bound to the issuing authorization server.
- Required `Mcp-Method`/`Mcp-Name` headers on HTTP POST (gateway-friendly routing and policy). Cacheable list results (`ttlMs`, `cacheScope`). Deterministic tool ordering.
- Feature lifecycle policy with a 12-month minimum deprecation window. PR-based SEP process.

**Delta vs AGF:**
- `agentic-primitives.md` (OTel table): "MCP does not yet define standard trace context propagation; OTel advises using `params._meta`." This is now **resolved upstream**.
- Primitive #14: "MCP does not yet enforce identity verification." This is partly superseded. Per-request client/server identity metadata, issuer validation, and CIMD tighten authentication, though MCP still does not do agent identity in the AIMS sense.
- AGF's MCP governance concerns ("dynamic tool discovery", "session isolation") need re-reading. There are no protocol sessions now, and list-changed notifications moved to `subscriptions/listen`.
- `Mcp-Method`/`Mcp-Name` headers make gateway-based (middleware-mode) policy enforcement cheaper, since tool identity is visible without body parsing.

## A2A and AAIF

### A2A 1.0 and AAIF membership — Established
- A2A **v1.0.0** is the current release, with signed Agent Cards, identity, and tenant routing discussed at the gateway layer. A2A was **accepted as an AAIF project** (Forbes, 2026-08-19).
- **Delta vs AGF:** the protocol table lists A2A as "Early." It is now 1.0. AGF's listed A2A gaps (short-lived tokens, consent, coarse scopes) should be rechecked against 1.0. — Open

### Agentic AI Foundation (AAIF) — Established
- **Name check:** AGF's `agentic-primitives.md:1842` calls it the "Linux Foundation's **Agentic AI Interoperability Forum** (AAIF)." The correct name is the **Agentic AI Foundation**. Founded Dec 2025. Platinum members at formation: AWS, Anthropic, Block, Bloomberg, Cloudflare, Google, Microsoft, OpenAI. It grew from 146 members (Feb 2026) to 290+ (Aug 2026), with eight working groups including Security & Privacy, Identity & Trust, and Agentic Commerce.
- **Projects (10 as of 2026-10-22):** MCP, goose, AGENTS.md (launch); A2A; Agent Router; agentgateway (June 2026; MCP virtualization with tool-level access policy); **Agent Skills** (Anthropic), **Open Responses** (OpenAI), **OpenEnv** (Hugging Face), **OpenSandbox** (Alibaba), all added 2026-10-22.
- AGF also lists **AGNTCY** as AAIF-housed. This research did not find AGNTCY on AAIF's 2026 project list. — Open (verify. It may sit elsewhere in the Linux Foundation)
- **Delta vs AGF:** Agent Skills and OpenEnv/OpenSandbox are new standardized surfaces for AGF's Environment Stack: L3 capability set, plus execution-environment specs for #19.

## Agent identity

### Platforms — Established
- **Microsoft Entra:** a distinct Entra principal per independent agent (Agent 365 GA 2026-05-01). Conditional Access and ID Protection service plans for agents (Message Center MC1395007).
- **Okta:** *Securing AI Agents* whitepaper (Feb 2026). Acquired **Permiso** (closed 2026-08-26).
- **AWS:** IAM plus AgentCore Gateway/Policy. **Google:** IAM, Cloud API Registry, Model Armor.

### Identity M&A — Established (SEC filings and releases, via one aggregator)
| Acquirer | Target | Closed | Price |
|---|---|---|---|
| Palo Alto Networks | CyberArk | 2026-02-11 | $21.1B |
| Cisco | Astrix Security | 2026-06-29 | ~$400M (reported) |
| SailPoint | Entro Security | 2026-06-29 | ~$122.6M |
| Okta | Permiso | 2026-08-26 | undisclosed |
| Cyera | Oasis Security | 2026-09-03 | "valued at $1B" |
| CrowdStrike | SGNL | (2026) | ~$628M |

### Standards convergence — Established (see `03`)
- IETF AIMS (WIMSE WG doc), Transaction Tokens, Identity Chaining, OpenID CIBA for human approval, CAEP/RISC for continuous revocation, AuthZEN approval and obligation profiles, and the NCCoE six-standard set.
- Common position across Five Eyes guidance, NCCoE, AIMS, and AIUC-1 Q2: **per-agent cryptographic identity, short-lived credentials, a named human owner, delegation chains that preserve the originating principal.** — Established
- **Delta vs AGF:** Primitive #14's substance holds. The upgrade AGF's backlog already lists ("Primitive #14 Identity & Attribution upgrade") now has standards-track references to anchor it.

---

## Sources

- MCP, Key Changes (2026-07-28 changelog) — https://modelcontextprotocol.io/specification/2026-07-28/changelog
- MCP Blog, The 2026-07-28 Specification — https://blog.modelcontextprotocol.io/posts/2026-07-28/
- AAIF, MCP 2026-07-28: From Local Tool to Distributed Protocol — https://aaif.io/blog/mcp-2026-07-28-whats-changing-and-how-to-migrate
- WorkOS, The biggest MCP spec update ships July 28 — https://workos.com/blog/mcp-2026-spec-agent-authentication
- AAIF, A2A joins AAIF's open agentic stack — https://aaif.io/blog/a2a-joins-aaif
- Forbes, Agent2Agent Joins The Agentic AI Foundation Alongside MCP, 2026-08-19 — https://www.forbes.com/sites/janakirammsv/2026/08/19/agent2agent-joins-the-agentic-ai-foundation-alongside-mcp/
- API7, A2A Protocol 1.0 at the Gateway — https://api7.ai/blog/a2a-protocol-gateway-layer
- Unite.AI, Agentic AI Foundation Adds Four Projects to Reach 10 in First Year — https://www.unite.ai/agentic-ai-foundation-adds-four-projects-to-reach-10-in-first-year/
- AAIF, Projects — https://aaif.io/projects
- Forkast, Three standards bodies are writing the rules for agent infrastructure, 2026-09-09 — https://forkast.news/three-standards-bodies-are-writing-the-rules-for-agent-infrastructure-and-theyre-not-waiting-for-the-market/
- Microsoft Learn, What's new in Entra Agent ID — https://learn.microsoft.com/en-us/entra/agent-id/whats-new-agent-id
- Merill, MC1395007 Conditional Access and ID Protection for agents — https://mc.merill.net/message/MC1395007
- Okta, Securing AI Agents whitepaper (Feb 2026) — https://www.okta.com/sites/default/files/2026-02/securing-ai-agents.pdf
- Deepak Gupta, Why Identity Giants Bought AI Agent Security Firms — https://guptadeepak.com/identity-giants-bought-ai-agent-security/
- Calcalist, Cisco acquires Astrix for $400 million — https://www.calcalistech.com/ctechnews/article/dy5obf581
- CSA Labs, AI Agent Identity Crisis: Standards Emerge as Enterprises Lag — https://labs.cloudsecurityalliance.org/research/csa-research-note-okta-ai-agent-iam-framework-enterprise-gap/
