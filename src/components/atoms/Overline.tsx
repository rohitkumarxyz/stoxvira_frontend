import type { ReactNode } from "react";

type OverlineProps = {
  children: ReactNode;
  /** Brass on the dark sections, grey on canvas. */
  tone?: "accent" | "muted" | "hint" | "onDark";
  className?: string;
};

const TONES = {
  accent: "text-accent",
  muted: "text-muted",
  hint: "text-hint",
  onDark: "text-white/52",
} as const;

/** Mono, 11px, tracked. The system's data/eyebrow label. */
export function Overline({
  children,
  tone = "muted",
  className = "",
}: OverlineProps) {
  return (
    <span
      className={`font-mono text-caption font-medium tracking-[0.08em] ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
