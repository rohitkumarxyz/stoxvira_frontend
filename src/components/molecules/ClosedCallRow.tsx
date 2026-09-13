import type { ClosedCall } from "@/lib/mock-data";

/** A closed call in the dark "Closed calls" panel. */
export function ClosedCallRow({ call }: { call: ClosedCall }) {
  return (
    <div className="grid grid-cols-[minmax(0,1.6fr)_0.9fr_0.9fr_0.8fr] items-baseline gap-3 py-3.5 shadow-[inset_0_-1px_0_rgb(255_255_255/0.16)]">
      <span className="truncate text-body text-white">{call.name}</span>
      <span className="font-mono text-overline text-white/60">
        {call.entry}
      </span>
      <span className="font-mono text-overline text-white/60">{call.exit}</span>
      <span
        className={`text-right font-mono text-label font-medium ${
          call.up ? "text-up-on-dark" : "text-down-on-dark"
        }`}
      >
        {call.ret}
      </span>
    </div>
  );
}
