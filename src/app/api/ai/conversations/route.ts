import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Conversation } from "@/models/Conversation";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const conversations = await Conversation.find({ userId: session.userId })
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      conversations: conversations.map((conversation) => ({
        id: String(conversation._id),
        intent: conversation.intent,
        stock: conversation.stock,
        holdingPeriod: conversation.holdingPeriod,
        messages: conversation.messages,
        updatedAt: conversation.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Could not load AI conversations.", error);
    return NextResponse.json(
      { message: "Conversation history is unavailable." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }

  const body = (await request.json()) as {
    intent?: "Buy" | "Sell";
    stock?: { trading_symbol?: string; name?: string };
    holdingPeriod?: string;
    messages?: { id: number; role: "user" | "assistant"; text: string }[];
  };

  if (
    !body.intent ||
    !body.stock?.trading_symbol ||
    !body.stock.name ||
    !body.holdingPeriod ||
    !body.messages?.length
  ) {
    return NextResponse.json({ message: "Conversation details are required." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const conversation = await Conversation.create({
      userId: session.userId,
      intent: body.intent,
      stock: {
        trading_symbol: body.stock.trading_symbol,
        name: body.stock.name,
      },
      holdingPeriod: body.holdingPeriod,
      messages: body.messages,
    });

    return NextResponse.json({ id: String(conversation._id) }, { status: 201 });
  } catch (error) {
    console.error("Could not save AI conversation.", error);
    return NextResponse.json(
      { message: "Conversation could not be saved. Check the database connection." },
      { status: 503 },
    );
  }
}
