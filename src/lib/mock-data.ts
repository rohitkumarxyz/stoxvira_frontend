/**
 * Placeholder content for the marketing screens, lifted verbatim from the
 * design export. Every screen takes this as props, so replacing it with a
 * Mongo query later is a change in one place per page, not in the components.
 */

export type Verdict = "Bullish" | "Bearish" | "Neutral";
export type Tone = "Positive" | "Neutral" | "Negative";

export type TickerQuote = {
  name: string;
  value: string;
  change: string;
  up: boolean;
};

export type IndexQuote = TickerQuote & {
  /** Polyline points on a 0 0 60 32 viewBox. */
  points: string;
};

export type Pick = {
  name: string;
  ticker: string;
  cap: string;
  verdict: Verdict;
  score: number;
  price: string;
  target: string;
  horizon: string;
  up: boolean;
};

export type ClosedCall = {
  name: string;
  call: Exclude<Verdict, "Neutral">;
  entry: string;
  exit: string;
  ret: string;
  closed: string;
  up: boolean;
};

export type Mover = {
  name: string;
  ticker: string;
  price: string;
  change: string;
  verdict: Verdict;
  up: boolean;
};

export type MoverGroup = {
  title: string;
  rows: Mover[];
};

export type Post = {
  cat: string;
  date: string;
  title: string;
  dek: string;
  read: string;
};

export type ScoreFactor = {
  delta: string;
  up: boolean;
  body: string;
};

export const ticker: TickerQuote[] = [
  { name: "NIFTY 50", value: "24,812.40", change: "+0.42%", up: true },
  { name: "SENSEX", value: "81,246.18", change: "+0.38%", up: true },
  { name: "BANK NIFTY", value: "52,104.65", change: "+0.61%", up: true },
  { name: "NIFTY IT", value: "41,388.20", change: "+1.24%", up: true },
  { name: "NIFTY MIDCAP 100", value: "58,940.75", change: "-0.18%", up: false },
  { name: "USD / INR", value: "83.42", change: "-0.06%", up: false },
  { name: "INDIA VIX", value: "12.84", change: "-2.10%", up: false },
];

export const indices: IndexQuote[] = [
  {
    name: "NIFTY 50",
    value: "24,812.40",
    change: "+0.42%",
    up: true,
    points: "0,28 20,26 40,29 60,22 80,24 100,18 120,20 140,12 160,9",
  },
  {
    name: "BANK NIFTY",
    value: "52,104.65",
    change: "+0.61%",
    up: true,
    points: "0,30 20,27 40,28 60,20 80,22 100,16 120,17 140,11 160,7",
  },
  {
    name: "NIFTY IT",
    value: "41,388.20",
    change: "+1.24%",
    up: true,
    points: "0,32 20,30 40,24 60,26 80,18 100,20 120,13 140,10 160,5",
  },
  {
    name: "NIFTY MIDCAP 100",
    value: "58,940.75",
    change: "-0.18%",
    up: false,
    points: "0,12 20,14 40,11 60,17 80,15 100,21 120,19 140,24 160,27",
  },
];

export const picks: Pick[] = [
  {
    name: "Tata Motors",
    ticker: "TATAMOTORS",
    cap: "Large cap",
    verdict: "Bullish",
    score: 81,
    price: "₹ 1,048",
    target: "₹ 1,145",
    horizon: "3m",
    up: true,
  },
  {
    name: "Infosys",
    ticker: "INFY",
    cap: "Large cap",
    verdict: "Bullish",
    score: 78,
    price: "₹ 1,612",
    target: "₹ 1,760",
    horizon: "3m",
    up: true,
  },
  {
    name: "State Bank of India",
    ticker: "SBIN",
    cap: "Large cap",
    verdict: "Bullish",
    score: 76,
    price: "₹ 862",
    target: "₹ 942",
    horizon: "6m",
    up: true,
  },
  {
    name: "Bharat Electronics",
    ticker: "BEL",
    cap: "Large cap",
    verdict: "Bullish",
    score: 73,
    price: "₹ 352",
    target: "₹ 398",
    horizon: "6m",
    up: true,
  },
  {
    name: "Cummins India",
    ticker: "CUMMINSIND",
    cap: "Mid cap",
    verdict: "Bullish",
    score: 72,
    price: "₹ 3,418",
    target: "₹ 3,820",
    horizon: "6m",
    up: true,
  },
  {
    name: "Federal Bank",
    ticker: "FEDERALBNK",
    cap: "Mid cap",
    verdict: "Bullish",
    score: 70,
    price: "₹ 214",
    target: "₹ 246",
    horizon: "3m",
    up: true,
  },
  {
    name: "Avenue Supermarts",
    ticker: "DMART",
    cap: "Large cap",
    verdict: "Bearish",
    score: 64,
    price: "₹ 3,812",
    target: "₹ 3,480",
    horizon: "3m",
    up: false,
  },
  {
    name: "Kirloskar Oil Engines",
    ticker: "KIRLOSENG",
    cap: "Small cap",
    verdict: "Bullish",
    score: 67,
    price: "₹ 1,104",
    target: "₹ 1,280",
    horizon: "6m",
    up: true,
  },
];

