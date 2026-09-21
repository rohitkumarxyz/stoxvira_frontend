import { MarketStatusDot } from "@/components/atoms/MarketStatusDot";
import { Overline } from "@/components/atoms/Overline";

/** The dashboard's opening line: who you are, what day it is, is the tape live. */
export function DashboardGreeting({
  name,
  date,
  marketOpen,
  marketLabel,
}: {
  name: string;
  date: string;
  marketOpen: boolean;
  marketLabel: string;
}) {
  // "Rohit Kumar" reads better as just "Rohit" in a greeting.
  const firstName = name.trim().split(/\s+/)[0];

  return (
    <div className="rule-accent flex flex-wrap items-end gap-x-6 gap-y-3 pb-3.5">
      <div className="flex min-w-0 flex-col gap-1">
        <Overline tone="muted">{date.toUpperCase()}</Overline>
        <h1 className="text-display font-bold tracking-[-0.8px] text-ink">
          Welcome back, {firstName}
        </h1>
      </div>

      <div className="flex-1" />

      <MarketStatusDot open={marketOpen} label={marketLabel} className="pb-1" />
    </div>
  );
}
