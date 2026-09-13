import { Container } from "@/components/atoms/Container";
import { StepItem } from "@/components/molecules/StepItem";
import { VerdictCard } from "@/components/organisms/VerdictCard";
import { howItWorks } from "@/lib/mock-data";

export function HowItWorks() {
  return (
    <Container as="section" className="py-16">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h2 className="pb-2 text-display font-bold tracking-[-0.8px]">
            How a call gets published
          </h2>
          {howItWorks.map((step, i) => (
            <StepItem
              key={step.title}
              index={i}
              title={step.title}
              body={step.body}
            />
          ))}
        </div>

        <VerdictCard />
      </div>
    </Container>
  );
}
