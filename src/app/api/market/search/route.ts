import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { searchInstruments } from "@/lib/market";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json(
      { message: "Enter a company name or ticker." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json({ results: await searchInstruments(query) });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Search is unavailable.",
      },
      { status: 503 },
    );
  }
}
