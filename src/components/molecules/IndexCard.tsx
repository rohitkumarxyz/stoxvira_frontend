import { Sparkline } from "@/components/atoms/Sparkline";
import type { IndexQuote } from "@/lib/mock-data";

/** One index in the white strip under the hero: name, value, change, sparkline. */
export function IndexCard({ quote }: { quote: IndexQuote }) {
  const tone = quote.up ? "text-up" : "text-down";

  return (
    <div className="flex items-center gap-3.5 py-4 pr-5 shadow-[inset_-1px_0_0_var(--color-line-subtle)] last:shadow-none">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-mono text-caption text-muted">{quote.name}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-md font-medium">{quote.value}</span>
          <span className={`text-caption font-medium ${tone}`}>
            {quote.change}
          </span>
        </div>
      </div>
      <Sparkline points={quote.points} className={tone} />
    </div>
  );
}
