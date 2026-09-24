/**
 * The sidebar icon set. Hand-drawn on a 24px grid at 1.5px stroke so they sit
 * at the same weight as the rest of the system's hairlines.
 */

export type NavIconName =
  | "overview"
  | "chart"
  | "predict"
  | "ai"
  | "research"
  | "profile";

const PATHS: Record<NavIconName, React.ReactNode> = {
  // Four panes — a summary of everything.
  overview: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </>
  ),
  chart: (
    <>
      <path d="M3 17 8 11l4 3 8-9" />
      <path d="M16 5h4v4" />
    </>
  ),
  // A trend line that turns dashed past "today" — where known data ends and
  // the forecast begins.
  predict: (
    <>
      <path d="M3 16.5 8 11l3.5 3 3-3.2" />
      <circle cx="14.5" cy="10.8" r="1.15" fill="currentColor" stroke="none" />
      <path d="M16.3 9 20.5 4.5" strokeDasharray="2.4 2.2" />
      <path d="M20.5 7.3V4.5h-2.8" />
    </>
  ),
  ai: (
    <>
      <path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5a3.5 3.5 0 0 1-3.5 3.5H12l-4.5 4v-4.2A3.5 3.5 0 0 1 5 11.5Z" />
      <path d="M9 8h6M9 11h4" />
    </>
  ),
  // An open document — written research.
  research: (
    <>
      <path d="M5 3.5h9L19 8.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5V9H19" />
      <path d="M8 13.5h7M8 17h5" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
};

export function NavIcon({
  name,
  className = "",
}: {
  name: NavIconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-[18px] shrink-0 ${className}`}
    >
      {PATHS[name]}
    </svg>
  );
}
