import { NextResponse } from "next/server";

import { fetchQuotes } from "@/lib/market";

// Quotes must never be cached by Next — the whole point is that they move.
export const dynamic = "force-dynamic";

const MAX_SYMBOLS = 200;

/**
 * The browser's only route to market data. It forwards to the Python backend,
 * which is what actually holds the Upstox token.
 */
export async function GET(request: Request) {
  const symbolsParam = new URL(request.url).searchParams.get("symbols");

  const symbols =
    symbolsParam
      ?.split(",")
      .map((symbol) => symbol.trim())
      .filter(Boolean) ?? [];

  if (symbols.length === 0) {
    return NextResponse.json(
      { message: "Pass at least one symbol, e.g. ?symbols=INFY,NIFTY 50" },
      { status: 400 },
    );
  }

  if (symbols.length > MAX_SYMBOLS) {
    return NextResponse.json(
      { message: `At most ${MAX_SYMBOLS} symbols per request.` },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json({ quotes: await fetchQuotes(symbols) });
  } catch (error) {
    // The backend being down or the Upstox token having expired is a normal
    // condition here, not a bug. The client keeps its last good values.
    return NextResponse.json(
      {
        quotes: {},
        message:
          error instanceof Error ? error.message : "Unknown backend error",
      },
      { status: 503 },
    );
  }
}
