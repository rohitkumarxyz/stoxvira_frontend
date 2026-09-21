"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ConversationSession = {
  id: string;
  intent: "Buy" | "Sell";
  stock: { trading_symbol: string; name: string };
  holdingPeriod: string;
  messages: { role: "user" | "assistant"; text: string }[];
  updatedAt: string | number;
};

export default function AiHistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Buy" | "Sell">("All");

  useEffect(() => {
    fetch("/api/ai/conversations")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load history.");
        const body = (await response.json()) as {
          conversations?: ConversationSession[];
        };
        setSessions(body.conversations ?? []);
      })
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredSessions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sessions.filter((session) => {
      const matchesFilter = filter === "All" || session.intent === filter;
      const matchesQuery =
        !needle ||
        session.stock.name.toLowerCase().includes(needle) ||
        session.stock.trading_symbol.toLowerCase().includes(needle) ||
        session.messages.some((message) =>
          message.text.toLowerCase().includes(needle),
        );
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, sessions]);

  return (
    <section className="min-h-[calc(100vh-3.5rem)] bg-canvas px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard/ai")}
          className="text-label text-muted hover:text-brand"
        >
          ← Back to Stoxvira AI
        </button>
        <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-caption uppercase tracking-[0.08em] text-muted">
              Stoxvira AI
            </p>
            <h1 className="mt-2 font-display text-display font-bold text-ink">
              Conversation history
            </h1>
            <p className="mt-2 text-body text-muted">
              Reopen any saved stock analysis and continue where you left off.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-tint px-3 py-1 font-mono text-caption text-brand">
              {sessions.length} SAVED
            </span>
            <button
              type="button"
              onClick={() => router.push("/dashboard/ai")}
              className="rounded-sm bg-brand px-3 py-2 text-label font-medium text-white hover:bg-brand/90"
            >
              New analysis
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-sm border border-line bg-card px-3 py-2.5 focus-within:shadow-[inset_0_0_0_1.5px_var(--color-brand)]">
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0 text-muted">
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search company, ticker, or question"
              className="min-w-0 flex-1 bg-transparent text-label text-ink outline-none placeholder:text-hint"
            />
          </label>
          <div className="flex rounded-sm border border-line bg-card p-1">
            {(["All", "Buy", "Sell"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-xs px-3 py-2 text-label ${
                  filter === option
                    ? "bg-brand text-white"
                    : "text-muted hover:bg-field hover:text-ink"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-md border border-line bg-card">
          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-16 animate-pulse rounded-sm bg-field" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-md font-semibold text-ink">No conversations yet</p>
              <p className="mt-2 text-label text-muted">
                Your completed stock analyses will appear here.
              </p>
              <button
                type="button"
                onClick={() => router.push("/dashboard/ai")}
                className="mt-5 rounded-sm bg-brand px-4 py-3 text-label font-medium text-white"
              >
                Start an analysis
              </button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-md font-semibold text-ink">No matching conversations</p>
              <p className="mt-2 text-label text-muted">
                Try another ticker, company name, or filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {filteredSessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() =>
                    router.push(`/dashboard/ai?conversation=${session.id}`)
                  }
                  className="group flex w-full items-center justify-between gap-4 px-4 py-5 text-left transition-colors hover:bg-field sm:px-6"
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-tint font-mono text-caption font-bold text-brand">
                      {session.stock.trading_symbol.slice(0, 2)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-label font-semibold text-ink">
                        {session.stock.name}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-2 font-mono text-caption text-muted">
                        <span>{session.stock.trading_symbol}</span>
                        <span className={session.intent === "Buy" ? "text-up" : "text-down"}>
                          {session.intent}
                        </span>
                        <span>{session.holdingPeriod}</span>
                      </span>
                      <span className="mt-2 block truncate text-label text-muted">
                      {session.messages.find((message) => message.role === "user")
                        ?.text ?? "Stock analysis"}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-mono text-caption text-muted">
                      {new Date(session.updatedAt).toLocaleDateString("en-IN")}
                    </span>
                    <span className="mt-2 block text-label text-brand opacity-0 transition-opacity group-hover:opacity-100">
                      Open →
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
