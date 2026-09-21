/** Initials in a circle. No image uploads yet, so this is the profile icon. */
export function Avatar({
  name,
  size = "md",
  className = "",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  /** Extra classes — used to flip the palette on the dark header. */
  className?: string;
}) {
  const sizes = {
    sm: "size-7 text-caption",
    md: "size-8 text-label",
    lg: "size-14 text-lg",
  } as const;

  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}

/** "Rohit Kumar" -> "RK", "Rohit" -> "R". Falls back rather than render blank. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}
