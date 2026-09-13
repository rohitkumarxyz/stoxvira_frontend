import { Container } from "@/components/atoms/Container";
import { Overline } from "@/components/atoms/Overline";
import { SearchField } from "@/components/molecules/SearchField";
import { StatTile } from "@/components/molecules/StatTile";
import { heroStats } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="bg-brand pt-14">
      <Container>
        <Overline tone="accent">
          RESEARCH DESK · 13/09/2026 · NSE CLOSE 15:30 IST
        </Overline>

        <div className="grid items-end gap-14 pt-7 pb-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-7">
            <h1 className="text-pretty text-[clamp(38px,6vw,62px)] leading-[0.99] font-bold tracking-[-2.4px] text-white">
              Every listed Indian company, scored twice a day.
            </h1>

            <p className="max-w-[560px] text-md leading-[1.7] text-white/72">
              A pattern model reads eight years of price and financial history.
              A language layer reads this morning&apos;s filings, calls and
              press. Where they agree, a call is published with an entry, a
              target and a date, and it stays on the record.
            </p>

            <SearchField />
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
      </Container>
    </section>
  );
}
