import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import { navLinks } from "@/lib/mock-data";

/** Sticky dark chrome. The brand green at 97% with a blur behind it. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-x-4.5 gap-y-3 bg-brand/97 px-6 py-3.5 shadow-[inset_0_-1px_0_rgb(255_255_255/0.08)] backdrop-blur-[10px]">
      <a href="#" className="flex items-center hover:no-underline">
        <Logo width={104} />
      </a>

      <nav className="flex flex-wrap items-center gap-1">
        {navLinks.map((link, i) => (
          <a
            key={link}
            href="#"
            className={`shrink-0 rounded-sm px-2.5 py-2 text-label font-medium whitespace-nowrap transition-colors duration-[120ms] ease-standard hover:bg-white/12 hover:no-underline ${
              i === 0 ? "text-white" : "text-white/74 hover:text-white"
            }`}
          >
            {link}
          </a>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <a
          href="#"
          className="rounded-sm px-2.5 py-2 text-label font-medium text-white/74 hover:bg-white/12 hover:text-white hover:no-underline"
        >
          Log in
        </a>
        <Button variant="onDark">Get started</Button>
      </div>
    </header>
  );
}
