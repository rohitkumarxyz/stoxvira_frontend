import Link from "next/link";

import { NavIcon, type NavIconName } from "@/components/atoms/NavIcon";

/** One row in the sidebar. Dumb — the parent decides what is active. */
export function SidebarLink({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: NavIconName;
  active: boolean;
  /** Lets the mobile drawer close itself when a link is followed. */
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-label font-medium transition-colors duration-[120ms] ease-standard hover:no-underline ${
        active
          ? "bg-brand-tint text-brand"
          : "text-muted hover:bg-row-tint hover:text-ink"
      }`}
    >
      <NavIcon name={icon} />
      <span className="truncate">{label}</span>
    </Link>
  );
}
