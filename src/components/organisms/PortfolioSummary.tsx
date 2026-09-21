import { Overline } from "@/components/atoms/Overline";
import { Metric } from "@/components/molecules/Metric";

export type PortfolioTotals = {
  /** Live market value of every holding. */
  currentValue: number;
  /** What was paid for them. */
  invested: number;
  /** Change since yesterday's close, in rupees. */
  dayChange: number;
  holdings: number;
};

export const EMPTY_PORTFOLIO: PortfolioTotals = {
  currentValue: 0,
  invested: 0,
  dayChange: 0,
  holdings: 0,
};

/**
 * Portfolio totals.
 *
 * Nothing feeds this yet — there is no holdings store, and the Upstox token
 * belongs to the company account rather than to each user, so its holdings
 * are not this user's. Until holdings exist the panel states that plainly
 * instead of showing an invented number.
 */
export function PortfolioSummary({
  totals,
  className = "",
}: {
  totals: PortfolioTotals;
  className?: string;
}) {
  const empty = totals.holdings === 0;
  const pnl = totals.currentValue - totals.invested;

  return (
    <section className={`flex flex-col ${className}`}>
      <div className="rule-b flex items-baseline justify-between gap-4 p-6">
        <Overline tone="muted">PORTFOLIO</Overline>
        <Overline tone="hint">
          {empty ? "NO HOLDINGS" : `${totals.holdings} HOLDINGS`}
        </Overline>
      </div>

      <div className="rule-b p-6">
        <Metric
          size="lg"
          tone={empty ? "muted" : "default"}
          value={formatRupees(totals.currentValue)}
          label="TOTAL VALUE"
        />
      </div>

      <div className="grid flex-1 grid-cols-3">
        <Metric
          className="p-6"
          value={formatRupees(totals.invested)}
          label="INVESTED"
          tone={empty ? "muted" : "default"}
        />
        <Metric
          className="p-6 shadow-[inset_1px_0_0_var(--color-line)]"
          value={formatSigned(totals.dayChange)}
          label="DAY CHANGE"
          tone={signTone(totals.dayChange, empty)}
        />
        <Metric
          className="p-6 shadow-[inset_1px_0_0_var(--color-line)]"
          value={formatSigned(pnl)}
          label="OVERALL P&L"
          tone={signTone(pnl, empty)}
        />
      </div>

      {empty ? (
        <p className="rule-t p-6 text-label leading-[1.7] text-muted">
          Nothing tracked yet. Once holdings can be added, this values them
          against live prices and shows the day&rsquo;s move.
        </p>
      ) : null}
    </section>
  );
}

function signTone(
  value: number,
  empty: boolean,
): "up" | "down" | "muted" | "default" {
  if (empty || value === 0) return "muted";
  return value > 0 ? "up" : "down";
}

function formatRupees(value: number): string {
  return `₹ ${Math.round(value).toLocaleString("en-IN")}`;
}

/** Always signed, so a flat day reads as flat rather than looking absent. */
function formatSigned(value: number): string {
  const rounded = Math.round(value);
  if (rounded === 0) return "₹ 0";
  return `${rounded > 0 ? "+" : "−"}₹ ${Math.abs(rounded).toLocaleString("en-IN")}`;
}
