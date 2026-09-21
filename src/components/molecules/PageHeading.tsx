import { Overline } from "@/components/atoms/Overline";

/**
 * The heading at the top of every dashboard section.
 *
 * SectionHeading is the marketing pages' version and sits on a brass rule
 * between stacked bands; inside the app shell a section is the whole page,
 * so this one leads with the eyebrow instead.
 */
export function PageHeading({
  title,
  meta,
  lede,
}: {
  title: string;
  meta?: string;
  lede?: string;
}) {
  return (
    <div className="rule-b flex flex-col gap-1 pb-4">
      {meta ? <Overline tone="muted">{meta}</Overline> : null}
      <h1 className="text-display font-bold tracking-[-0.8px] text-ink">
        {title}
      </h1>
      {lede ? <p className="pt-1 text-body text-muted">{lede}</p> : null}
    </div>
  );
}
