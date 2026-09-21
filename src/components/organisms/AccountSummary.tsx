import Link from "next/link";

import { Avatar } from "@/components/atoms/Avatar";
import { Overline } from "@/components/atoms/Overline";

/**
 * Who you are, on the overview. Read-only; Profile is where it gets edited.
 *
 * Flat panel, hairline rules, no rounded corners or ring — the same
 * treatment as VerdictCard on the marketing side.
 */
export function AccountSummary({
  name,
  email,
  memberSince,
  emailVerified,
  className = "",
}: {
  name: string;
  email: string;
  memberSince: string;
  emailVerified: boolean;
  className?: string;
}) {
  return (
    <section className={`flex flex-col ${className}`}>
      <div className="rule-b flex items-start justify-between gap-4 p-6">
        <div className="flex min-w-0 items-center gap-3.5">
          <Avatar name={name} size="lg" className="bg-brand-tint text-brand" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 className="truncate text-display font-bold tracking-[-0.6px] text-ink">
              {name}
            </h2>
            <Overline tone="muted">{email.toUpperCase()}</Overline>
          </div>
        </div>

        <Link
          href="/dashboard/profile"
          className="shrink-0 text-label font-medium text-brand"
        >
          profile
        </Link>
      </div>

      <div className="grid flex-1 grid-cols-2">
        <div className="flex flex-col gap-1 p-6">
          <Overline tone="muted">MEMBER SINCE</Overline>
          <span className="font-mono text-md font-medium text-ink">
            {memberSince}
          </span>
        </div>

        <div className="flex flex-col gap-1 p-6 shadow-[inset_1px_0_0_var(--color-line)]">
          <Overline tone="muted">EMAIL</Overline>
          <span
            className={`font-mono text-md font-medium ${
              emailVerified ? "text-up" : "text-muted"
            }`}
          >
            {emailVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      </div>
    </section>
  );
}
