import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { fetchHistoricalCandles } from "@/lib/market";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const symbol = params.get("symbol")?.trim() ?? "";
  const resolution = params.get("resolution") ?? "1D";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";

  if (!symbol || !from || !to) {
    return NextResponse.json(
      { message: "Symbol, from, and to are required." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await fetchHistoricalCandles(symbol, resolution, from, to));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "History unavailable.";
    const status = message.includes("Backend returned 401") ? 401 : 503;

    return NextResponse.json(
      { message },
      { status },
    );
  }
}
