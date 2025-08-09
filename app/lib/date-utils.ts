import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import { formatDateOnly } from "~/utils";

import type { DateRange } from "./adapters/adapter";

export function forceAndGetDateRange(request: Request): DateRange | Response {
  const url = new URL(request.url);
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");

  let from: Date;
  let to: Date;

  if (fromParam && toParam) {
    from = new Date(fromParam);
    to = new Date(toParam);
  } else {
    // Default to current month
    const now = new Date();
    from = startOfMonth(now);
    to = endOfMonth(now);
  }

  return { from, to };
}

export function getDateRangeSearchParams(dateRange: DateRange): string {
  const fromStr = formatDateOnly(dateRange.from);
  const toStr = formatDateOnly(dateRange.to);
  return `dateFrom=${fromStr}&dateTo=${toStr}`;
}
