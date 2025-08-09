import currency from "currency.js";
import { setDate, subMonths } from "date-fns";

import { humanizeAmount } from "~/lib/utils";
import {
  getContaCategory,
  getContaCategoryTotalsByMonth,
  getContasCategoriesTotals,
} from "~/services/a7-api/contas";

import { Adapter } from "./adapter";

export class ExpensesAdapter extends Adapter {
  async getCategoriesTotals() {
    const categoriesTotals = await getContasCategoriesTotals(
      this.dateRange.from,
      this.dateRange.to,
    );

    // Agrupar por categoria pai
    const groupedByParent = categoriesTotals.totals.reduce(
      (acc, categoria) => {
        const pai = categoria.nomePai || "Sem categoria";
        if (!acc[pai]) {
          acc[pai] = [];
        }
        acc[pai].push(categoria);
        return acc;
      },
      {} as Record<string, typeof categoriesTotals.totals>,
    );

    const totalsGroupedParent = Object.entries(groupedByParent).map(
      ([pai, totals]) => {
        const total = totals.reduce((acc, cat) => acc + cat.total, 0);
        return {
          nome: pai,
          total,
        };
      },
    );

    return {
      categoriesTotals,
      totalsGroupedParent,
    };
  }

  async getCategoryDetails(id: string) {
    const category = await getContaCategory(
      id,
      this.dateRange.from,
      this.dateRange.to,
    );

    // Buscar histórico dos últimos 6 meses
    const previousDateFrom = setDate(subMonths(this.dateRange.from, 6), 1);
    const previousMonths = await getContaCategoryTotalsByMonth(
      id,
      previousDateFrom,
      this.dateRange.to,
    );

    const previousMonthsSum = previousMonths.reduce(
      (acc, month) => currency(acc).add(month.total).value,
      0,
    );
    const previousMonthsAvg = currency(previousMonthsSum).divide(
      previousMonths.length,
    ).value;

    return {
      category,
      previousMonths,
      previousMonthsAvg,
    };
  }
}
