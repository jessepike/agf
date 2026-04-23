import Image from "next/image";
import Link from "next/link";
import { Confidence } from "@/components/confidence";

const roles = [
  {
    role: "Security & Threat Modeling",
    audience: "CISOs, security architects, red teams",
    href: "/docs/profiles/security",
    description: "Three-level security model, OWASP mappings, incident response",
  },
  {
    role: "Platform & Infrastructure",
    audience: "Platform engineers, DevOps/MLOps",
    href: "/docs/profiles/platform",
    description: "Deployment modes, MCP integration, cost of governance",
  },
  {
    role: "Governance, Risk & Compliance",
    audience: "Compliance officers, auditors, DPOs",
    href: "/docs/profiles/grc",
    description: "EU AI Act mapping, control crosswalks, evidence guides",
  },
  {
    role: "AI Engineering",
    audience: "AI/ML engineers, agent developers",
    href: "/docs/profiles/ai-engineering",
    description: "19 primitives, composition patterns, implementation priority",
  },
  {
    role: "Observability & Operations",
    audience: "SREs, SOC analysts, detection engineers",
    href: "/docs/profiles/observability",
    description: "Event architecture, correlation engine, operational playbooks",
  },
];

const concepts = [
  {
    title: "The Rings Model",
    href: "/docs/overview/rings-model",
    description:
      "Four concentric rings — Execution, Verification, Governance, Learning — plus cross-cutting fabric.",
  },
  {
    title: "19 Primitives",
    href: "/docs/reference/primitives",
    description:
      "Named patterns for governed agentic systems. Not invented — connected from established practice.",
  },
  {
    title: "Trust Ladders",
    href: "/docs/overview/trust-ladders",
    description:
      "Agents earn autonomy through demonstrated performance. Start expensive, get cheaper.",
  },
  {
    title: "Composition Patterns",
    href: "/docs/overview/composition-patterns",
    description:
      "From Minimum Viable Control to Full Governed System — each phase independently valuable.",
  },
];