export const recentClosed: ClosedCall[] = [
  {
    name: "Bharat Electronics",
    call: "Bullish",
    entry: "₹ 288",
    exit: "₹ 341",
    ret: "+18.4%",
    closed: "02/09/26",
    up: true,
  },
  {
    name: "Cipla",
    call: "Bullish",
    entry: "₹ 1,502",
    exit: "₹ 1,588",
    ret: "+5.7%",
    closed: "28/08/26",
    up: true,
  },
  {
    name: "Zomato",
    call: "Bearish",
    entry: "₹ 284",
    exit: "₹ 301",
    ret: "-6.0%",
    closed: "21/08/26",
    up: false,
  },
  {
    name: "Dixon Technologies",
    call: "Bullish",
    entry: "₹ 14,100",
    exit: "₹ 16,480",
    ret: "+16.9%",
    closed: "14/08/26",
    up: true,
  },
  {
    name: "ITC",
    call: "Bullish",
    entry: "₹ 412",
    exit: "₹ 437",
    ret: "+6.1%",
    closed: "08/08/26",
    up: true,
  },
];

export const moverGroups: MoverGroup[] = [
  {
    title: "Top gainers",
    rows: [
      {
        name: "Persistent Systems",
        ticker: "PERSISTENT",
        price: "₹ 5,412",
        change: "+4.8%",
        verdict: "Bullish",
        up: true,
      },
      {
        name: "Tata Motors",
        ticker: "TATAMOTORS",
        price: "₹ 1,048",
        change: "+2.4%",
        verdict: "Bullish",
        up: true,
      },
      {
        name: "Infosys",
        ticker: "INFY",
        price: "₹ 1,612",
        change: "+1.8%",
        verdict: "Bullish",
        up: true,
      },
      {
        name: "Federal Bank",
        ticker: "FEDERALBNK",
        price: "₹ 214",
        change: "+1.6%",
        verdict: "Bullish",
        up: true,
      },
    ],
  },
  {
    title: "Top losers",
    rows: [
      {
        name: "Avenue Supermarts",
        ticker: "DMART",
        price: "₹ 3,812",
        change: "-3.1%",
        verdict: "Bearish",
        up: false,
      },
      {
        name: "Asian Paints",
        ticker: "ASIANPAINT",
        price: "₹ 2,196",
        change: "-2.2%",
        verdict: "Bearish",
        up: false,
      },
      {
        name: "Vedanta",
        ticker: "VEDL",
        price: "₹ 441",
        change: "-1.7%",
        verdict: "Neutral",
        up: false,
      },
      {
        name: "HDFC Bank",
        ticker: "HDFCBANK",
        price: "₹ 1,742",
        change: "-0.2%",
        verdict: "Bullish",
        up: false,
      },
    ],
  },
  {
    title: "Most active",
    rows: [
      {
        name: "State Bank of India",
        ticker: "SBIN",
        price: "₹ 862",
        change: "+1.1%",
        verdict: "Bullish",
        up: true,
      },
      {
        name: "Zomato",
        ticker: "ZOMATO",
        price: "₹ 301",
        change: "+0.9%",
        verdict: "Neutral",
        up: true,
      },
      {
        name: "ITC",
        ticker: "ITC",
        price: "₹ 437",
        change: "+0.4%",
        verdict: "Neutral",
        up: true,
      },
      {
        name: "Bharat Electronics",
        ticker: "BEL",
        price: "₹ 352",
        change: "-0.5%",
        verdict: "Bullish",
        up: false,
      },
    ],
  },
];

