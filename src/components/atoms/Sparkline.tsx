/**
 * Polyline drawn on a fixed 0 0 60 32 viewBox and stretched, which is how the
 * design export draws it. Stroke colour comes from the parent via currentColor.
 */
export function Sparkline({
  points,
  className = "",
}: {
  points: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-8 w-15 shrink-0 ${className}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
