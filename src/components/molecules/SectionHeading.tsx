import type { ReactNode } from "react";

import { Overline } from "@/components/atoms/Overline";

/**
 * The repeated section header: 28px title, mono meta, optional right-hand
 * link, all sitting on a 2px brass rule.
 */
export function SectionHeading({
  title,
  meta,
  action,
  tone = "light",
}: {
  title: string;
  meta?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div className="rule-accent flex flex-wrap items-baseline gap-4 pb-3.5">
      <h2
        className={`text-display font-bold tracking-[-0.8px] ${
          tone === "dark" ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {meta ? (
        <Overline tone={tone === "dark" ? "onDark" : "muted"}>{meta}</Overline>
      ) : null}
      <div className="flex-1" />
      {action}
    </div>
  );
}
