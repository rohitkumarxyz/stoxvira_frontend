import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";

export function FinalCta() {
  return (
    <Container as="section" className="py-16">
      <div className="rule-t flex flex-wrap items-center justify-between gap-6 pt-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-display font-bold tracking-[-0.8px]">
            Start with one stock you already own
          </h2>
          <p className="text-body text-muted">
            Free while we are in beta. No card, no broker connection, no
            relationship manager.
          </p>
        </div>
        <Button>Create free account →</Button>
      </div>
    </Container>
  );
}
