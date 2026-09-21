import { redirect } from "next/navigation";

import { StockWorkspace } from "@/components/organisms/StockWorkspace";
import { getSession } from "@/lib/auth";
import { CHART_STOCKS } from "@/lib/market";

export const dynamic = "force-dynamic";

export const metadata = { title: "Chart — StoxVira" };

export default async function ChartPage({
  searchParams,
}: {
  searchParams: Promise<{ symbol?: string | string[] }>;
}) {
  if (!(await getSession())) {
    redirect("/login");
  }

  const params = await searchParams;
  const selectedSymbol = firstParam(params.symbol) ?? "IRFC";

  return (
    <StockWorkspace
      selectedSymbol={selectedSymbol}
      suggestions={CHART_STOCKS.map(([symbol, name]) => ({ symbol, name }))}
    />
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  const selected = Array.isArray(value) ? value[0] : value;
  return selected?.trim() || undefined;
}