export const posts: Post[] = [
  {
    cat: "Model notes",
    date: "05/09/2026",
    title: "Why we score a filing differently from a headline",
    dek: "Materiality beats volume. A single exchange filing can outweigh a week of coverage, and here is how that weighting is set.",
    read: "5 min read",
  },
  {
    cat: "Sector reads",
    date: "01/09/2026",
    title: "Quick commerce is repricing the grocery basket",
    dek: "Three listed names now carry the same risk factor, and the model treats it as one exposure rather than three.",
    read: "7 min read",
  },
  {
    cat: "Model notes",
    date: "26/08/2026",
    title: "What a 78% confidence score actually means",
    dek: "It is a calibration statement, not a probability of profit. The difference matters when you size a position.",
    read: "4 min read",
  },
  {
    cat: "Post-mortems",
    date: "19/08/2026",
    title: "Four midcap calls that worked for the wrong reason",
    dek: "The direction was right and the reasoning was not. Why we still count them as misses internally.",
    read: "6 min read",
  },
];

export const howItWorks = [
  {
    title: "Pattern engine",
    body: "Eight years of price, volume and quarterly financials, one model per stock. It looks for setups that have repeated in that specific name rather than a generic indicator preset.",
  },
  {
    title: "Language layer",
    body: "Exchange filings, earnings calls, broker notes and national press, each scored for tone and materiality as it lands. A single filing can outweigh a week of coverage.",
  },
  {
    title: "Agreement test",
    body: "A news score cannot carry a call on its own. If the pattern engine is flat, nothing is published, which is why fourteen calls stay open and not four hundred.",
  },
  {
    title: "Analyst review · not live",
    body: "Registered analyst sign-off is on the roadmap. Until it is done, every call on the site is model output and says so.",
  },
];

/** The worked example beside "How a call gets published". */
export const sampleVerdict = {
  name: "Infosys",
  meta: "INFY · NSE · LARGE CAP",
  price: "₹ 1,612.40",
  change: "+1.83%",
  verdict: "Bullish" as Verdict,
  detail: "Target ₹ 1,760 · 3 months · stop ₹ 1,498",
  score: 78,
  breakdown: [
    { label: "NEWS LAYER", value: 82 },
    { label: "PATTERN ENGINE", value: 71 },
    { label: "FUNDAMENTALS", value: 64 },
  ],
  factors: [
    {
      delta: "+18",
      up: true,
      body: "$1.5bn multi-year deal with a European retailer, disclosed 11/09.",
    },
    {
      delta: "+11",
      up: true,
      body: "Two brokerages raised targets to ₹1,780 and ₹1,810.",
    },
    {
      delta: "−6",
      up: false,
      body: "Attrition at 13.4% with wage revision due next quarter.",
    },
  ] satisfies ScoreFactor[],
};

export const heroStats = [
  { value: "1,840", label: "STOCKS SCORED" },
  { value: "14", label: "CALLS OPEN" },
  { value: "412", label: "CLOSED ON RECORD" },
  { value: "68%", label: "HIT RATE", accent: true },
];

export const footerColumns = [
  {
    title: "Product",
    links: ["Stock verdict", "Today's picks", "Track record", "Pricing"],
  },
  {
    title: "Resources",
    links: [
      "Research",
      "Post-mortems",
      "How the model works",
      "Market holidays",
    ],
  },
  {
    title: "Company",
    links: ["About us", "Careers", "Contact", "Help and support"],
  },
  {
    title: "Policy",
    links: [
      "Privacy",
      "Terms of use",
      "Subscription and payments",
      "Grievance redressal",
    ],
  },
];

export const navLinks = [
  "Home",
  "Stock verdict",
  "Picks",
  "Track record",
  "Pricing",
  "Research",
  "About",
];
