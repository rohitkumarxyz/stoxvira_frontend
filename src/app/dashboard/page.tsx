import { redirect } from "next/navigation";

import { Container } from "@/components/atoms/Container";
import { DashboardGreeting } from "@/components/molecules/DashboardGreeting";
import { AccountSummary } from "@/components/organisms/AccountSummary";
import { IndexStrip } from "@/components/organisms/IndexStrip";
import { MarketPulse } from "@/components/organisms/MarketPulse";
import { OpenCalls } from "@/components/organisms/OpenCalls";
import {
  EMPTY_PORTFOLIO,
  PortfolioSummary,
} from "@/components/organisms/PortfolioSummary";
import { getSession } from "@/lib/auth";
import { formatIstDate, getMarketHours } from "@/lib/market-hours";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export const metadata = { title: "Overview — StoxVira" };

export default async function OverviewPage() {
  // The layout already turned away anyone without a session; this is for the
  // account details, which the cookie does not carry in full.
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  await connectToDatabase();
  const user = await User.findById(session.userId).lean();

  if (!user) {
    redirect("/login");
  }

  const market = getMarketHours();
  return (
    <>
      <Container className="pt-8">
      <DashboardGreeting
        name={user.name}
        date={formatIstDate()}
        marketOpen={market.open}
        marketLabel={market.label}
      />

        <div className="mt-7 grid overflow-hidden rounded-md border border-line bg-card lg:grid-cols-2">
          <AccountSummary
            name={user.name}
            email={user.email}
            memberSince={formatJoined(user.createdAt)}
            emailVerified={Boolean(user.emailVerified)}
          />
          <PortfolioSummary
            totals={EMPTY_PORTFOLIO}
            className="shadow-[inset_0_1px_0_var(--color-line)] lg:shadow-[inset_1px_0_0_var(--color-line)]"
          />
        </div>
        <MarketPulse />
      </Container>
      <IndexStrip />
      <OpenCalls />
    </>
  );
}

function formatJoined(date: Date | undefined): string {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
}
