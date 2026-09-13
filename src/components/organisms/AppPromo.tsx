import Image from "next/image";

import { Container } from "@/components/atoms/Container";
import { Overline } from "@/components/atoms/Overline";
import { StoreBadge } from "@/components/atoms/StoreBadge";

const APP_STATS = [
  { value: "4.6", label: "STORE RATING" },
  { value: "1.2 MB", label: "APP SIZE" },
  { value: "09:15", label: "DAILY ALERT", accent: true },
];

/** The mobile advertisement. Uses the supplied app artwork on the right. */
export function AppPromo() {
  return (
    <section className="bg-brand py-14">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-7">
            <Overline tone="accent">STOXVIRA FOR IOS AND ANDROID</Overline>

            <h2 className="max-w-[520px] text-pretty text-[clamp(30px,4vw,40px)] leading-[1.1] font-bold tracking-[-1.6px] text-white">
              The desk in your pocket, with alerts when a call changes
            </h2>

            <p className="max-w-[520px] text-md leading-[1.7] text-white/72">
              Same verdicts, same reasoning, same track record. Push alerts when
              a target, a stop or a verdict moves, so you are not checking the
              site at 09:15 every morning.
            </p>

            <div className="flex flex-wrap gap-3">
              <StoreBadge store="ios" filled />
              <StoreBadge store="android" />
            </div>

            <div className="flex flex-wrap gap-10 pt-2">
              {APP_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span
                    className={`text-display font-bold ${
                      stat.accent ? "text-up-on-dark" : "text-white"
                    }`}
                  >
                    {stat.value}
                  </span>
                  <Overline tone="onDark">{stat.label}</Overline>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-md shadow-[inset_0_0_0_1px_rgb(255_255_255/0.18)]">
            <Image
              src="/stoxvira.png"
              alt="The StoxVira mobile app showing portfolio value, holdings and a market insight"
              width={1536}
              height={1024}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
