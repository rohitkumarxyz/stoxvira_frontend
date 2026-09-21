"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

/**
 * Hero search. A hairline box with a flush button — the design draws no
 * radius here, so there is none.
 */
export function SearchField({
  placeholder = "Search a company or ticker",
  action = "Get verdict",
}: {
  placeholder?: string;
  action?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { instrument_key: string; trading_symbol: string; name: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const search = useCallback(async (value: string) => {
    setSearching(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(
        `/api/market/search?q=${encodeURIComponent(value)}`,
      );

      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent("/")}`);
        return;
      }

      if (!response.ok) {
        throw new Error("Search is unavailable. Try again.");
      }

      const body = (await response.json()) as {
        results: { instrument_key: string; trading_symbol: string; name: string }[];
      };
      setResults(body.results);
      if (body.results.length === 0) setError("No matching stocks found.");
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Search is unavailable. Try again.",
      );
    } finally {
      setSearching(false);
    }
  }, [router]);

  useEffect(() => {
    const value = query.trim();

    if (!value) return;

    const timer = window.setTimeout(() => {
      void search(value);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query, search]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (value) void search(value);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setError(null);
      setSearching(false);
    }
  }

  return (
    <div className="relative max-w-[520px]">
        <form
        onSubmit={handleSubmit}
        className="flex items-stretch shadow-[inset_0_0_0_1px_rgb(255_255_255/0.26)]"
        >
          <label className="flex min-w-0 flex-1 items-center px-4">
            <span className="sr-only">{placeholder}</span>
            <input
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              className="w-full bg-transparent py-4 text-body text-white outline-none placeholder:text-white/52"
            />
          </label>
          <button
            type="submit"
            className="shrink-0 cursor-pointer bg-canvas px-6.5 py-4 text-body font-medium text-brand transition-colors duration-[120ms] ease-standard hover:bg-white"
          >
            {searching ? "Searching…" : action}
          </button>
      </form>

      {(results.length > 0 || error) && (
        <div className="absolute top-full z-10 mt-2 w-full bg-card p-2 text-ink shadow-lg">
          {results.map((result) => (
            <button
              key={result.instrument_key}
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/chart?symbol=${encodeURIComponent(result.trading_symbol)}`,
                )
              }
              className="flex w-full cursor-pointer flex-col items-start gap-0.5 px-3 py-2.5 text-left hover:bg-field"
            >
              <span className="text-body font-medium">{result.name}</span>
              <span className="font-mono text-caption text-muted">
                {result.trading_symbol}
              </span>
            </button>
          ))}
          {error && (
            <p className="px-3 py-2 text-label text-white/72">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
