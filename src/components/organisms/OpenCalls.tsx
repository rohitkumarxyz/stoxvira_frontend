"use client";

import { Container } from "@/components/atoms/Container";
import { CALL_GRID, CallRow } from "@/components/molecules/CallRow";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { useQuotes } from "@/components/providers/MarketDataProvider";
import { formatPrice } from "@/lib/market";
import { picks } from "@/lib/mock-data";

const COLUMNS = [
  "#",
  "STOCK",
  "CAP",
  "VERDICT",
  "SCORE",
  "PRICE",
  "TARGET",
  "HORIZON",
];

export function OpenCalls() {
  const quotes = useQuotes();

  return (
    <Container as="section" className="pt-16">
      <SectionHeading
        title="Open calls"
        meta="14 LIVE · PUBLISHED 09:15 · CLOSES ON TARGET, STOP, BROKEN THESIS OR EXPIRY"
        action={
          <a href="#" className="text-label font-medium">
            all picks
          </a>
        }
      />

      <div className="overflow-x-auto">
        <div className="min-w-[880px]">
          {/* Mono headers are the system's one data signal. */}
          <div className={`${CALL_GRID} rule-b py-3.5`}>
            {COLUMNS.map((col) => (
              <span
                key={col}
                className={`font-mono text-caption ${
                  col === "#" ? "text-hint" : "text-brand"
                }`}
              >
                {col}
              </span>
            ))}
          </div>

          {picks.map((pick, i) => {
            const live = quotes[pick.ticker];

            // Only PRICE is real. Verdict, score, target and horizon are model
            // output — there is no model yet, so they stay as designed.
            return (
              <CallRow
                key={pick.ticker}
                pick={
                  live ? { ...pick, price: formatPrice(live.last_price) } : pick
                }
                index={i}
              />
            );
          })}
        </div>
      </div>
    </Container>
  );
}
