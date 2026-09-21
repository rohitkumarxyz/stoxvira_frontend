"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { SidebarLink } from "@/components/molecules/SidebarLink";
import {
  DASHBOARD_FOOTER_NAV,
  DASHBOARD_NAV,
  isNavItemActive,
} from "@/lib/dashboard-nav";

/**
 * The navigation rail. Fixed on desktop; a slide-over drawer under lg, driven
 * by the top bar's menu button.
 */
export function DashboardSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const nav = (
    <nav className="flex h-full flex-col gap-1 p-4">
      {DASHBOARD_NAV.map((item) => (
        <SidebarLink
          key={item.href}
          {...item}
          active={isNavItemActive(item.href, pathname)}
          onNavigate={onClose}
        />
      ))}

      <div className="flex-1" />

      <div className="rule-t pt-3">
        {DASHBOARD_FOOTER_NAV.map((item) => (
          <SidebarLink
            key={item.href}
            {...item}
            active={isNavItemActive(item.href, pathname)}
            onNavigate={onClose}
          />
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop rail. 3.5rem matches the top bar's h-14 exactly. */}
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] self-start overflow-y-auto w-60 shrink-0 bg-card shadow-[inset_-1px_0_0_var(--color-line)] lg:block">
        {nav}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-[120ms] ease-standard ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-64 bg-card transition-transform duration-[120ms] ease-standard ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {nav}
        </aside>
      </div>
    </>
  );
}
