// Clock based only: 09:15 to 15:30 IST, Mon-Fri. Trading holidays are not
// handled, so this reports "open" on Diwali. Upstox sends real segment status
// over the websocket, which is the proper fix once holidays matter.

const IST_OFFSET_MINUTES = 5 * 60 + 30;

const OPEN_MINUTES = 9 * 60 + 15;
const CLOSE_MINUTES = 15 * 60 + 30;

export type MarketHours = {
  open: boolean;
  label: string;
};

export function getMarketHours(now: Date = new Date()): MarketHours {
  // Shift UTC into IST manually instead of trusting the deploy host timezone.
  const ist = new Date(now.getTime() + IST_OFFSET_MINUTES * 60_000);

  const day = ist.getUTCDay();
  const minutes = ist.getUTCHours() * 60 + ist.getUTCMinutes();

  const isWeekday = day >= 1 && day <= 5;
  const open = isWeekday && minutes >= OPEN_MINUTES && minutes < CLOSE_MINUTES;

  return {
    open,
    label: open ? "Market open" : "Market closed",
  };
}

// Date line under the dashboard greeting, e.g. "Saturday, 19 September".
export function formatIstDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Kolkata",
  }).format(now);
}
