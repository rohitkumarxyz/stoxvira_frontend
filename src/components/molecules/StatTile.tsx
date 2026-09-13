import { Overline } from "@/components/atoms/Overline";

/** A 28px figure over a mono caption. Used in the hero's 2x2 grid. */
export function StatTile({
  value,
  label,
  accent = false,
  className = "",
}: {
  value: string;
  label: string;
  /** The hit-rate tile is the one figure the design sets in green. */
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <span
        className={`block text-display font-bold ${
          accent ? "text-up-on-dark" : "text-white"
        }`}
      >
        {value}
      </span>
      <Overline tone="onDark">{label}</Overline>
    </div>
  );
}
