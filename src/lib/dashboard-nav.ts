import type { NavIconName } from "@/components/atoms/NavIcon";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconName;
};

// Sidebar order. One list drives the desktop rail, the mobile drawer and the
// active-state logic so they cannot drift apart.
export const DASHBOARD_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/chart", label: "Chart", icon: "chart" },
  { href: "/dashboard/predictions", label: "Predictions", icon: "predict" },
  { href: "/dashboard/ai", label: "Stoxvira AI", icon: "ai" },
  { href: "/dashboard/research", label: "Research", icon: "research" },
];

export const DASHBOARD_FOOTER_NAV: NavItem[] = [
  { href: "/dashboard/profile", label: "Profile", icon: "profile" },
];

// "/dashboard" matches only itself, not every child route, otherwise
// Overview stays highlighted on every other section.
export function isNavItemActive(href: string, pathname: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
