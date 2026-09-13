import type { Verdict } from "@/lib/mock-data";

const TEXT: Record<Verdict, string> = {
  Bullish: "text-tag-green-text",
  Bearish: "text-tag-red-text",
  Neutral: "text-tag-neutral-text",
};

const PILL: Record<Verdict, string> = {
  Bullish: "bg-tag-green-bg text-tag-green-text",
  Bearish: "bg-tag-red-bg text-tag-red-text",
  Neutral: "bg-tag-neutral-bg text-tag-neutral-text",
};

/** Explicit sizes rather than class overrides, so the caller cannot depend on
    which font-size utility happens to win the cascade. */
const SIZES = {
  label: "text-label font-medium",
  body: "text-body font-medium",
  display: "text-display font-bold",
} as const;

/**
 * Verdicts are single words. The bg/text pairs are locked — never mix a
 * background from one pair with text from another.
 */
export function VerdictLabel({
  verdict,
  as = "text",
  size = "body",
  className = "",
}: {
  verdict: Verdict;
  as?: "text" | "pill";
  size?: keyof typeof SIZES;
  className?: string;
}) {
  if (as === "pill") {
    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-overline font-medium ${PILL[verdict]} ${className}`}
      >
        {verdict}
      </span>
    );
  }

  return (
    <span className={`${SIZES[size]} ${TEXT[verdict]} ${className}`}>
      {verdict}
    </span>
  );
}
