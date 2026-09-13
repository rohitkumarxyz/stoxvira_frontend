import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";

// A cached health check is useless, so always run this on request.
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    await connectToDatabase();

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("Database handle is not available");
    }

    await db.admin().command({ ping: 1 });

    return NextResponse.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db: {
        status: "connected",
        latencyMs: Date.now() - startedAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        db: {
          status: "error",
          latencyMs: Date.now() - startedAt,
          message:
            error instanceof Error ? error.message : "Unknown database error",
        },
      },
      { status: 503 },
    );
  }
}
