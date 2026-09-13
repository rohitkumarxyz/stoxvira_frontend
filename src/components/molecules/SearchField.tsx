/**
 * Hero search. A hairline box with a flush button — the design draws no
 * radius here, so there is none.
 */
export function SearchField({
  placeholder = "Search a company or ticker",
  action = "Get verdict",
}: {
  placeholder?: string;
  action?: string;
}) {
  return (
    <form className="flex max-w-[520px] items-stretch shadow-[inset_0_0_0_1px_rgb(255_255_255/0.26)]">
      <label className="flex min-w-0 flex-1 items-center px-4">
        <span className="sr-only">{placeholder}</span>
        <input
          type="search"
          placeholder={placeholder}
          className="w-full bg-transparent py-4 text-body text-white outline-none placeholder:text-white/52"
        />
      </label>
      <button
        type="submit"
        className="shrink-0 cursor-pointer bg-canvas px-6.5 py-4 text-body font-medium text-brand transition-colors duration-[120ms] ease-standard hover:bg-white"
      >
        {action}
      </button>
    </form>
  );
}
