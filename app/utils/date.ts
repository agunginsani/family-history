import { formatInTimeZone } from "date-fns-tz";

const DEFAULT_DATE_PATTERN = "d MMM yyyy";
const DEFAULT_TIME_ZONE = "Asia/Jakarta";

export function formatDate(
  date: Parameters<typeof formatInTimeZone>[0],
  formatStr?: Parameters<typeof formatInTimeZone>[2]
) {
  return formatInTimeZone(
    date,
    DEFAULT_TIME_ZONE,
    formatStr ?? DEFAULT_DATE_PATTERN
  );
}

export function formatDateTime(date: Parameters<typeof formatInTimeZone>[0]) {
  return formatInTimeZone(
    date,
    DEFAULT_TIME_ZONE,
    `${DEFAULT_DATE_PATTERN} HH:mm`
  );
}
