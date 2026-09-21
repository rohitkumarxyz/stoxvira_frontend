import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Conversation } from "@/models/Conversation";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }

  const body = (await request.json()) as {
    messages?: { id: number; role: "user" | "assistant"; text: string }[];
  };
  if (!body.messages?.length) {
    return NextResponse.json({ message: "Messages are required." }, { status: 400 });
  }

  const { id } = await params;
  try {
    await connectToDatabase();
    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId: session.userId },
      { $set: { messages: body.messages } },
      { new: true },
    ).lean();

    if (!conversation) {
      return NextResponse.json({ message: "Conversation not found." }, { status: 404 });
    }

    return NextResponse.json({ updatedAt: conversation.updatedAt });
  } catch (error) {
    console.error("Could not update AI conversation.", error);
    return NextResponse.json(
      { message: "Conversation could not be updated. Check the database connection." },
      { status: 503 },
    );
  }
}
