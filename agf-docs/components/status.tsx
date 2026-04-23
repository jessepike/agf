export type StatusState = "conceptual" | "specified" | "implemented";

const meta: Record<
  StatusState,
  { label: string; description: string; swatch: string; text: string; ring: string }
> = {
  conceptual: {
    label: "Conceptual",
    description: "Proposed framing; not yet specified in canonical docs.",
    swatch: "bg-stone-100 dark:bg-stone-900",
    text: "text-stone-700 dark:text-stone-300",
    ring: "ring-stone-300 dark:ring-stone-800",
  },
  specified: {
    label: "Specified",
    description: "Canonical spec in docs/ with schema or definition.",
    swatch: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-900 dark:text-amber-200",
    ring: "ring-amber-200 dark:ring-amber-900",
  },
  implemented: {
    label: "Implemented",
    description: "Reference implementation exists (code or worked example).",
    swatch: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-800 dark:text-emerald-200",
    ring: "ring-emerald-200 dark:ring-emerald-900",
  },
};

export function Status({ state }: { state: StatusState }) {
  const m = meta[state];
  return (
    <span
      title={m.description}
      aria-label={`Status: ${m.label}. ${m.description}`}
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset align-middle ${m.swatch} ${m.text} ${m.ring}`}
    >
      <span aria-hidden className="font-semibold uppercase tracking-wide">
        {m.label}
      </span>
    </span>
  );
}
