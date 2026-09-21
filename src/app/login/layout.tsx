import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getSession } from "@/lib/auth";

// Reads the session cookie, so it cannot be statically rendered.
export const dynamic = "force-dynamic";

/**
 * Someone already signed in has no reason to see the login form — send them
 * to the dashboard. The page itself stays a client component; this server
 * layout does the check before it ever renders.
 */
export default async function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (await getSession()) {
    redirect("/dashboard");
  }

  return children;
}
