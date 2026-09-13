/** A 4px track with a brand-green fill. No radius — the design draws it square. */
export function ScoreBar({
  value,
  width = "w-10",
  className = "",
}: {
  /** 0-100. */
  value: number;
  width?: string;
  className?: string;
}) {
  return (
    <span
      className={`block h-1 overflow-hidden bg-field ${width} ${className}`}
      role="presentation"
    >
      <span
        className="block h-1 bg-brand"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </span>
  );
}
