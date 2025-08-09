import { formatDateOnly } from "~/utils";

export function getDateRangeSearchParams(range: { from: Date; to: Date }) {
  const params = new URLSearchParams();
  params.set("dateFrom", formatDateOnly(range.from));
  params.set("dateTo", formatDateOnly(range.to));
  return params.toString();
}
