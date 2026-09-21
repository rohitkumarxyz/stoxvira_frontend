import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardShell } from "@/components/organisms/DashboardShell";
import { MarketDataProvider } from "@/components/providers/MarketDataProvider";
import { getSession } from "@/lib/auth";
import { fetchQuotesOrEmpty, HOME_SYMBOLS } from "@/lib/market";
import { getMarketHours } from "@/lib/market-hours";

// Reads the session cookie and live prices, so never static.
export const dynamic = "force-dynamic";

/**
 * The signed-in shell. The auth gate lives here rather than on each page, so
 * a new section cannot ship unprotected by accident.
 *
 * MarketDataProvider also sits here, which means moving between sections
 * keeps the same live quote stream instead of reconnecting every time.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const initialQuotes = await fetchQuotesOrEmpty(HOME_SYMBOLS);
  const market = getMarketHours();

  return (
    <MarketDataProvider initialQuotes={initialQuotes} symbols={HOME_SYMBOLS}>
      <DashboardShell
        name={session.name}
        email={session.email}
        marketOpen={market.open}
        marketLabel={market.label}
      >
        {children}
      </DashboardShell>
    </MarketDataProvider>
  );
}
