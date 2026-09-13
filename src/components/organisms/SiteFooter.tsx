import { Container } from "@/components/atoms/Container";
import { Logo } from "@/components/atoms/Logo";
import { Overline } from "@/components/atoms/Overline";
import { StoreBadge } from "@/components/atoms/StoreBadge";
import { footerColumns } from "@/lib/mock-data";

const CONTACT = [
  { label: "Registered office", lines: ["To be confirmed", "India"] },
  { label: "Support", lines: ["support@stoxvira.com"] },
  { label: "Compliance", lines: ["compliance@stoxvira.com"] },
  {
    label: "SEBI registration",
    lines: [
      "Research analyst registration in progress.",
      "Number published here once granted.",
    ],
  },
];

const SOCIALS = ["X", "in", "tg"];

export function SiteFooter() {
  return (
    <footer className="bg-brand">
      <Container>
        <div className="rule-b-dark flex flex-wrap items-center justify-between gap-6 py-8">
          <div className="flex flex-col gap-1">
            <Overline tone="accent">GET THE APP</Overline>
            <span className="text-md font-bold text-white">
              Verdicts and alerts on iOS and Android
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <StoreBadge store="ios" filled />
            <StoreBadge store="android" />
          </div>
        </div>

        <div className="rule-b-dark grid gap-10 py-10 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
          <div className="flex flex-col gap-4">
            <Logo width={104} />
            <p className="max-w-[260px] text-label text-white/62">
              Model-driven equity research on 1,840 Indian stocks. Every call
              published with its reasoning, and kept on the record.
            </p>
            <div className="flex gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="flex size-8 items-center justify-center rounded-full bg-white/12 text-caption font-medium text-white/74 hover:bg-white/20 hover:no-underline"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <Overline tone="onDark">{column.title.toUpperCase()}</Overline>
              {column.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-label text-white/74 hover:text-white"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="rule-b-dark grid gap-8 py-8 lg:grid-cols-4">
          {CONTACT.map((block) => (
            <div key={block.label} className="flex flex-col gap-1">
              <span className="text-caption text-white/52">{block.label}</span>
              {block.lines.map((line) => (
                <span key={line} className="text-label text-white/80">
                  {line}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 py-8">
          <p className="max-w-[1000px] text-caption leading-[1.6] text-white/52">
            StoxVira publishes model output for education and information. It is
            not investment advice and not a recommendation to buy or sell any
            security. Equity markets carry risk, including permanent loss of
            capital. Past performance of a model does not indicate future
            returns. Consider your own objectives, risk tolerance and time
            frame, and if you need advice, speak to a SEBI-registered investment
            adviser.
          </p>
          <p className="text-caption text-white/52">
            © 2026 StoxVira. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
