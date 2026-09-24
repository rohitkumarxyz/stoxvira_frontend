import { redirect } from "next/navigation";

import { PredictionWorkspace } from "@/components/organisms/PredictionWorkspace";
import { getSession } from "@/lib/auth";
import { CHART_STOCKS } from "@/lib/market";

export const dynamic = "force-dynamic";

export const metadata = { title: "Predictions — StoxVira" };

export default async function PredictionsPage({
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
    <PredictionWorkspace
      selectedSymbol={selectedSymbol}
      suggestions={CHART_STOCKS.map(([symbol, name]) => ({ symbol, name }))}
    />
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  const selected = Array.isArray(value) ? value[0] : value;
  return selected?.trim() || undefined;
}
