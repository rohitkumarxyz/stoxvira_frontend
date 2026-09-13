import { Overline } from "@/components/atoms/Overline";
import { ScoreBar } from "@/components/atoms/ScoreBar";
import { VerdictLabel } from "@/components/atoms/VerdictLabel";
import { ScoreFactorRow } from "@/components/molecules/ScoreFactorRow";
import { sampleVerdict } from "@/lib/mock-data";

/** The worked example: one stock's published verdict, broken down. */
export function VerdictCard() {
  return (
    <div className="bg-card">
      <div className="rule-b flex items-start justify-between gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-display font-bold tracking-[-0.6px]">
            {sampleVerdict.name}
          </h3>
          <Overline tone="muted">{sampleVerdict.meta}</Overline>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-md font-medium">
            {sampleVerdict.price}
          </span>
          <span className="font-mono text-caption font-medium text-up">
            {sampleVerdict.change}
          </span>
        </div>
      </div>

      <div className="rule-b grid grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-2 p-6">
          <Overline tone="muted">VERDICT</Overline>
          <VerdictLabel verdict={sampleVerdict.verdict} size="display" />
          <span className="text-label text-muted">{sampleVerdict.detail}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 p-6 shadow-[inset_1px_0_0_var(--color-line)]">
          <span className="text-display font-bold text-brand">
            {sampleVerdict.score}
          </span>
          <Overline tone="muted">SCORE / 100</Overline>
        </div>
      </div>

      <div className="rule-b flex flex-col gap-2.5 p-6">
        {sampleVerdict.breakdown.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[120px_1fr_28px] items-center gap-3"
          >
            <Overline tone="muted">{row.label}</Overline>
            <ScoreBar value={row.value} width="w-full" />
            <span className="text-right font-mono text-caption text-muted">
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 p-6">
        <Overline tone="muted">WHAT MOVED THE SCORE</Overline>
        {sampleVerdict.factors.map((factor) => (
          <ScoreFactorRow key={factor.body} factor={factor} />
        ))}
        <a href="#" className="pt-1 text-label font-medium">
          open the full verdict
        </a>
      </div>
    </div>
  );
}
