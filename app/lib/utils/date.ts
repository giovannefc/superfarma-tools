import {
  endOfMonth,
  format,
  lastDayOfMonth,
  parseISO,
  setDate,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { redirect } from "react-router";

import type { DateRange } from "../adapters/adapter";

/**
 * Formata uma data no padrão brasileiro (dd/MM/yyyy)
 */
export function humanizeDate(date: Date): string {
  return format(date, "dd/MM/yyyy", { locale: ptBR });
}

/**
 * Extrai apenas a parte da data (YYYY-MM-DD) de um objeto Date,
 * ignorando o horário e fuso horário.
 */
export function formatDateOnly(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Processa parâmetros de data da URL e retorna um DateRange ou Response de redirect
 * Funciona tanto para sistema de relatórios quanto empréstimos
 */
export function forceAndGetDateRange(request: Request): DateRange | Response {
  const url = new URL(request.url);

  // Primeiro, tenta os parâmetros do sistema de relatórios
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");

  if (fromParam && toParam) {
    return {
      from: new Date(fromParam),
      to: new Date(toParam),
    };
  }

  // Depois, tenta os parâmetros do sistema de empréstimos
  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");

  if (dateFrom && dateTo) {
    return {
      from: parseISO(dateFrom),
      to: parseISO(dateTo),
    };
  }

  // Default: mês passado para empréstimos, mês atual para relatórios
  const isEmprestimosRoute = url.pathname.includes("/emprestimos");

  if (isEmprestimosRoute) {
    const lastMonthInit = setDate(subMonths(new Date(), 1), 1);
    const lastMonthEnd = lastDayOfMonth(lastMonthInit);

    return redirect(
      `${url.pathname}?${getDateRangeSearchParams({
        from: lastMonthInit,
        to: lastMonthEnd,
      })}`,
    );
  } else {
    // Default para relatórios: mês atual
    const now = new Date();
    return {
      from: startOfMonth(now),
      to: endOfMonth(now),
    };
  }
}

/**
 * Gera query parameters para um range de datas
 */
export function getDateRangeSearchParams(range: {
  from: Date;
  to: Date;
}): string {
  const params = new URLSearchParams();
  params.set("dateFrom", formatDateOnly(range.from));
  params.set("dateTo", formatDateOnly(range.to));
  return params.toString();
}
