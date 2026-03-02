import { addDays, startOfDay } from "date-fns";

export function getPayPeriodForDate(d: Date) {
  const date = startOfDay(d);
  const day = date.getDay(); // Sun 0 .. Sat 6
  const THURSDAY = 4;
  const diff = (day - THURSDAY + 7) % 7;
  const start = addDays(date, -diff);
  const end = addDays(start, 13);
  return { start, end };
}