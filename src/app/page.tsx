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

export default function HomePage() {
  return (
    <>
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
    </>
  );
}
