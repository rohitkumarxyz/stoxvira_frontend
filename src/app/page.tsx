import { MarketDataProvider } from "@/components/providers/MarketDataProvider";
import { AppPromo } from "@/components/organisms/AppPromo";
import { ClosedCalls } from "@/components/organisms/ClosedCalls";
import { FinalCta } from "@/components/organisms/FinalCta";
import { FromTheDesk } from "@/components/organisms/FromTheDesk";
import { Hero } from "@/components/organisms/Hero";
import { HowItWorks } from "@/components/organisms/HowItWorks";
import { IndexStrip } from "@/components/organisms/IndexStrip";
import { OpenCalls } from "@/components/organisms/OpenCalls";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { SiteHeader } from "@/components/organisms/SiteHeader";
import { TapeToday } from "@/components/organisms/TapeToday";
import { TickerStrip } from "@/components/organisms/TickerStrip";
import { fetchQuotesOrEmpty, HOME_SYMBOLS } from "@/lib/market";

// Prices move, so this page cannot be built once at deploy time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetched on the server so the first paint already shows real prices.
  // The provider then keeps them fresh from the browser.
  const initialQuotes = await fetchQuotesOrEmpty(HOME_SYMBOLS);

  return (
    <MarketDataProvider initialQuotes={initialQuotes} symbols={HOME_SYMBOLS}>
      <SiteHeader />
      <TickerStrip />
      <main className="flex-1">
        <Hero />
        <IndexStrip />
        <OpenCalls />
        <HowItWorks />
        <ClosedCalls />
        <TapeToday />
        <FromTheDesk />
        <AppPromo />
        <FinalCta />
      </main>
      <SiteFooter />
    </MarketDataProvider>
  );
}
