import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "onDark" | "outlineOnDark" | "ghost";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
};

/**
 * Hover on a filled button is a white overlay, never a darker fill — the
 * system has no hover shade for the brand green.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-[color-mix(in_srgb,var(--color-brand)_92%,white)]",
  onDark: "bg-canvas text-brand hover:bg-white",
  outlineOnDark:
    "text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.3)] hover:bg-white/12",
  ghost: "text-white/74 hover:bg-white/12 hover:text-white",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm px-4 py-2 text-body font-medium transition-colors duration-[120ms] ease-standard ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
