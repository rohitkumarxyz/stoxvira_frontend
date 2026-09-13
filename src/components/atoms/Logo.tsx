import Image from "next/image";

/** The wordmark lockup. White on the dark chrome, full colour on canvas. */
export function Logo({
  variant = "white",
  width = 108,
  className = "",
}: {
  variant?: "white" | "colour";
  width?: number;
  className?: string;
}) {
  const src =
    variant === "white"
      ? "/brand/stoxvira-wordmark-white.png"
      : "/brand/stoxvira-wordmark.png";

  return (
    <Image
      src={src}
      alt="StoxVira"
      width={width}
      height={Math.round(width * 0.235)}
      priority
      className={`block h-auto w-auto ${className}`}
      style={{ width, height: "auto" }}
    />
  );
}
