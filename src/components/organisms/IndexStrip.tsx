"use client";

import { Container } from "@/components/atoms/Container";
import { IndexCard } from "@/components/molecules/IndexCard";
import { useQuotes } from "@/components/providers/MarketDataProvider";
import { formatIndexValue, formatPercent } from "@/lib/market";
import { indices } from "@/lib/mock-data";

/** White band between the hero and the open calls. */
export function IndexStrip() {
  const quotes = useQuotes();

  return (
    <section className="bg-card">
      <Container>
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {indices.map((quote) => {
            const live = quotes[quote.symbol];
            if (!live) {
              return <IndexCard key={quote.symbol} quote={quote} />;
            }

            // The sparkline stays mock — it needs historical candles, which is
            // a separate Upstox call we have not built yet.
            return (
              <IndexCard
                key={quote.symbol}
                quote={{
                  ...quote,
                  value: formatIndexValue(live.last_price),
                  change: formatPercent(live.change_percent) ?? quote.change,
                  up: live.up,
                }}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
