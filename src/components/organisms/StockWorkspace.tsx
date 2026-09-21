"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type UIEvent } from "react";

import { useQuotes } from "@/components/providers/MarketDataProvider";
import { formatPercent, formatPrice } from "@/lib/market";

type StockOption = {
  symbol: string;
  name: string;
};

type SearchResult = {
  instrument_key: string;
  trading_symbol: string;
  name: string;
};

type ChartBar = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type RealtimeCallback = (bar: ChartBar) => void;

type ChartSubscription = {
  source: EventSource;
  callback: RealtimeCallback;
  resolution: string;
  lastBar?: ChartBar;
};

declare global {
  interface Window {
    TradingView?: {
      widget: new (options: {
        symbol: string;
        interval: string;
        container: HTMLDivElement;
        datafeed: object;
        library_path: string;
        autosize: boolean;
        fullscreen: boolean;
        timezone: string;
        theme: string;
        disabled_features: string[];
      }) => { remove: () => void };
    };
  }
}

export function StockWorkspace({
  selectedSymbol,
  suggestions,
}: {
  selectedSymbol?: string;
  suggestions: StockOption[];
}) {
  const router = useRouter();
  const quotes = useQuotes();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartWidgetRef = useRef<{ remove: () => void } | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  async function searchStocks(value: string) {
    if (!value.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/market/search?q=${encodeURIComponent(value.trim())}`,
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error("Search is unavailable.");

      const body = (await response.json()) as { results: SearchResult[] };
      setResults(body.results);
      if (body.results.length === 0) setError("No matching stocks.");
    } catch (searchError) {
      setError(
        searchError instanceof Error ? searchError.message : "Search failed.",
      );
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function selectStock(symbol: string) {
    router.push(`/dashboard/chart?symbol=${encodeURIComponent(symbol)}`);
  }

  function loadNextBatch(event: UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    if (
      !results.length &&
      element.scrollTop + element.clientHeight >= element.scrollHeight - 48
    ) {
      setVisibleCount((count) => count + 20);
    }
  }

  useEffect(() => {
    if (!selectedSymbol || !chartContainerRef.current) return;

    let cancelled = false;
    const script = document.createElement("script");
    script.src = "/static/charting_library/charting_library.js";
    script.async = true;
    script.onload = () => {
      if (cancelled || !chartContainerRef.current || !window.TradingView) return;

      const datafeed = createDatafeed(() => router.push("/login"));
      chartWidgetRef.current = new window.TradingView.widget({
        symbol: selectedSymbol,
        interval: "1D",
        container: chartContainerRef.current,
        datafeed,
        library_path: "/static/charting_library/",
        autosize: true,
        fullscreen: false,
        timezone: "Asia/Kolkata",
        theme: "Light",
        disabled_features: ["use_localstorage_for_settings"],
      });
    };
    document.body.appendChild(script);

    return () => {
      cancelled = true;
      chartWidgetRef.current?.remove();
      chartWidgetRef.current = null;
      script.remove();
    };
  }, [router, selectedSymbol]);

  return (
    <section className="-mb-16 mt-0 grid w-full gap-0 lg:h-[calc(100vh-3.5rem)] lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0 bg-card lg:h-full">
        <div className="h-[calc(100vh-3.5rem)] bg-brand lg:h-full">
          {selectedSymbol ? (
            <div ref={chartContainerRef} className="size-full" />
          ) : (
            <div className="flex size-full items-center justify-center px-6 text-center text-label text-white/72">
              Choose a stock from the list or search for a company to open its
              chart.
            </div>
          )}
        </div>
      </div>

      <aside className="bg-card p-4 lg:h-full">
        <label className="flex flex-col gap-1.5">
          <span className="text-label font-medium text-ink">
            Search company or ticker
          </span>
          <input
            type="search"
            value={query}
            placeholder="Try INFY or Infosys"
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              setVisibleCount(20);
              void searchStocks(value);
            }}
            className="rounded-sm bg-field px-3 py-2.5 text-label text-ink outline-none shadow-[inset_0_0_0_1px_transparent] focus:shadow-[inset_0_0_0_1.5px_var(--color-brand)]"
          />
        </label>

        {searching && <p className="mt-3 text-label text-muted">Searching…</p>}
        {error && <p className="mt-3 text-label text-tag-red-text">{error}</p>}

        <div
          className="mt-4 max-h-[calc(100vh-13rem)] overflow-y-auto"
          onScroll={loadNextBatch}
        >
          {(results.length > 0
            ? results.map((result) => ({
                symbol: result.trading_symbol,
                name: result.name,
              }))
            : suggestions.slice(0, visibleCount)
          ).map((stock) => {
            const quote = quotes[stock.symbol];
            const percent = formatPercent(quote?.change_percent ?? null);

            return (
            <button
              key={stock.symbol}
              type="button"
              onClick={() => selectStock(stock.symbol)}
              className={`flex w-full cursor-pointer items-center justify-between gap-3 border-b border-line px-2 py-3 text-left transition-colors duration-[120ms] ${
                stock.symbol === selectedSymbol
                  ? "bg-brand text-white"
                  : "hover:bg-field"
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-label font-medium">
                  {stock.name}
                </span>
                <span
                  className={`mt-0.5 block font-mono text-caption ${
                  stock.symbol === selectedSymbol
                    ? "text-white/72"
                    : "text-muted"
                  }`}
                >
                  {stock.symbol}
                </span>
              </span>
              <span
                className={`shrink-0 text-right font-mono text-caption ${
                  quote
                    ? quote.up
                      ? "text-tag-green-text"
                      : "text-tag-red-text"
                    : stock.symbol === selectedSymbol
                      ? "text-white/72"
                      : "text-muted"
                }`}
              >
                <span className="block">
                  {quote ? formatPrice(quote.last_price) : "—"}
                </span>
                <span className="block">{percent ?? "—"}</span>
              </span>
            </button>
            );
          })}
        </div>
      </aside>
    </section>
  );
}

