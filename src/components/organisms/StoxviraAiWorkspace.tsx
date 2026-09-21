"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

type SearchResult = {
  trading_symbol: string;
  name: string;
};

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

type ConversationSession = {
  id: string;
  intent: "Buy" | "Sell";
  stock: SearchResult;
  holdingPeriod: string;
  messages: Message[];
  updatedAt: string | number;
};

const HOLDING_PERIODS = ["Intraday", "1–4 weeks", "1–6 months", "6+ months"];

export function StoxviraAiWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [intent, setIntent] = useState<"Buy" | "Sell" | null>(null);
  const [stockQuery, setStockQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<SearchResult | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [holdingPeriod, setHoldingPeriod] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const [lastFailedQuestion, setLastFailedQuestion] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const streamControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadConversations() {
      try {
        const response = await fetch("/api/ai/conversations");
        if (!response.ok) return;
        const body = (await response.json()) as {
          conversations?: ConversationSession[];
        };
        if (!cancelled) {
          const loadedSessions = body.conversations ?? [];
          const requestedId = searchParams.get("conversation");
          const requestedSession = loadedSessions.find(
            (session) => session.id === requestedId,
          );
          if (requestedSession) openSession(requestedSession);
        }
      } catch {
        // History can be opened again to retry.
      }
    }
    void loadConversations();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: aiLoading ? "auto" : "smooth" });
  }, [messages, aiLoading]);

  async function searchStocks(value: string) {
    setStockQuery(value);
    setSelectedStock(null);
    setSearchError(null);
    if (!value.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `/api/market/search?q=${encodeURIComponent(value.trim())}`,
      );
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (!response.ok) throw new Error("Search unavailable");
      const body = (await response.json()) as { results?: SearchResult[] };
      const matches = body.results ?? [];
      setResults(matches.slice(0, 6));
      if (matches.length === 0) setSearchError("No matching stocks found.");
    } catch (error) {
      setResults([]);
      setSearchError(
        error instanceof Error ? error.message : "Search unavailable.",
      );
    } finally {
      setSearching(false);
    }
  }

  function startConversation() {
    if (!intent || !selectedStock || !holdingPeriod) return;
    void sendMessageText(
      `Give me a complete ${intent.toLowerCase()} analysis of ${selectedStock.trading_symbol} for a ${holdingPeriod.toLowerCase()} holding period. Include the current price, trend, recent news, key reasons, risks, and a clear conclusion.`,
    );
  }

  async function sendMessageText(text: string) {
    if (!text || !intent || !selectedStock || !holdingPeriod) return;
    setMessage("");
    setPersistenceError(null);
    setLastFailedQuestion(null);
    setAiLoading(true);
    const controller = new AbortController();
    streamControllerRef.current = controller;
    const userMessageId = Date.now();
    const assistantMessageId = userMessageId + 1;
    const conversationMessages =
      messages.length === 1 &&
      messages[0]?.role === "assistant" &&
      messages[0].text.startsWith("I’m ready to discuss")
        ? []
        : messages;
    const nextMessages = [
      ...conversationMessages,
      { id: userMessageId, role: "user", text },
      { id: assistantMessageId, role: "assistant", text: "" },
    ] as Message[];
    setMessages(nextMessages);

    try {
      const analysisResponse = await fetch("/api/ai/analyze/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          symbol: selectedStock.trading_symbol,
          name: selectedStock.name,
          intent,
          holding_period: holdingPeriod,
          question: text,
        }),
      });
      if (analysisResponse.status === 401) {
        router.push("/login");
        return;
      }
      if (!analysisResponse.ok || !analysisResponse.body) {
        const body = (await analysisResponse.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(body?.message ?? "AI analysis unavailable.");
      }

      const reader = analysisResponse.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const event of events) {
          const line = event.split("\n").find((item) => item.startsWith("data: "));
          if (!line) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;
          const data = JSON.parse(payload) as { token?: string; error?: string };
          if (data.error) throw new Error(data.error);
          if (data.token) {
            answer += data.token;
            setMessages((current) =>
              current.map((item) =>
                item.id === assistantMessageId
                  ? { ...item, text: answer }
                  : item,
              ),
            );
          }
        }
        if (done) break;
      }
      if (!answer) throw new Error("AI returned an empty response.");
      const completedMessages = nextMessages.map((item) =>
        item.id === assistantMessageId ? { ...item, text: answer } : item,
      );
      setMessages(completedMessages);

      if (!conversationId) {
        const response = await fetch("/api/ai/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            intent,
            stock: selectedStock,
            holdingPeriod,
            messages: completedMessages,
          }),
        });
        const saveBody = (await response.json().catch(() => null)) as
          | { id?: string; message?: string }
          | null;
        if (!response.ok || !saveBody?.id) {
          throw new Error(saveBody?.message ?? "Conversation could not be saved.");
        }
        const savedConversationId = saveBody.id;
        setConversationId(savedConversationId);
      } else {
        const response = await fetch(`/api/ai/conversations/${conversationId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: completedMessages }),
        });
        const saveBody = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        if (!response.ok) {
          throw new Error(saveBody?.message ?? "Conversation could not be saved.");
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setPersistenceError("Response stopped.");
      } else {
        setLastFailedQuestion(text);
        setPersistenceError(
          error instanceof Error ? error.message : "AI analysis unavailable.",
        );
      }
    } finally {
      setAiLoading(false);
      streamControllerRef.current = null;
    }
  }

  function sendMessage() {
    void sendMessageText(message.trim());
  }

  function stopGeneration() {
    streamControllerRef.current?.abort();
  }

  async function copyMessage(id: number, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    window.setTimeout(() => setCopiedMessageId(null), 1600);
  }

  function retryLastMessage() {
    if (lastFailedQuestion) void sendMessageText(lastFailedQuestion);
  }

  const ready = Boolean(intent && selectedStock && holdingPeriod);
  const conversationStarted = messages.some((item) => item.role === "user");

  function startNewConversation() {
    setIntent(null);
    setStockQuery("");
    setSelectedStock(null);
    setHoldingPeriod(null);
    setMessages([]);
    setConversationId(null);
    setMessage("");
    setPersistenceError(null);
  }

  function openSession(session: ConversationSession) {
    setIntent(session.intent);
    setStockQuery(session.stock.name);
    setSelectedStock(session.stock);
    setHoldingPeriod(session.holdingPeriod);
    setMessages(session.messages);
    setConversationId(session.id);
    setMessage("");
    setPersistenceError(null);
  }

  return (
    <div className="-mb-16 flex w-full flex-col bg-canvas lg:h-[calc(100vh-3.5rem)]">
        {!conversationStarted && (
        <section className="shrink-0 border-b border-line bg-card px-4 py-6 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-caption uppercase tracking-[0.08em] text-muted">
                  Stoxvira AI
                </p>
                <h1 className="mt-2 font-display text-lg font-bold text-ink">
                  Build your market view
                </h1>
                <p className="mt-1 text-label text-muted">
                  Set the context and get a live, research-backed analysis.
                </p>
              </div>
              <span className="hidden rounded-full bg-brand-tint px-3 py-1 font-mono text-caption text-brand sm:block">
                AI RESEARCH
              </span>
            </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Intent", intent ? `${intent} view` : "Buy or sell"],
              ["02", "Stock", selectedStock?.trading_symbol ?? "Choose a company"],
              ["03", "Horizon", holdingPeriod ?? "Set your timeframe"],
            ].map(([step, label, value]) => (
              <div
                key={step}
                className={`rounded-sm border px-3 py-3 ${
                  (label === "Intent" && intent) ||
                  (label === "Stock" && selectedStock) ||
                  (label === "Horizon" && holdingPeriod)
                    ? "border-brand bg-brand-tint"
                    : "border-line bg-card"
                }`}
              >
                <p className="font-mono text-caption text-muted">{step} · {label}</p>
                <p className="mt-1 truncate text-label font-medium text-ink">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7">
            <p className="text-label font-medium text-ink">What are you planning?</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["Buy", "Sell"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setIntent(option)}
                  className={`rounded-sm border px-4 py-3 text-left text-label font-medium transition-colors ${
                    intent === option
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-card text-ink hover:bg-field"
                  }`}
                >
                  {option} a stock
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-label font-medium text-ink" htmlFor="ai-stock">
              Which stock?
            </label>
            <input
              id="ai-stock"
              type="search"
              value={selectedStock?.name ?? stockQuery}
              placeholder="Search company or ticker"
              onChange={(event) => void searchStocks(event.target.value)}
              className="mt-2 w-full rounded-sm bg-field px-3 py-3 text-label text-ink outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-brand)]"
            />
            {searching && <p className="mt-2 text-caption text-muted">Searching…</p>}
            {searchError && (
            <p className="mt-2 text-caption text-tag-red-text">{searchError}</p>
            )}
            {results.length > 0 && !selectedStock && (
              <div className="mt-2 border border-line bg-card">
                {results.map((result) => (
                  <button
                    key={result.trading_symbol}
                    type="button"
                    onClick={() => {
                      setSelectedStock(result);
                      setStockQuery(result.name);
                      setResults([]);
                    }}
                    className="flex w-full items-center justify-between border-b border-line px-3 py-2.5 text-left last:border-b-0 hover:bg-field"
                  >
                    <span className="text-label text-ink">{result.name}</span>
                    <span className="font-mono text-caption text-muted">
                      {result.trading_symbol}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <p className="text-label font-medium text-ink">How long might you hold it?</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {HOLDING_PERIODS.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setHoldingPeriod(period)}
                  className={`rounded-sm border px-3 py-2.5 text-left text-label transition-colors ${
                    holdingPeriod === period
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-card text-ink hover:bg-field"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!ready}
            onClick={startConversation}
            className="mt-8 w-full rounded-sm bg-brand px-4 py-3 text-label font-medium text-white transition-opacity hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Analyze this stock
          </button>
          </div>
        </section>
        )}

        <section className="relative flex min-h-0 flex-1 flex-col bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-4 sm:px-8 sm:py-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-caption font-bold text-white">
                  S
                </span>
                <div className="min-w-0">
                  <p className="truncate text-label font-semibold text-ink">
                    {selectedStock?.name ?? "Stoxvira AI"}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-caption text-muted">
                    {ready
                      ? `${intent} · ${selectedStock?.trading_symbol} · ${holdingPeriod}`
                      : "Your personal market research assistant"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
            <button
              type="button"
              title="New conversation"
              aria-label="New conversation"
              onClick={startNewConversation}
              className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:bg-field hover:text-brand"
            >
              <span className="text-xl leading-none">+</span>
            </button>
            <button
              type="button"
              title="Conversation history"
              aria-label="Conversation history"
              onClick={() => router.push("/dashboard/ai/history")}
              className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:bg-field hover:text-brand"
            >
              <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-5">
                <path d="M4 6h16M4 12h10M4 18h16" />
                <path d="M18 10v8m-3-3 3 3 3-3" />
              </svg>
            </button>
            <button
              type="button"
              title={selectedStock ? "Open historical chart" : "Select a stock first"}
              aria-label={selectedStock ? "Open historical chart" : "Select a stock first"}
              disabled={!selectedStock}
              onClick={() => {
                if (selectedStock) {
                  router.push(
                    `/dashboard/chart?symbol=${encodeURIComponent(
                      selectedStock.trading_symbol,
                    )}`,
                  );
                }
              }}
              className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:bg-field hover:text-brand disabled:cursor-not-allowed disabled:opacity-35"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M3 17 8 11l4 3 8-9" />
                <path d="M16 5h4v4" />
              </svg>
            </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
            {messages.length > 0 ? (
              <div className="mx-auto max-w-3xl space-y-5">
                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-3 ${
                      item.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {item.role === "assistant" && (
                      <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-caption font-bold text-white">
                        S
                      </span>
                    )}
                    <div
                      className={`max-w-[calc(100%-2.5rem)] text-label ${
                        item.role === "assistant"
                          ? "text-ink"
                          : "rounded-md bg-brand px-4 py-3 text-white"
                      }`}
                    >
                    {item.role === "assistant" ? (
                      <>
                        {item.text ? (
                          <FormattedAssistantMessage text={item.text} />
                        ) : (
                          <TypingIndicator />
                        )}
                        {item.text && (
                          <div className="mt-4 flex gap-3 border-t border-line pt-2">
                            <button
                              type="button"
                              onClick={() => void copyMessage(item.id, item.text)}
                              className="text-caption text-muted hover:text-brand"
                            >
                              {copiedMessageId === item.id ? "Copied" : "Copy"}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      item.text
                    )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mx-auto flex h-full min-h-64 max-w-md flex-col items-center justify-center px-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-brand-tint text-lg font-bold text-brand">
                  ✦
                </span>
                <p className="mt-4 text-md font-semibold text-ink">
                  {ready ? "Your analysis is one click away" : "Your market workspace"}
                </p>
                <p className="mt-2 text-label leading-relaxed text-muted">
                  {ready
                    ? "We’ll combine live price data, trend context, and recent headlines into a clear view."
                    : "Choose a stock and time horizon above to start a focused research conversation."}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-line bg-card px-4 py-4 sm:px-8">
            <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-md border border-line bg-field p-2 focus-within:shadow-[inset_0_0_0_1.5px_var(--color-brand)]">
              <textarea
                rows={1}
                value={message}
                placeholder={
                  aiLoading
                    ? "Stoxvira AI is analysing…"
                    : ready
                      ? "Ask Stoxvira AI…"
                      : "Complete the starter questions first"
                }
                disabled={!ready || aiLoading}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                className="min-h-10 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-label text-ink outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="button"
                onClick={aiLoading ? stopGeneration : sendMessage}
                disabled={!ready || (!aiLoading && !message.trim())}
                className="rounded-sm bg-brand px-4 py-2 text-label font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {aiLoading ? "Stop" : "Send"}
              </button>
            </div>
            <p className="mt-2 text-caption text-muted">
              {conversationStarted
                ? "Ask a follow-up question about this stock."
                : "Complete the starter questions above before sending a message."}
            </p>
            {persistenceError && (
              <div className="mt-2 flex items-center gap-3 rounded-sm bg-tag-red-bg px-3 py-2 text-caption text-tag-red-text">
                <span>{persistenceError}</span>
                {lastFailedQuestion && (
                  <button
                    type="button"
                    onClick={retryLastMessage}
                    className="font-medium underline"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
            </div>
          </div>
        </section>
    </div>
  );
}

function FormattedAssistantMessage({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);

  return (
    <div className="space-y-2 leading-relaxed">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-1" />;

        const isBullet = /^[-*]\s+/.test(trimmed);
        const content = isBullet ? trimmed.replace(/^[-*]\s+/, "") : trimmed;

        return (
          <div key={index} className={isBullet ? "flex gap-2" : undefined}>
            {isBullet && <span className="text-brand">•</span>}
            <span>{formatInlineMessage(content)}</span>
          </div>
        );
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-2" aria-label="Stoxvira AI is typing">
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          className="size-1.5 animate-pulse rounded-full bg-brand"
          style={{ animationDelay: `${item * 160}ms` }}
        />
      ))}
    </div>
  );
}

function formatInlineMessage(text: string): ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="text-muted">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
