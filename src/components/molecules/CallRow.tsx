import { ScoreBar } from "@/components/atoms/ScoreBar";
import { VerdictLabel } from "@/components/atoms/VerdictLabel";
import type { Pick } from "@/lib/mock-data";

/** Shared grid so the header and the rows cannot drift apart. */
export const CALL_GRID =
  "grid grid-cols-[40px_minmax(0,2fr)_1fr_1.1fr_1fr_0.9fr_0.9fr_0.7fr] gap-4";

export function CallRow({ pick, index }: { pick: Pick; index: number }) {
  return (
    <div
      className={`${CALL_GRID} rule-b-subtle cursor-pointer items-center py-4.5 transition-colors duration-[120ms] ease-standard hover:bg-white`}
    >
      <span className="font-mono text-caption text-hint">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-md font-medium">{pick.name}</span>
        <span className="font-mono text-caption text-muted">{pick.ticker}</span>
      </div>

      <span className="text-label text-muted">{pick.cap}</span>

      <VerdictLabel verdict={pick.verdict} />

      <div className="flex items-center gap-2.5">
        <span className="font-mono text-body font-medium text-brand">
          {pick.score}
        </span>
        <ScoreBar value={pick.score} />
      </div>

      <span className="font-mono text-label">{pick.price}</span>
      <span className="font-mono text-label font-medium">{pick.target}</span>
      <span className="font-mono text-caption text-muted">{pick.horizon}</span>
    </div>
  );
}
