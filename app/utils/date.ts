import { formatInTimeZone } from "date-fns-tz";

export function formatDate(date: Parameters<typeof formatInTimeZone>[0]) {
  return formatInTimeZone(date, "Asia/Jakarta", "yyyy-MM-dd");
}
