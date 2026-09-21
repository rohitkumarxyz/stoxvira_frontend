"use client";

import { useState, type ReactNode } from "react";

import { DashboardSidebar } from "@/components/organisms/DashboardSidebar";
import { DashboardTopBar } from "@/components/organisms/DashboardTopBar";

/**
 * Top bar + sidebar + content. Client-side only because the mobile drawer
 * needs open/closed state; everything it renders is handed down as props
 * from the server layout.
 */
export function DashboardShell({
  name,
  email,
  marketOpen,
  marketLabel,
  children,
}: {
  name: string;
  email: string;
  marketOpen: boolean;
  marketLabel: string;
  children: ReactNode;
}) {
  // Every link inside the drawer calls onClose, so there is no effect here
  // watching the pathname — the close happens at the click that causes it.
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopBar
        name={name}
        email={email}
        marketOpen={marketOpen}
        marketLabel={marketLabel}
        onMenuClick={() => setDrawerOpen(true)}
      />

      <div className="flex min-h-[calc(100vh-3.5rem)] flex-1 items-stretch">
        <DashboardSidebar
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        {/* No horizontal padding here — every section brings its own
            Container, and doubling them up would inset the content twice.
            min-w-0 stops a wide table forcing the whole shell sideways. */}
        <main className="min-h-[calc(100vh-3.5rem)] min-w-0 flex-1 bg-canvas pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
