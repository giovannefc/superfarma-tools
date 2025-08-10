import { lastDayOfMonth, parseISO, setDate, subMonths } from "date-fns";
import { redirect } from "react-router";

import { EmprestimoTipo } from "~/lib/constants";

import { getDateRangeSearchParams } from "./client";

export function getEmprestimoTipo(request: Request) {
  const location = new URL(request.url).pathname;
  return location === "/panel/emprestimos/deve"
    ? EmprestimoTipo.SAIDA
    : EmprestimoTipo.ENTRADA;
}

export function forceAndGetDateRange(request: Request) {
  const url = new URL(request.url);

  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");

  if (dateFrom && dateTo) {
    return {
      from: parseISO(dateFrom),
      to: parseISO(dateTo),
    };
  }

  const lastMonthInit = setDate(subMonths(new Date(), 1), 1);
  const lastMonthEnd = lastDayOfMonth(lastMonthInit);

  return redirect(
    `${url.pathname}?${getDateRangeSearchParams({
      from: lastMonthInit,
      to: lastMonthEnd,
    })}`,
  );
}
