"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type UIEvent } from "react";

import { Overline } from "@/components/atoms/Overline";
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

type PredictionDay = {
  day: number;
  date: string;
  predicted_price: number;
  change_percent: number;
  confidence: "low" | "medium" | "high";
  note: string;
};

type PredictionResult = {
  symbol: string;
  name: string;
  last_price: number;
  trend: "bullish" | "bearish" | "neutral";
  summary: string;
  days: PredictionDay[];
  disclaimer: string;
};

const HORIZON_OPTIONS = [1, 2, 3, 5, 7];

const TREND_PILL: Record<PredictionResult["trend"], string> = {
  bullish: "bg-tag-green-bg text-tag-green-text",
  bearish: "bg-tag-red-bg text-tag-red-text",
  neutral: "bg-tag-neutral-bg text-tag-neutral-text",
};

const CONFIDENCE_TAG: Record<PredictionDay["confidence"], string> = {
  high: "bg-tag-green-bg text-tag-green-text",
  medium: "bg-tag-cyan-bg text-tag-cyan-text",
  low: "bg-tag-neutral-bg text-tag-neutral-text",
};

export function PredictionWorkspace({
  selectedSymbol,
  suggestions,
}: {
  selectedSymbol?: string;
  suggestions: StockOption[];
}) {
  const router = useRouter();
  const symbol = selectedSymbol ?? suggestions[0]?.symbol;
  const stockName =
    suggestions.find((item) => item.symbol === symbol)?.name ?? symbol ?? "";
  const quotes = useQuotes();
  const quote = symbol ? quotes[symbol] : undefined;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // A different stock invalidates whatever forecast is on screen — showing
  // IRFC's numbers under a freshly picked INFY would be misleading.
  useEffect(() => {
    setResult(null);
    setError(null);
  }, [symbol]);

  async function searchStocks(value: string) {
    if (!value.trim()) {
      setResults([]);
      setSearchError(null);
      return;
    }

    setSearching(true);
    setSearchError(null);

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
      if (body.results.length === 0) setSearchError("No matching stocks.");
    } catch (searchErr) {
      setSearchError(
        searchErr instanceof Error ? searchErr.message : "Search failed.",
      );
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function selectStock(nextSymbol: string) {
    router.push(`/dashboard/predictions?symbol=${encodeURIComponent(nextSymbol)}`);
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

  async function generateForecast() {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, name: stockName, days }),
      });
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      const body = (await response.json()) as
        | PredictionResult
        | { message?: string };
      if (!response.ok) {
        throw new Error(
          (body as { message?: string }).message ?? "Forecast unavailable.",
        );
      }
      setResult(body as PredictionResult);
    } catch (forecastError) {
      setError(
        forecastError instanceof Error
          ? forecastError.message
          : "Forecast unavailable.",
      );
    } finally {
      setLoading(false);
    }
  }

  const percent = formatPercent(quote?.change_percent ?? null);

  return (
    <section className="-mb-16 mt-0 grid w-full gap-0 lg:h-[calc(100vh-3.5rem)] lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0 overflow-y-auto bg-canvas lg:h-full">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="rule-b flex items-start justify-between gap-4 pb-5">
            <div className="flex flex-col gap-1">
              <Overline tone="muted">FORECAST</Overline>
              <h1 className="text-display font-bold tracking-[-0.6px] text-ink">
                {stockName || "Choose a stock"}
              </h1>
              {symbol && <span className="font-mono text-label text-muted">{symbol}</span>}
            </div>
            {quote && (
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-md font-medium text-ink">
                  {formatPrice(quote.last_price)}
                </span>
                <span
                  className={`font-mono text-caption font-medium ${
                    quote.up ? "text-up" : "text-down"
                  }`}
                >
                  {percent ?? "—"}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 bg-card p-5">
            <Overline tone="muted">FORECAST HORIZON</Overline>
            <div className="flex flex-wrap items-center gap-2">
              {HORIZON_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDays(option)}
                  className={`rounded-full px-3.5 py-1.5 text-label font-medium transition-colors duration-[120ms] ${
                    days === option
                      ? "bg-brand text-white"
                      : "bg-field text-muted hover:text-ink"
                  }`}
                >
                  {option === 1 ? "Next day" : `${option} days`}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!symbol || loading}
              onClick={generateForecast}
              className="mt-1 self-start rounded-sm bg-brand px-4 py-2.5 text-label font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Generating forecast…"
                : result
                  ? "Regenerate forecast"
                  : "Generate forecast"}
            </button>
            {error && (
              <p className="text-label text-tag-red-text">{error}</p>
            )}
          </div>

          {result ? (
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-3 bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Overline tone="muted">OUTLOOK</Overline>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-overline font-medium capitalize ${
                      TREND_PILL[result.trend]
                    }`}
                  >
                    {result.trend}
                  </span>
                </div>
                <p className="text-label leading-relaxed text-ink">
                  {result.summary}
                </p>
              </div>

              <div className="bg-card">
                {result.days.map((day) => (
                  <div
                    key={day.day}
                    className="rule-b flex flex-col gap-2 p-5 last:shadow-none"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-label font-medium text-ink">
                          Day {day.day}
                        </span>
                        <span className="font-mono text-caption text-muted">
                          {formatForecastDate(day.date)}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-overline font-medium capitalize ${
                          CONFIDENCE_TAG[day.confidence]
                        }`}
                      >
                        {day.confidence} confidence
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-md font-medium text-ink">
                        {formatPrice(day.predicted_price)}
                      </span>
                      <span
                        className={`font-mono text-label font-medium ${
                          day.change_percent >= 0 ? "text-up" : "text-down"
                        }`}
                      >
                        {day.change_percent >= 0 ? "+" : ""}
                        {day.change_percent.toFixed(2)}%
                      </span>
                    </div>
                    {day.note && (
                      <p className="text-label text-muted">{day.note}</p>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-caption leading-relaxed text-hint">
                {result.disclaimer}
              </p>
            </div>
          ) : (
            !loading && (
              <div className="mt-4 flex flex-col items-center justify-center gap-2 bg-card px-6 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-brand-tint text-lg font-bold text-brand">
                  ✦
                </span>
                <p className="mt-2 text-md font-semibold text-ink">
                  Pick a horizon and generate a forecast
                </p>
                <p className="max-w-sm text-label leading-relaxed text-muted">
                  Stoxvira AI will combine the live price, recent trend, and
                  headlines for {stockName || "this stock"} into a day-by-day
                  estimate.
                </p>
              </div>
            )
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
        {searchError && (
          <p className="mt-3 text-label text-tag-red-text">{searchError}</p>
        )}

        <div
          className="mt-4 max-h-[calc(100vh-13rem)] overflow-y-auto"
          onScroll={loadNextBatch}
        >
          {(results.length > 0
            ? results.map((item) => ({
                symbol: item.trading_symbol,
                name: item.name,
              }))
            : suggestions.slice(0, visibleCount)
          ).map((stock) => {
            const rowQuote = quotes[stock.symbol];
            const rowPercent = formatPercent(rowQuote?.change_percent ?? null);

            return (
              <button
                key={stock.symbol}
                type="button"
                onClick={() => selectStock(stock.symbol)}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 border-b border-line px-2 py-3 text-left transition-colors duration-[120ms] ${
                  stock.symbol === symbol
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
                      stock.symbol === symbol ? "text-white/72" : "text-muted"
                    }`}
                  >
                    {stock.symbol}
                  </span>
                </span>
                <span
                  className={`shrink-0 text-right font-mono text-caption ${
                    rowQuote
                      ? rowQuote.up
                        ? "text-tag-green-text"
                        : "text-tag-red-text"
                      : stock.symbol === symbol
                        ? "text-white/72"
                        : "text-muted"
                  }`}
                >
                  <span className="block">
                    {rowQuote ? formatPrice(rowQuote.last_price) : "—"}
                  </span>
                  <span className="block">{rowPercent ?? "—"}</span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </section>
  );
}

function formatForecastDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00+05:30`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  }).format(parsed);
}
