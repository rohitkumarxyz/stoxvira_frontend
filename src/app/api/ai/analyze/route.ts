import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }

  const body = await request.json();
  const response = await fetch(`${BACKEND_URL}/ai/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(60_000),
  });

  const payload = await response.json().catch(() => ({
    message: "AI analysis unavailable.",
  }));
  if (!response.ok) {
    return NextResponse.json(
      { message: payload.detail ?? payload.message ?? "AI analysis unavailable." },
      { status: response.status },
    );
  }
  return NextResponse.json(payload);
}
