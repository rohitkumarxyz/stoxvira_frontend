import { Container } from "@/components/atoms/Container";
import { Overline } from "@/components/atoms/Overline";
import { MoverRow } from "@/components/molecules/MoverRow";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { moverGroups } from "@/lib/mock-data";

export function TapeToday() {
  return (
    <Container as="section" className="pt-16">
      <SectionHeading
        title="The tape today"
        meta="MOVERS, AND THE STANDING VERDICT ON EACH"
      />

      <div className="grid gap-x-12 gap-y-8 pt-6 lg:grid-cols-3">
        {moverGroups.map((group) => (
          <div key={group.title}>
            <Overline tone="muted" className="block pb-2">
              {group.title.toUpperCase()}
            </Overline>
            {group.rows.map((mover) => (
              <MoverRow key={mover.ticker} mover={mover} />
            ))}
          </div>
        ))}
      </div>
    </Container>
  );
}
