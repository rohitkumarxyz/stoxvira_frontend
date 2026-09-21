"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import { Overline } from "@/components/atoms/Overline";
import { StatTile } from "@/components/molecules/StatTile";
import { heroStats } from "@/lib/mock-data";

type Mode = "login" | "signup";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

/**
 * A labelled text input in the system's field style: a flat grey-green
 * fill, no border until focus, when a 1.5px brand line takes over.
 */
function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-label font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="rounded-sm bg-field px-3.5 py-3 text-body text-ink shadow-[inset_0_0_0_1px_transparent] outline-none transition-shadow duration-[120ms] ease-standard placeholder:text-hint focus:shadow-[inset_0_0_0_1.5px_var(--color-brand)]"
      />
    </label>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "signup";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setForm(INITIAL_FORM);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (isSignup && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Something went wrong. Try again.");
      }

      router.push("/dashboard");
      // The header reads the session on the server, so it needs a re-render
      // to swap "Log in" for the user menu.
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Brand panel — hidden below lg, same dark chrome as the header/hero. */}
      <div className="hidden w-[42%] shrink-0 flex-col justify-between bg-brand p-12 lg:flex">
        <Link href="/" className="flex items-center hover:no-underline">
          <Logo width={116} />
        </Link>

        <div className="flex max-w-[420px] flex-col gap-5">
          <Overline tone="accent">MODEL-DRIVEN RESEARCH</Overline>
          <h1 className="text-pretty text-[clamp(26px,2.6vw,36px)] leading-[1.08] font-bold tracking-[-1px] text-white">
            Every listed Indian company, scored twice a day.
          </h1>
          <p className="text-md leading-[1.7] text-white/72">
            A pattern model and a language layer agree before a call is
            published — with an entry, a target and a date, and it stays on
            the record.
          </p>
        </div>

        <div className="grid grid-cols-2">
          {heroStats.map((stat, i) => (
            <StatTile
              key={stat.label}
              value={stat.value}
              label={stat.label}
              accent={stat.accent}
              className={
                i % 2 === 0
                  ? "rule-t-dark py-4.5 pr-4.5"
                  : "shadow-[inset_0_1px_0_rgb(255_255_255/0.18),inset_1px_0_0_rgb(255_255_255/0.18)] py-4.5 pl-4.5"
              }
            />
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-canvas px-6 py-12">
        <div className="w-full max-w-[400px]">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center hover:no-underline lg:hidden"
          >
            <Logo variant="colour" width={116} />
          </Link>

          <div className="mb-7 flex rounded-sm bg-field p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 cursor-pointer rounded-xs py-2.5 text-label font-medium transition-colors duration-[120ms] ease-standard ${
                mode === "login"
                  ? "bg-card text-ink shadow-[inset_0_0_0_1px_var(--color-line)]"
                  : "text-muted hover:text-ink"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 cursor-pointer rounded-xs py-2.5 text-label font-medium transition-colors duration-[120ms] ease-standard ${
                mode === "signup"
                  ? "bg-card text-ink shadow-[inset_0_0_0_1px_var(--color-line)]"
                  : "text-muted hover:text-ink"
              }`}
            >
              Create account
            </button>
          </div>

          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-display font-bold tracking-[-0.6px] text-ink">
              {isSignup ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-body text-muted">
              {isSignup
                ? "Free while we are in beta. No card required."
                : "Log in to see today's verdicts and your open calls."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignup && (
              <Field
                label="Full name"
                value={form.name}
                onChange={(v) => update("name", v)}
                placeholder="Your name"
                autoComplete="name"
              />
            )}

            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => update("email", v)}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => update("password", v)}
              placeholder="••••••••"
              autoComplete={isSignup ? "new-password" : "current-password"}
            />

            {isSignup && (
              <Field
                label="Confirm password"
                type="password"
                value={form.confirmPassword}
                onChange={(v) => update("confirmPassword", v)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            )}

            {error && (
              <p className="rounded-sm bg-tag-red-bg px-3.5 py-2.5 text-label text-tag-red-text">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Please wait…"
                : isSignup
                  ? "Create free account →"
                  : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-label text-muted">
            {isSignup ? "Already have an account? " : "New to StoxVira? "}
            <button
              type="button"
              onClick={() => switchMode(isSignup ? "login" : "signup")}
              className="cursor-pointer font-medium text-brand hover:underline"
            >
              {isSignup ? "Log in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}