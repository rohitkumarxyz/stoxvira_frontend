"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  POLL_INTERVAL_MS,
  toQuoteMap,
  type Quote,
  type QuoteMap,
} from "@/lib/market";

const MarketDataContext = createContext<QuoteMap>({});

/**
 * Holds live prices for the whole page.
 *
 * Three layers, in order:
 *   1. The server renders the first set, so nothing flashes on load.
 *   2. An SSE stream pushes every tick — that is the live path.
 *   3. A 30s poll runs alongside as a safety net, for when the stream drops
 *      or the market is closed and nothing is being pushed at all.
 *
 * One request covers every section, so eight pick rows and a ticker tape are
 * not eight separate subscriptions.
 */
export function MarketDataProvider({
  initialQuotes,
  symbols,
  children,
}: {
  initialQuotes: QuoteMap;
  symbols: string[];
  children: ReactNode;
}) {
  const [quotes, setQuotes] = useState<QuoteMap>(initialQuotes);

  // Keeps the effects from re-subscribing when the parent re-renders and
  // hands us a new array with identical contents.
  const symbolsKey = symbols.join(",");

  // Merge rather than replace: a symbol absent from one message must not
  // blank out a price we already have.
  function merge(incoming: QuoteMap) {
    setQuotes((previous) => ({ ...previous, ...incoming }));
  }

  useEffect(() => {
    const source = new EventSource(
      `/api/market/stream?symbols=${encodeURIComponent(symbolsKey)}`,
    );

    source.addEventListener("quotes", (event) => {
      try {
        const body = JSON.parse((event as MessageEvent).data) as {
          quotes: Quote[];
        };
        merge(toQuoteMap(body.quotes));
      } catch {
        // A malformed frame is not worth tearing the stream down for.
      }
    });

    // EventSource reconnects on its own, so there is nothing to do here
    // beyond not crashing. The poll below covers the gap meanwhile.
    source.onerror = () => {};

    return () => source.close();
  }, [symbolsKey]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch(
          `/api/market/quotes?symbols=${encodeURIComponent(symbolsKey)}`,
          { cache: "no-store" },
        );
        if (!response.ok) return; // Keep the last good prices on screen.

        const body = (await response.json()) as { quotes: QuoteMap };
        if (!cancelled && body.quotes) merge(body.quotes);
      } catch {
        // Offline, backend down, token expired — try again next interval.
      }
    }

    const timer = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [symbolsKey]);

  return (
    <MarketDataContext.Provider value={quotes}>
      {children}
    </MarketDataContext.Provider>
  );
}

/** One live quote, or undefined when we have no real price for that symbol. */
export function useQuote(symbol: string): Quote | undefined {
  return useContext(MarketDataContext)[symbol];
}

export function useQuotes(): QuoteMap {
  return useContext(MarketDataContext);
}
