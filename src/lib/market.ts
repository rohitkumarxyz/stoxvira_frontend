// Client for the Python backend. Request path is browser -> Next route ->
// FastAPI -> Upstox, so the Upstox access token stays in the Python process.

import { moverGroups, picks, ticker } from "@/lib/mock-data";

export type Quote = {
  symbol: string;
  name: string;
  instrument_key: string;
  last_price: number;
  prev_close: number | null;
  change: number | null;
  change_percent: number | null;
  up: boolean;
};

export type QuotesResponse = {
  quotes: Quote[];
  // Symbols the backend could not map to an Upstox instrument.
  unresolved: string[];
};

export type InstrumentSearchResult = {
  instrument_key: string;
  trading_symbol: string;
  name: string;
};

export type HistoricalCandlesResponse = {
  symbol: string;
  name: string;
  instrument_key: string;
  candles: [string, number, number, number, number, number][];
};

// Keyed by symbol, which is how every consumer looks quotes up.
export type QuoteMap = Record<string, Quote>;

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export const POLL_INTERVAL_MS = 30_000;

export const CHART_STOCKS = [
  ["IRFC", "Indian Railway Finance"],
  ["TMPV", "Tata Motors Passenger"],
  ["INFY", "Infosys"],
  ["SBIN", "State Bank of India"],
  ["BEL", "Bharat Electronics"],
  ["CUMMINSIND", "Cummins India"],
  ["FEDERALBNK", "Federal Bank"],
  ["DMART", "Avenue Supermarts"],
  ["KIRLOSENG", "Kirloskar Oil Engines"],
  ["PERSISTENT", "Persistent Systems"],
  ["ASIANPAINT", "Asian Paints"],
  ["VEDL", "Vedanta"],
  ["HDFCBANK", "HDFC Bank"],
  ["ETERNAL", "Eternal"],
  ["ITC", "ITC"],
  ["RELIANCE", "Reliance Industries"],
  ["TCS", "Tata Consultancy Services"],
  ["ICICIBANK", "ICICI Bank"],
  ["AXISBANK", "Axis Bank"],
  ["LT", "Larsen & Toubro"],
  ["MARUTI", "Maruti Suzuki"],
  ["HINDUNILVR", "Hindustan Unilever"],
  ["SUNPHARMA", "Sun Pharma"],
  ["TITAN", "Titan Company"],
  ["BAJFINANCE", "Bajaj Finance"],
  ["KOTAKBANK", "Kotak Mahindra Bank"],
  ["ADANIENT", "Adani Enterprises"],
  ["WIPRO", "Wipro"],
  ["NTPC", "NTPC"],
  ["ONGC", "Oil & Natural Gas Corporation"],
] as const;

// One list of every symbol the home page needs, so a page load costs one
// request instead of one per section.
export const HOME_SYMBOLS: string[] = Array.from(
  new Set([
    ...CHART_STOCKS.map(([symbol]) => symbol),
    ...ticker.map((quote) => quote.symbol),
    ...picks.map((pick) => pick.ticker),
    ...moverGroups.flatMap((group) => group.rows.map((row) => row.ticker)),
  ]),
);

// Server side only: called by the page and by our own route handler.
export async function fetchQuotes(symbols: string[]): Promise<QuoteMap> {
  if (symbols.length === 0) return {};

  const url = `${BACKEND_URL}/market/quotes?symbols=${encodeURIComponent(
    symbols.join(","),
  )}`;

  const response = await fetch(url, {
    // Prices go stale in seconds, and the backend already caches for 10s.
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(
      `Backend returned ${response.status} for /market/quotes`,
    );
  }

  const body = (await response.json()) as QuotesResponse;
  return toQuoteMap(body.quotes);
}

// fetchQuotes that never throws. A dead backend or expired Upstox token
// should leave the page on its fallback values instead of crashing it.
export async function fetchQuotesOrEmpty(
  symbols: string[],
): Promise<QuoteMap> {
  try {
    return await fetchQuotes(symbols);
  } catch {
    return {};
  }
}

export async function searchInstruments(
  query: string,
): Promise<InstrumentSearchResult[]> {
  const url = `${BACKEND_URL}/market/search?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status} for /market/search`);
  }

  return (await response.json()) as InstrumentSearchResult[];
}

export async function fetchHistoricalCandles(
  symbol: string,
  resolution: string,
  from: string,
  to: string,
): Promise<HistoricalCandlesResponse> {
  const url = `${BACKEND_URL}/market/history?symbol=${encodeURIComponent(
    symbol,
  )}&resolution=${encodeURIComponent(resolution)}&from=${encodeURIComponent(
    from,
  )}&to=${encodeURIComponent(to)}`;
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Backend returned ${response.status} for /market/history`);
  }
  return (await response.json()) as HistoricalCandlesResponse;
}

export function toQuoteMap(quotes: Quote[]): QuoteMap {
  return Object.fromEntries(quotes.map((quote) => [quote.symbol, quote]));
}

// The backend sends plain numbers, so formatting lives here.

// Index levels keep two decimals: "23,346.40".
export function formatIndexValue(value: number): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Share prices are shown whole: "₹ 1,051".
export function formatPrice(value: number): string {
  return `₹ ${Math.round(value).toLocaleString("en-IN")}`;
}

// Always signed, so a flat day reads "+0.00%" and not a bare "0%".
export function formatPercent(value: number | null): string | null {
  if (value === null) return null;
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
