/**
 * Open/closed indicator. Half the dashboard is frozen outside market hours,
 * so this exists to stop a still tape reading as a broken page.
 */
export function MarketStatusDot({
  open,
  label,
  tone = "light",
  className = "",
}: {
  open: boolean;
  label: string;
  /** "onDark" for the brand-green top bar, "light" on canvas. */
  tone?: "light" | "onDark";
  className?: string;
}) {
  const dot = open
    ? tone === "onDark"
      ? "bg-up-on-dark"
      : "bg-up"
    : tone === "onDark"
      ? "bg-white/40"
      : "bg-hint";

  const text = open
    ? tone === "onDark"
      ? "text-up-on-dark"
      : "text-up"
    : tone === "onDark"
      ? "text-white/60"
      : "text-muted";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden className={`size-1.5 rounded-full ${dot}`} />
      <span
        className={`font-mono text-caption font-medium tracking-[0.08em] ${text}`}
      >
        {label.toUpperCase()}
      </span>
    </span>
  );
}
