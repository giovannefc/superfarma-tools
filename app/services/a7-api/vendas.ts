import { formatDateOnly } from "~/lib/utils";

import { fetchA7API } from "./client";
import type { VendaTotal, VendaTotals } from "./types";

interface DateRange {
  from: Date;
  to: Date;
}

export async function getVendasTotal(
  dateRange: DateRange,
): Promise<VendaTotal> {
  const dateFrom = formatDateOnly(dateRange.from);
  const dateTo = formatDateOnly(dateRange.to);

  return fetchA7API(`/vendas/total?dateFrom=${dateFrom}&dateTo=${dateTo}`);
}

export async function getVendasTotals(
  dateRange: DateRange,
): Promise<VendaTotals[]> {
  const dateFrom = formatDateOnly(dateRange.from);
  const dateTo = formatDateOnly(dateRange.to);

  return fetchA7API(`/vendas/totals?dateFrom=${dateFrom}&dateTo=${dateTo}`);
}
