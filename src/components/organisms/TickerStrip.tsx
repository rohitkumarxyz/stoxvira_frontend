"use client";

import { useQuotes } from "@/components/providers/MarketDataProvider";
import { formatIndexValue, formatPercent } from "@/lib/market";
import { ticker } from "@/lib/mock-data";

/** The scrolling index tape under the header. */
export function TickerStrip() {
  const quotes = useQuotes();

  return (
    <div className="overflow-hidden bg-brand shadow-[inset_0_-1px_0_rgb(255_255_255/0.08)]">
      <div className="flex items-center gap-8 overflow-x-auto px-6 py-2.5">
        {ticker.map((quote) => {
          const live = quotes[quote.symbol];
          const value = live ? formatIndexValue(live.last_price) : quote.value;
          const change = formatPercent(live?.change_percent ?? null);
          const up = live ? live.up : quote.up;

          return (
            <div
              key={quote.symbol}
              className="flex shrink-0 items-baseline gap-2"
            >
              <span className="font-mono text-caption font-medium text-white/60">
                {quote.name}
              </span>
              <span className="text-label font-medium text-white">{value}</span>
              <span
                className={`text-caption font-medium ${
                  up ? "text-up-on-dark" : "text-down-on-dark"
                }`}
              >
                {change ?? quote.change}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
