import type { ReactNode } from "react";

import { Overline } from "@/components/atoms/Overline";

/** One labelled read-only row on the profile page. */
export function ProfileField({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  /** Secondary note under the value, e.g. why something is unverified. */
  hint?: string;
}) {
  return (
    <div className="rule-b-subtle flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
      <div className="w-40 shrink-0">
        <Overline tone="muted">{label}</Overline>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body text-ink">{value}</span>
        {hint ? <span className="text-caption text-muted">{hint}</span> : null}
      </div>
    </div>
  );
}