const standards = [
  "NIST AI RMF",
  "OWASP ASI Top 10",
  "OWASP MCP Top 10",
  "CSA MAESTRO",
  "EU AI Act",
  "ISO/IEC 42001",
  "MITRE ATLAS",
  "OpenTelemetry",
  "Singapore IMDA",
  "NIST 800-53",
];

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
    >
      <path
        d="M6 3L11 8L6 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-[#fafaf9]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fafaf9]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-semibold tracking-tight text-stone-800">
            AGF
          </Link>
          <nav className="flex items-center gap-6 text-sm text-stone-500">
            <Link href="/docs/overview/what-is-agf" className="hover:text-stone-800 transition-colors">
              Docs
            </Link>
            <a
              href="https://github.com/jessepike/agf"
              className="hover:text-stone-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://jessepike.dev"
              className="hover:text-stone-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              jessepike.dev
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="mx-auto max-w-6xl px-6 pt-24 pb-20">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-wide uppercase text-stone-400 mb-4">
              Reference Architecture
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-800 leading-[1.1] mb-6">
              A composable governance
              <br />
              framework for agentic systems
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed max-w-2xl mb-10">
              AGF synthesizes NIST, OWASP, CSA, EU AI Act, and academic research
              into a single coherent architecture for building safe, secure,
              auditable, and observable agentic systems.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/docs/overview/what-is-agf"
                className="inline-flex h-10 items-center rounded-md bg-stone-800 px-5 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-700"
              >
                Read the framework
              </Link>
              <Link
                href="/docs/profiles/ai-engineering"
                className="inline-flex h-10 items-center rounded-md border border-stone-300 px-5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:border-stone-400"
              >
                Start with your role
              </Link>
            </div>
          </div>
        </section>

        {/* ── Tagline ── */}
        <section className="border-y border-stone-200/80 bg-stone-50">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <p className="text-center text-stone-400 text-sm tracking-wide">
              We did not invent these patterns. We sorted the pieces and showed
              how they fit together.
            </p>
          </div>
        </section>

        {/* ── Standards strip ── */}
        <section className="border-b border-stone-200/80">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <p className="text-xs font-medium tracking-wide uppercase text-stone-400 mb-5 text-center">
              Integrates &amp; maps to
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {standards.map((s) => (
                <span
                  key={s}
                  className="text-sm text-stone-400 font-mono"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Rings Model Diagram ── */}
        <section className="border-b border-stone-200/80">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <Image
              src="/diagrams/rings-model-governed-agentic-systems.png"
              alt="The Rings Model — Governed Agentic Systems: Ring 0 (Execution) through Ring 3 (Learning) with cross-cutting fabric"
              width={1200}
              height={675}
              className="w-full h-auto rounded-lg border border-stone-200"
              priority={false}
            />
            <p className="text-center text-xs text-stone-400 mt-4">
              The Rings Model — four concentric rings, one fabric, one substrate.{" "}
              <Link href="/docs/overview/rings-model" className="text-stone-500 hover:text-stone-700 underline underline-offset-2">
                Learn more
              </Link>
            </p>
          </div>
        </section>

        {/* ── v1.0 Positioning ── */}
        <section className="border-b border-stone-200/80 bg-stone-50/60">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
              <div className="lg:col-span-2">
                <p className="text-xs font-medium tracking-wide uppercase text-stone-400 mb-3">
                  v1.0 Positioning
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-stone-800 mb-4 leading-snug">
                  AGF synthesizes the governance landscape — see how it fits.
                </h2>
                <p className="text-sm text-stone-500 leading-relaxed mb-6">
                  NIST, OWASP, CSA AICM/ATF/MAESTRO, ISO 42001, EU AI Act, Microsoft
                  AGT, FAIR — each authoritative, none sufficient alone. AGF is the
                  architectural substrate that makes the frameworks you already use
                  work together for agentic systems.
                </p>
                <Link
                  href="/docs/reference/relationship-to-frameworks"
                  className="group inline-flex items-center gap-1 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                >
                  Read the seven-layer stack
                  <ArrowIcon />
                </Link>
              </div>
              <div className="lg:col-span-3">
                <Image
                  src="/diagrams/seven-layer-landscape-stack.png"
                  alt="The Agentic Governance Landscape — seven-layer stack with AGF as architectural substrate (Layer 0) and unifying frame around OWASP (L1), MAESTRO (L2), AICM/ISO/NIST catalogs (L3), CSA ATF (L4), Microsoft AGT (L5), with FAIR as orthogonal Layer 6"
                  width={1200}
                  height={900}
                  className="w-full h-auto rounded-lg border border-stone-200 bg-white"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Role Router ── */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-800 mb-2">
              Start with your role
            </h2>
            <p className="text-sm text-stone-500">
              Five domain profiles, each with the depth your function needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200 rounded-lg overflow-hidden border border-stone-200">
            {roles.map((item) => (
              <Link
                key={item.role}
                href={item.href}
                className="group flex flex-col bg-[#fafaf9] p-6 transition-colors hover:bg-stone-50"
              >
                <span className="text-sm font-semibold text-stone-800 mb-0.5">
                  {item.role}
                </span>
                <span className="text-xs text-stone-400 mb-3">
                  {item.audience}
                </span>
                <span className="text-sm text-stone-500 leading-relaxed flex-1">
                  {item.description}
                </span>
                <span className="mt-4 flex items-center gap-1 text-xs font-medium text-stone-400 group-hover:text-stone-600 transition-colors">
                  Read profile
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Core Concepts ── */}
        <section className="border-t border-stone-200/80">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight text-stone-800 mb-2">
                Core concepts
              </h2>
              <p className="text-sm text-stone-500">
                The architectural foundations of the framework.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {concepts.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col rounded-lg border border-stone-200 p-6 transition-colors hover:border-stone-300 hover:bg-stone-50"
                >
                  <h3 className="text-sm font-semibold text-stone-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed flex-1">
                    {item.description}
                  </p>
                  <span className="mt-4 flex items-center gap-1 text-xs font-medium text-stone-400 group-hover:text-stone-600 transition-colors">
                    Learn more
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Philosophy ── */}
        <section className="border-t border-stone-200/80 bg-stone-50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-sm font-semibold text-stone-800 mb-2">
                  Humility before authority
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  We synthesize, we don&apos;t decree. Every pattern is credited
                  to the communities that developed it.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-800 mb-2">
                  Rigor before opinion
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Every claim grounded in evidence or clearly marked as an
                  informed proposal. Confidence levels throughout:{" "}
                  <Confidence level="established" />
                  {" · "}
                  <Confidence level="informed" />
                  {" · "}
                  <Confidence level="open" />
                  .
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-800 mb-2">
                  Community over credit
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  If this framework helps one organization build a safer agentic
                  system, it has served its purpose.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-200/80">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-400">
            AGF is developed by{" "}
            <a
              href="https://jessepike.dev"
              className="text-stone-500 hover:text-stone-700 transition-colors"
            >
              Jesse Pike
            </a>
          </p>
          <div className="flex items-center gap-5 text-xs text-stone-400">
            <a
              href="https://github.com/jessepike/agf"
              className="hover:text-stone-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <Link href="/llms.txt" className="hover:text-stone-600 transition-colors">
              llms.txt
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
