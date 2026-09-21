"use client";

import { Container } from "@/components/atoms/Container";
import { Overline } from "@/components/atoms/Overline";
import { MoverRow } from "@/components/molecules/MoverRow";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { useQuotes } from "@/components/providers/MarketDataProvider";
import { formatPercent, formatPrice } from "@/lib/market";
import { moverGroups } from "@/lib/mock-data";

export function TapeToday() {
  const quotes = useQuotes();

  return (
    <Container as="section" className="pt-16">
      <SectionHeading
        title="The tape today"
        meta="MOVERS, AND THE STANDING VERDICT ON EACH"
      />

      <div className="grid gap-x-12 gap-y-8 pt-6 lg:grid-cols-3">
        {moverGroups.map((group) => (
          <div key={group.title}>
            <Overline tone="muted" className="block pb-2">
              {group.title.toUpperCase()}
            </Overline>
            {group.rows.map((mover) => {
              const live = quotes[mover.ticker];

              // Price and change come from Upstox; the verdict is ours and
              // stays mock until the scoring model exists.
              return (
                <MoverRow
                  key={mover.ticker}
                  mover={
                    live
                      ? {
                          ...mover,
                          price: formatPrice(live.last_price),
                          change:
                            formatPercent(live.change_percent) ?? mover.change,
                          up: live.up,
                        }
                      : mover
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </Container>
  );
}
