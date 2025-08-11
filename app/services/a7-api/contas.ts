import { formatDateOnly } from "~/lib/utils";

import { fetchA7API } from "./client";
import type {
  ContaCategoriesTotals,
  ContaCategory,
  ContaCategoryTotal,
  ContaTotal,
} from "./types";

interface DateRange {
  from: Date;
  to: Date;
}

export async function getContasTotal(
  dateRange: DateRange,
): Promise<ContaTotal> {
  const dateFrom = formatDateOnly(dateRange.from);
  const dateTo = formatDateOnly(dateRange.to);

  return fetchA7API(`/contas/total?dateFrom=${dateFrom}&dateTo=${dateTo}`);
}

export async function getContasCategoriesTotals(
  dateFrom: Date,
  dateTo: Date,
): Promise<ContaCategoriesTotals> {
  const formattedDateFrom = formatDateOnly(dateFrom);
  const formattedDateTo = formatDateOnly(dateTo);

  return fetchA7API(
    `/contas/categories/totals?dateFrom=${formattedDateFrom}&dateTo=${formattedDateTo}`,
  );
}

export async function getContaCategory(
  id: string,
  dateFrom: Date,
  dateTo: Date,
): Promise<ContaCategory> {
  const formattedDateFrom = formatDateOnly(dateFrom);
  const formattedDateTo = formatDateOnly(dateTo);

  return fetchA7API(
    `/contas/categories/${id}?dateFrom=${formattedDateFrom}&dateTo=${formattedDateTo}`,
  );
}

export async function getContaCategoryTotalsByMonth(
  id: string,
  dateFrom: Date,
  dateTo: Date,
): Promise<ContaCategoryTotal[]> {
  const formattedDateFrom = formatDateOnly(dateFrom);
  const formattedDateTo = formatDateOnly(dateTo);

  return fetchA7API(
    `/contas/categories/${id}/by-month?dateFrom=${formattedDateFrom}&dateTo=${formattedDateTo}`,
  );
}

export async function getTaxasCartoes(
  dateRange: DateRange,
): Promise<{ total: number }> {
  const dateFrom = formatDateOnly(dateRange.from);
  const dateTo = formatDateOnly(dateRange.to);

  return fetchA7API(`/cartoes/taxas?dateFrom=${dateFrom}&dateTo=${dateTo}`);
}
