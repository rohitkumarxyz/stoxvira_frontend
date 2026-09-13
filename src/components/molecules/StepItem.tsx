import { Overline } from "@/components/atoms/Overline";

/** A numbered step in "How a call gets published". */
export function StepItem({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  return (
    <div className="rule-b-subtle grid grid-cols-[32px_1fr] gap-x-3 gap-y-1 py-5 last:shadow-none">
      <Overline tone="hint" className="pt-1">
        {String(index + 1).padStart(2, "0")}
      </Overline>
      <h3 className="text-md font-medium">{title}</h3>
      <div />
      <p className="text-body text-muted">{body}</p>
    </div>
  );
}
