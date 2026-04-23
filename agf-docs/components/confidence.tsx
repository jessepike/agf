import type { ReactNode } from "react";

export type ConfidenceLevel = "established" | "informed" | "open";

const meta: Record<
  ConfidenceLevel,
  { label: string; description: string; swatch: string; text: string; ring: string }
> = {
  established: {
    label: "Established",
    description: "Clear evidence; multiple sources agree.",
    swatch: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-800 dark:text-emerald-200",
    ring: "ring-emerald-200 dark:ring-emerald-900",
  },
  informed: {
    label: "Informed",
    description: "Our synthesis; single-source; plausible but unverified at scale.",
    swatch: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-900 dark:text-amber-200",
    ring: "ring-amber-200 dark:ring-amber-900",
  },
  open: {
    label: "Open",
    description: "Flagged but speculative; needs investigation.",
    swatch: "bg-stone-100 dark:bg-stone-900",
    text: "text-stone-700 dark:text-stone-300",
    ring: "ring-stone-300 dark:ring-stone-800",
  },
};

export function Confidence({
  level,
  children,
}: {
  level: ConfidenceLevel;
  children?: ReactNode;
}) {
  const m = meta[level];

  if (!children) {
    return (
      <span
        title={m.description}
        aria-label={`Confidence: ${m.label}. ${m.description}`}
        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset align-middle ${m.swatch} ${m.text} ${m.ring}`}
      >
        <span aria-hidden className="font-semibold uppercase tracking-wide">
          {m.label}
        </span>
      </span>
    );
  }

  return (
    <aside
      role="note"
      aria-label={`${m.label} confidence`}
      className={`my-4 rounded-md border-l-4 pl-4 pr-3 py-2 text-sm ring-1 ring-inset ${m.swatch} ${m.ring} border-l-current ${m.text}`}
    >
      <div className="text-xs font-semibold uppercase tracking-wide mb-1">
        {m.label} confidence
      </div>
      <div className="text-sm text-fd-foreground">{children}</div>
    </aside>
  );
}
