import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }

  const body = await request.json();
  const response = await fetch(`${BACKEND_URL}/ai/analyze/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: request.signal,
  });

  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => ({
      message: "AI analysis unavailable.",
    }));
    return NextResponse.json(
      { message: payload.detail ?? payload.message ?? "AI analysis unavailable." },
      { status: response.status },
    );
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
