import { Overline } from "@/components/atoms/Overline";

/**
 * A figure with its mono label underneath, on light surfaces.
 *
 * StatTile is the same idea for the dark brand panels; this one follows the
 * system's light treatment — headline figures set in the display face, inline
 * numbers set in mono the way prices are everywhere else.
 */
export function Metric({
  value,
  label,
  size = "md",
  tone = "default",
  className = "",
}: {
  value: string;
  label: string;
  /** "lg" for the one headline figure in a panel. */
  size?: "md" | "lg";
  tone?: "default" | "up" | "down" | "muted";
  className?: string;
}) {
  const tones = {
    default: "text-ink",
    up: "text-up",
    down: "text-down",
    muted: "text-muted",
  } as const;

  const sizes = {
    lg: "text-display font-bold tracking-[-0.6px]",
    md: "font-mono text-md font-medium",
  } as const;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className={`block ${sizes[size]} ${tones[tone]}`}>{value}</span>
      <Overline tone="muted">{label}</Overline>
    </div>
  );
}
