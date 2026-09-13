import { Container } from "@/components/atoms/Container";
import { IndexCard } from "@/components/molecules/IndexCard";
import { indices } from "@/lib/mock-data";

/** White band between the hero and the open calls. */
export function IndexStrip() {
  return (
    <section className="bg-card">
      <Container>
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {indices.map((quote) => (
            <IndexCard key={quote.name} quote={quote} />
          ))}
        </div>
      </Container>
    </section>
  );
}
