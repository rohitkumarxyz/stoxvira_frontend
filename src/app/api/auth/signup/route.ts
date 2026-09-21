import { NextResponse } from "next/server";

import {
  createSessionToken,
  hashPassword,
  setSessionCookie,
} from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { parseSignup } from "@/lib/validation";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = parseSignup(await request.json().catch(() => null));

  if (!parsed.ok) {
    return NextResponse.json({ message: parsed.message }, { status: 400 });
  }

  const { name, email, password } = parsed.value;

  try {
    await connectToDatabase();

    if (await User.exists({ email })) {
      return NextResponse.json(
        { message: "An account with that email already exists." },
        { status: 409 },
      );
    }

    const user = await User.create({
      name,
      email,
      passwordHash: await hashPassword(password),
    });

    await setSessionCookie(
      await createSessionToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
      }),
    );

    return NextResponse.json(
      { user: { id: user._id.toString(), name: user.name, email: user.email } },
      { status: 201 },
    );
  } catch (error) {
    // Two people can register the same email at the same instant and both
    // pass the exists() check; the unique index is what actually stops it.
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { message: "An account with that email already exists." },
        { status: 409 },
      );
    }

    console.error("Signup failed:", error);
    return NextResponse.json(
      { message: "Could not create your account. Please try again." },
      { status: 500 },
    );
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}