function createDatafeed(onUnauthorized: () => void) {
  const subscriptions = new Map<string, ChartSubscription>();

  return {
    onReady(callback: (config: object) => void) {
      callback({
        supported_resolutions: ["1", "5", "15", "30", "60", "1D"],
      });
    },
    searchSymbols(
      userInput: string,
      _exchange: string,
      _symbolType: string,
      callback: (results: object[]) => void,
    ) {
      fetch(`/api/market/search?q=${encodeURIComponent(userInput)}`)
        .then((response) => response.json())
        .then((body: { results?: SearchResult[] }) => {
          callback(
            (body.results ?? []).map((result) => ({
              symbol: result.trading_symbol,
              full_name: result.trading_symbol,
              description: result.name,
              exchange: "NSE",
              ticker: result.trading_symbol,
              type: "stock",
            })),
          );
        })
        .catch(() => callback([]));
    },
    resolveSymbol(
      symbolName: string,
      onResolve: (info: object) => void,
      onError: (message: string) => void,
    ) {
      fetch(`/api/market/search?q=${encodeURIComponent(symbolName)}`)
        .then((response) => response.json())
        .then((body: { results?: SearchResult[] }) => {
          const result = body.results?.find(
            (item) => item.trading_symbol === symbolName,
          );
          if (!result) {
            onError("Symbol not found");
            return;
          }
          onResolve({
            ticker: result.trading_symbol,
            name: result.name,
            description: result.name,
            type: "stock",
            session: "0915-1530",
            timezone: "Asia/Kolkata",
            exchange: "NSE",
            minmov: 1,
            pricescale: 100,
            has_intraday: true,
            has_daily: true,
            has_weekly_and_monthly: true,
            supported_resolutions: ["1", "5", "15", "30", "60", "1D"],
            volume_precision: 0,
            data_status: "streaming",
          });
        })
        .catch(() => onError("Symbol lookup failed"));
    },
    getBars(
      symbolInfo: { ticker: string },
      resolution: string,
      periodParams: { from: number; to: number },
      onHistory: (bars: ChartBar[], meta: { noData: boolean }) => void,
      onError: (error: string) => void,
    ) {
      const from = new Date(periodParams.from * 1000).toISOString().slice(0, 10);
      const to = new Date(periodParams.to * 1000).toISOString().slice(0, 10);
      fetch(
        `/api/market/history?symbol=${encodeURIComponent(
          symbolInfo.ticker,
        )}&resolution=${encodeURIComponent(resolution)}&from=${from}&to=${to}`,
      )
        .then((response) => {
          if (response.status === 401) {
            onUnauthorized();
            throw new Error("Upstox login required.");
          }
          if (!response.ok) throw new Error("Historical data unavailable");
          return response.json();
        })
        .then(
          (body: {
            candles: [string, number, number, number, number, number][];
          }) => {
            const bars = body.candles
              .map(([time, open, high, low, close, volume]) => ({
                time: new Date(time).getTime(),
                open,
                high,
                low,
                close,
                volume,
              }))
              .sort((a, b) => a.time - b.time);
            onHistory(bars, { noData: bars.length === 0 });
          },
        )
        .catch((error: Error) => onError(error.message));
    },
    subscribeBars(
      symbolInfo: { ticker: string },
      resolution: string,
      onRealtimeCallback: RealtimeCallback,
      subscriberUID: string,
    ) {
      const source = new EventSource(
        `/api/market/stream?symbols=${encodeURIComponent(symbolInfo.ticker)}`,
      );
      const subscription: ChartSubscription = {
        source,
        callback: onRealtimeCallback,
        resolution,
      };
      subscriptions.set(subscriberUID, subscription);

      source.addEventListener("quotes", (event) => {
        const body = JSON.parse((event as MessageEvent).data) as {
          quotes?: {
            last_price: number;
          }[];
        };
        const quote = body.quotes?.[0];
        if (!quote) return;

        const now = Date.now();
        const bucket = intervalSeconds(resolution) * 1000;
        const barTime = Math.floor(now / bucket) * bucket;
        const previous = subscription.lastBar;
        const bar: ChartBar =
          previous?.time === barTime
            ? {
                ...previous,
                close: quote.last_price,
                high: Math.max(previous.high, quote.last_price),
                low: Math.min(previous.low, quote.last_price),
              }
            : {
                time: barTime,
                open: quote.last_price,
                high: quote.last_price,
                low: quote.last_price,
                close: quote.last_price,
                volume: 0,
              };

        subscription.lastBar = bar;
        subscription.callback(bar);
      });

      source.onerror = () => {
        // EventSource reconnects automatically. The backend stream remains
        // the source of truth for reconnect and token errors.
      };
    },
    unsubscribeBars(subscriberUID: string) {
      const subscription = subscriptions.get(subscriberUID);
      if (!subscription) return;
      subscription.source.close();
      subscriptions.delete(subscriberUID);
    },
  };
}

function intervalSeconds(resolution: string): number {
  if (resolution === "1D") return 24 * 60 * 60;
  const minutes = Number.parseInt(resolution, 10);
  return Number.isFinite(minutes) && minutes > 0 ? minutes * 60 : 60;
}
