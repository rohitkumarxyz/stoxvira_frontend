"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "@/components/atoms/Avatar";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/profile", label: "Profile" },
] as const;

export function UserMenu({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => setOpen((was) => !was)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-2.5 rounded-sm py-1 pr-2.5 pl-1 transition-colors duration-[120ms] ease-standard hover:bg-white/12"
      >
        <Avatar name={name} className="bg-canvas text-brand" />
        <span className="hidden text-label font-medium text-white sm:inline">
          {name}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-sm bg-card shadow-[inset_0_0_0_1px_var(--color-line-strong)]"
        >
          <div className="rule-b-subtle flex flex-col gap-0.5 px-3.5 py-3">
            <span className="truncate text-label font-medium text-ink">
              {name}
            </span>
            <span className="truncate font-mono text-caption text-muted">
              {email}
            </span>
          </div>

          <div className="py-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-3.5 py-2.5 text-label font-medium text-ink transition-colors duration-[120ms] ease-standard hover:bg-row-tint hover:no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="rule-t py-1">
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              disabled={busy}
              className="block w-full cursor-pointer px-3.5 py-2.5 text-left text-label font-medium text-muted transition-colors duration-[120ms] ease-standard hover:bg-row-tint hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Logging out…" : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
