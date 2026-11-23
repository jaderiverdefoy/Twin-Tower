import { cn } from "@/lib/utils";

export type CurveTone =
  | "paper"
  | "paper-2"
  | "ivory"
  | "sand"
  | "walnut"
  | "deep"
  | "crimson";

/**
 * One understated, asymmetric boundary between two sections.
 *
 * Place it as the first child of the incoming section and add `isolate` to
 * that section. The path is filled with the *outgoing* section's tone, so the
 * previous band flows down into this one in a single soft curve. Only one
 * broad bend per boundary — no repeated waves.
 */
const PATHS = [
  "M0 0H1440V42C1216 86 1004 12 760 40C516 68 268 94 0 30Z",
  "M0 0H1440V54C1198 20 980 86 742 58C504 30 250 8 0 56Z",
  "M0 0H1440V32C1246 72 1030 94 776 62C522 30 246 12 0 48Z",
];

export default function SectionCurve({
  tone,
  variant = 0,
  className,
}: {
  /** Background of the section above — the colour that flows into this one. */
  tone: CurveTone;
  /** Cycle the three silhouettes so neighbouring curves never repeat. */
  variant?: 0 | 1 | 2;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("section-curve", className)}>
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className="block h-full w-full"
        focusable="false"
      >
        <path d={PATHS[variant]} fill={`var(--color-${tone})`} />
      </svg>
    </div>
  );
}
