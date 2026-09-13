/**
 * Store badges are drawn in type, not imported artwork — the design has no
 * Apple/Google lockup files and the system forbids inventing imagery.
 */
export function StoreBadge({
  store,
  filled = false,
}: {
  store: "ios" | "android";
  /** The design fills the App Store badge and outlines the Play one. */
  filled?: boolean;
}) {
  const copy =
    store === "ios"
      ? { kicker: "DOWNLOAD ON THE", name: "App Store" }
      : { kicker: "GET IT ON", name: "Google Play" };

  return (
    <a
      href="#"
      className={`inline-flex flex-col justify-center gap-0.5 px-4 py-2 no-underline hover:no-underline ${
        filled
          ? "bg-canvas text-brand hover:bg-white"
          : "text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.3)] hover:bg-white/12"
      }`}
    >
      <span className="font-mono text-[9px] leading-none tracking-[0.08em] opacity-70">
        {copy.kicker}
      </span>
      <span className="text-md font-bold leading-tight">{copy.name}</span>
    </a>
  );
}
