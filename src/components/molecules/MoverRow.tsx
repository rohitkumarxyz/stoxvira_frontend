import { VerdictLabel } from "@/components/atoms/VerdictLabel";
import type { Mover } from "@/lib/mock-data";

/** One line in a "The tape today" column. */
export function MoverRow({ mover }: { mover: Mover }) {
  return (
    <div className="rule-b-subtle grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-4 py-3.5">
      <span className="truncate text-body">{mover.name}</span>
      <span className="font-mono text-label text-muted">{mover.price}</span>
      <span
        className={`font-mono text-label font-medium ${
          mover.up ? "text-up" : "text-down"
        }`}
      >
        {mover.change}
      </span>
      <span className="w-16 text-right">
        <VerdictLabel verdict={mover.verdict} size="label" />
      </span>
    </div>
  );
}
