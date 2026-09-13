import type { ScoreFactor } from "@/lib/mock-data";

/** A "what moved the score" line: signed delta, then the reason. */
export function ScoreFactorRow({ factor }: { factor: ScoreFactor }) {
  return (
    <div className="grid grid-cols-[32px_1fr] gap-3">
      <span
        className={`font-mono text-label font-medium ${
          factor.up ? "text-up" : "text-down"
        }`}
      >
        {factor.delta}
      </span>
      <span className="text-label text-ink">{factor.body}</span>
    </div>
  );
}
