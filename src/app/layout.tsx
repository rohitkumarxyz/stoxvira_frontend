import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "StoxVira — every listed Indian company, scored twice a day",
  description:
    "A pattern model and a language layer score 1,840 Indian stocks twice a day. Every call is published with an entry, a target and a date, and stays on the record.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
