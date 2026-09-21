"use client";

import Link from "next/link";

import { Logo } from "@/components/atoms/Logo";
import { MarketStatusDot } from "@/components/atoms/MarketStatusDot";
import { UserMenu } from "@/components/molecules/UserMenu";

/** App chrome for the signed-in area: brand, market state, profile menu. */
export function DashboardTopBar({
  name,
  email,
  marketOpen,
  marketLabel,
  onMenuClick,
}: {
  name: string;
  email: string;
  marketOpen: boolean;
  marketLabel: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 bg-brand px-4 shadow-[inset_0_-1px_0_rgb(255_255_255/0.08)] sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="-ml-1 cursor-pointer rounded-sm p-2 text-white/74 transition-colors duration-[120ms] ease-standard hover:bg-white/12 hover:text-white lg:hidden"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="size-5"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <Link href="/dashboard" className="flex items-center hover:no-underline">
        <Logo width={104} />
      </Link>

      <div className="flex-1" />

      <MarketStatusDot
        open={marketOpen}
        label={marketLabel}
        className="hidden sm:inline-flex"
        tone="onDark"
      />

      <UserMenu name={name} email={email} />
    </header>
  );
}
