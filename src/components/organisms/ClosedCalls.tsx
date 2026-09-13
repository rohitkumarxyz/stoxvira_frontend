import { Container } from "@/components/atoms/Container";
import { ClosedCallRow } from "@/components/molecules/ClosedCallRow";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { recentClosed } from "@/lib/mock-data";

const CALLS_LINE =
  "0,198 52,190 103,194 155,170 207,176 258,148 310,156 362,124 413,114 465,90 517,70 568,48 620,26";
const NIFTY_LINE =
  "0,198 52,196 103,200 155,188 207,192 258,182 310,186 362,174 413,170 465,162 517,154 568,148 620,142";

function LegendKey({ label, dashed }: { label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-0.5 w-3.5 ${dashed ? "bg-white/40" : "bg-up-on-dark"}`}
      />
      <span className="font-mono text-caption text-white/70">{label}</span>
    </div>
  );
}

export function ClosedCalls() {
  return (
    <section className="mt-16 bg-brand py-14">
      <Container>
        <SectionHeading
          tone="dark"
          title="Closed calls, all of them"
          meta="412 SINCE 04/2025 · NOTHING REMOVED AFTER THE FACT"
          action={
            <a
              href="#"
              className="text-label font-medium text-up-on-dark hover:text-up-on-dark"
            >
              full ledger
            </a>
          }
        />

        <div className="grid items-start gap-14 pt-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <svg
              viewBox="0 0 620 220"
              preserveAspectRatio="none"
              aria-label="Published calls against the NIFTY 50 since April 2025"
              className="block h-[220px] w-full"
            >
              <polyline
                points={CALLS_LINE}
                fill="none"
                stroke="var(--color-up-on-dark)"
                strokeWidth="2"
              />
              <polyline
                points={NIFTY_LINE}
                fill="none"
                stroke="rgb(255 255 255 / 0.4)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </svg>

            <div className="flex flex-wrap gap-6">
              <LegendKey label="CALLS +61.4%" />
              <LegendKey label="NIFTY 50 +18.9%" dashed />
            </div>
          </div>

          <div>
            {recentClosed.map((call) => (
              <ClosedCallRow key={call.name} call={call} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
