import { NextResponse } from "next/server";

import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { parseLogin } from "@/lib/validation";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

// Same wording whether the email is unknown or the password is wrong, so the
// endpoint cannot be used to find out which addresses have accounts.
const INVALID = "Invalid email or password.";

export async function POST(request: Request) {
  const parsed = parseLogin(await request.json().catch(() => null));

  if (!parsed.ok) {
    return NextResponse.json({ message: parsed.message }, { status: 400 });
  }

  const { email, password } = parsed.value;

  try {
    await connectToDatabase();

    // passwordHash is select:false on the schema, so ask for it explicitly.
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ message: INVALID }, { status: 401 });
    }

    await setSessionCookie(
      await createSessionToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
      }),
    );

    return NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      { message: "Could not log you in. Please try again." },
      { status: 500 },
    );
  }
}
