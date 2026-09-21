"use client";

import Link from "next/link";

import { useQuotes } from "@/components/providers/MarketDataProvider";
import { CHART_STOCKS, formatPercent, formatPrice } from "@/lib/market";

export function MarketPulse() {
  const quotes = useQuotes();
  const featuredStocks = CHART_STOCKS.slice(0, 6);

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-caption uppercase tracking-[0.08em] text-muted">
            Market pulse
          </p>
          <h2 className="mt-2 text-lg font-bold text-ink">Keep an eye on the tape</h2>
        </div>
        <Link href="/dashboard/chart" className="text-label font-medium text-brand">
          Open workspace →
        </Link>
      </div>

      <div className="mt-4 grid gap-px overflow-hidden bg-line sm:grid-cols-2 lg:grid-cols-3">
        {featuredStocks.map(([symbol, name]) => {
          const quote = quotes[symbol];
          const change = quote ? formatPercent(quote.change_percent) : null;

          return (
            <Link
              key={symbol}
              href={`/dashboard/chart?symbol=${encodeURIComponent(symbol)}`}
              className="group bg-card p-5 transition-colors hover:bg-field"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-caption font-medium text-brand">{symbol}</p>
                  <p className="mt-1 truncate text-label text-muted">{name}</p>
                </div>
                <span
                  className={`font-mono text-caption font-medium ${
                    quote?.up ? "text-up" : quote ? "text-down" : "text-muted"
                  }`}
                >
                  {change ?? "—"}
                </span>
              </div>
              <p className="mt-5 font-display text-lg font-bold text-ink">
                {quote ? formatPrice(quote.last_price) : "—"}
              </p>
              <span className="mt-3 block text-caption text-muted opacity-0 transition-opacity group-hover:opacity-100">
                View chart →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
