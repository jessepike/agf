import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "12", label: "questions a program has to answer" },
  { value: "18", label: "sources mapped" },
  { value: "2026-11-10", label: "last full check" },
];

const stages = [
  {
    title: "Have not started",
    actions: "List your agents. Find out which rules apply. Put a floor in place.",
    href: "/docs/overview/start-here#have-not-started",
  },
  {
    title: "Piecing things together",
    actions: "Name an owner per question. Add an independent check. Add an approval step.",
    href: "/docs/overview/start-here#piecing-things-together",
  },
  {
    title: "Have a program",
    actions: "Check versions and dates. Trace one real decision. Test against the gaps.",
    href: "/docs/overview/start-here#have-a-program",
  },
];

const proposals = [
  {
    title: "The Rings Model",
    href: "/docs/overview/rings-model",
    description:
      "Who checks the agent's work, and who may change the rules it runs under.",
  },
  {
    title: "Governance Decision Record",
    href: "/docs/reference/governance-decision-record",
    description:
      "One record for approvals, policy changes and changes in an agent's trust level.",
  },
  {
    title: "Trust Ladders",
    href: "/docs/overview/trust-ladders",
    description: "How an agent earns autonomy and how it loses it.",
  },
  {
    title: "First 30 Days",
    href: "/docs/overview/first-30-days",
    description: "A four-week plan for a minimum floor of control.",
  },
];

const roles = [
  { role: "Security", href: "/docs/profiles/security" },
  { role: "Platform", href: "/docs/profiles/platform" },
  { role: "Risk and compliance", href: "/docs/profiles/grc" },
  { role: "AI engineering", href: "/docs/profiles/ai-engineering" },
  { role: "Observability", href: "/docs/profiles/observability" },
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
            <Link href="/docs/overview/start-here" className="hover:text-stone-800 transition-colors">
              Start here
            </Link>
            <Link href="/docs/reference/source-guide" className="hover:text-stone-800 transition-colors">
              Sources
            </Link>
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
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
          <p className="inline-block rounded-full border border-stone-300 px-3 py-1 text-xs font-medium tracking-wide text-stone-500 mb-8">
            Agentic Governance Framework
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-stone-800 leading-[1.08] mb-6">
            A practitioner&apos;s map for{" "}
            <span className="text-teal-800">governing AI agents.</span>
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto mb-10">
            AGF shows which source answers which question, where the sources
            say little, and what to do first. It is written for security and
            risk leaders who are early in the program.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/docs/overview/start-here"
              className="inline-flex h-11 items-center rounded-md bg-stone-800 px-6 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-700"
            >
              Start here
            </Link>
            <Link
              href="/docs/reference/source-guide"
              className="inline-flex h-11 items-center rounded-md border border-stone-300 px-6 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:border-stone-400"
            >
              Browse the sources
            </Link>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="text-3xl font-semibold tracking-tight text-teal-800">
                  {s.value}
                </dd>
                <dt className="text-xs text-stone-500 mt-1">{s.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Stages ── */}
        <section className="border-t border-stone-200/80 bg-stone-50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-800 mb-2 text-center">
              Pick your stage
            </h2>
            <p className="text-sm text-stone-500 mb-10 text-center">
              Each one gives you three actions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stages.map((s) => (
                <Link
                  key={s.title}
                  href={s.href}
                  className="group flex flex-col rounded-lg border border-stone-200 bg-[#fafaf9] p-6 transition-colors hover:border-stone-400"
                >
                  <h3 className="text-base font-semibold text-stone-800 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed flex-1">
                    {s.actions}
                  </p>
                  <span className="mt-4 flex items-center gap-1 text-xs font-medium text-stone-500 group-hover:text-stone-800 transition-colors">
                    See the three actions
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Landscape ── */}
        <section className="border-t border-stone-200/80">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold tracking-tight text-stone-800 mb-4 leading-snug">
                  No single source covers agent governance.
                </h2>
                <p className="text-sm text-stone-500 leading-relaxed mb-6">
                  NIST, OWASP, CSA, ISO, the EU and others each cover part of
                  it. AGF does not replace any of them. It shows how they fit
                  together.
                </p>
                <Link
                  href="/docs/reference/source-guide"
                  className="group inline-flex items-center gap-1 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                >
                  See who covers what
                  <ArrowIcon />
                </Link>
              </div>
              <div className="lg:col-span-3">
                <Image
                  src="/diagrams/governance-landscape-map.png"
                  alt="The agentic governance landscape: who covers what. AGF is a guide across OWASP (L1), MAESTRO (L2), AICM, ISO and NIST catalogs (L3), CSA ATF (L4) and Microsoft AGT (L5), with FAIR risk quantification alongside."
                  width={1200}
                  height={900}
                  className="w-full h-auto rounded-lg border border-stone-200 bg-white"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Proposals ── */}
        <section className="border-t border-stone-200/80 bg-stone-50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-800 mb-2">
              Where AGF adds something
            </h2>
            <p className="text-sm text-stone-500 mb-10">
              Where the sources say little, AGF proposes an answer. These are
              proposals and are marked as such.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {proposals.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col rounded-lg border border-stone-200 bg-[#fafaf9] p-6 transition-colors hover:border-stone-400"
                >
                  <h3 className="text-sm font-semibold text-stone-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed flex-1">
                    {item.description}
                  </p>
                  <span className="mt-4 flex items-center gap-1 text-xs font-medium text-stone-500 group-hover:text-stone-800 transition-colors">
                    Read
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Roles ── */}
        <section className="border-t border-stone-200/80">
          <div className="mx-auto max-w-6xl px-6 py-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <span className="text-stone-400">By role:</span>
            {roles.map((r) => (
              <Link
                key={r.role}
                href={r.href}
                className="text-stone-600 underline underline-offset-4 decoration-stone-300 hover:text-stone-900 hover:decoration-stone-500 transition-colors"
              >
                {r.role}
              </Link>
            ))}
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
            . Open license (CC BY 4.0).
          </p>
          <div className="flex items-center gap-5 text-xs text-stone-400">
            <Link href="/docs/transparency/corrections" className="hover:text-stone-600 transition-colors">
              Changes and corrections
            </Link>
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
