import { NextResponse } from "next/server";

// A stream can never be cached or statically rendered.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";
const MAX_SYMBOLS = 200;

/**
 * Pipes the backend's server-sent events straight through to the browser.
 *
 * The browser cannot hold the Upstox websocket itself — Upstox allows only a
 * couple of sockets per user, and the token must stay in Python. So FastAPI
 * keeps one socket and fans it out; this route just relays those events.
 */
export async function GET(request: Request) {
  const symbolsParam = new URL(request.url).searchParams.get("symbols");

  const symbols =
    symbolsParam
      ?.split(",")
      .map((symbol) => symbol.trim())
      .filter(Boolean) ?? [];

  if (symbols.length === 0 || symbols.length > MAX_SYMBOLS) {
    return NextResponse.json(
      { message: `Pass between 1 and ${MAX_SYMBOLS} symbols.` },
      { status: 400 },
    );
  }

  const url = `${BACKEND_URL}/market/stream?symbols=${encodeURIComponent(
    symbols.join(","),
  )}`;

  try {
    const upstream = await fetch(url, {
      // Closing the browser tab aborts this fetch, which closes the backend
      // stream too. Without it the backend would keep the listener forever.
      signal: request.signal,
      cache: "no-store",
      headers: { Accept: "text/event-stream" },
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { message: `Backend stream returned ${upstream.status}` },
        { status: 503 },
      );
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    // Backend down or Upstox token expired. The client falls back to polling.
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unknown backend error",
      },
      { status: 503 },
    );
  }
}
