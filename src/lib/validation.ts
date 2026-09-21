// Input checks for the auth routes. The login page validates as well, but
// that is only for feedback: anyone can post straight to the API.

export const MIN_PASSWORD_LENGTH = 8;

// Deliberately loose. Strict email regexes reject valid addresses more often
// than they catch bad ones, and there is no confirmation mail yet.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type Parsed<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseSignup(body: unknown): Parsed<SignupInput> {
  const data = (body ?? {}) as Record<string, unknown>;

  const name = asString(data.name);
  const email = asString(data.email).toLowerCase();
  const password = typeof data.password === "string" ? data.password : "";
  const confirmPassword =
    typeof data.confirmPassword === "string" ? data.confirmPassword : "";

  if (name.length < 2) {
    return { ok: false, message: "Please enter your full name." };
  }
  if (name.length > 120) {
    return { ok: false, message: "That name is too long." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  // bcrypt silently ignores anything past 72 bytes, which would make a long
  // password weaker than it looks. Reject rather than quietly truncate.
  if (new TextEncoder().encode(password).length > 72) {
    return { ok: false, message: "Password must be 72 characters or fewer." };
  }
  if (confirmPassword && password !== confirmPassword) {
    return { ok: false, message: "Passwords do not match." };
  }

  return { ok: true, value: { name, email, password } };
}

export function parseLogin(body: unknown): Parsed<LoginInput> {
  const data = (body ?? {}) as Record<string, unknown>;

  const email = asString(data.email).toLowerCase();
  const password = typeof data.password === "string" ? data.password : "";

  if (!email || !password) {
    return { ok: false, message: "Enter your email and password." };
  }

  return { ok: true, value: { email, password } };
}
