import currency from "currency.js";
import {
  format,
  getDaysInMonth,
  lastDayOfMonth,
  parse,
  setDate,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { humanizeAmount } from "~/lib/utils";
import { getPosicaoEstoque } from "~/services/a7-api/produtos";
import { getVendasTotal, getVendasTotals } from "~/services/a7-api/vendas";

import { Adapter } from "./adapter";

export type AdaptedVendasTotals = Awaited<
  ReturnType<SalesAdapter["getFirstLine"]>
>["adaptedVendasTotals"];

export class SalesAdapter extends Adapter {
  async getFirstLine() {
    const { from, to } = this.dateRange;
    const totalsDateFrom = setDate(subMonths(from, 6), 1);
    const totalsDateTo = lastDayOfMonth(subMonths(to, 1));

    const vendasTotal = await getVendasTotal(this.dateRange);
    const vendasTotals = await getVendasTotals({
      from: totalsDateFrom,
      to: totalsDateTo,
    });
    const estoque = await getPosicaoEstoque(to);

    // SalesFirtLine Details
    const daysInMonth = getDaysInMonth(to);
    const projecaoTotal = currency(vendasTotal.mediaDiaria).multiply(
      daysInMonth,
    ).value;

    const salesFirstLine = [
      {
        title: "Total",
        metric: humanizeAmount(vendasTotal.total),
        projecao: humanizeAmount(projecaoTotal),
        margem: null,
        deltaType: "moderateIncrease" as const,
      },
      {
        title: "Lucro",
        metric: humanizeAmount(vendasTotal.lucro),
        projecao: null,
        margem: `${vendasTotal.margem}%`,
        deltaType: "moderateIncrease" as const,
      },
      {
        title: "Média diária",
        metric: humanizeAmount(vendasTotal.mediaDiaria),
        projecao: null,
        margem: null,
        deltaType: "moderateIncrease" as const,
      },
    ];

    const totalUltimosSeisMeses = vendasTotals.reduce(
      (total, vendaTotal) => currency(total).add(vendaTotal.total).value,
      0,
    );
    const mediaUltimosSeisMeses = currency(totalUltimosSeisMeses).divide(
      vendasTotals.length,
    ).value;

    const salesSecondLine = [
      {
        title: "Média vendas últimos 6 meses",
        value: humanizeAmount(mediaUltimosSeisMeses),
      },
      {
        title: "Posição de estoque",
        value: humanizeAmount(estoque.total),
      },
      {
        title: "Ticket médio",
        value: humanizeAmount(vendasTotal.ticketMedio),
      },
    ];

    const adaptedVendasTotals = vendasTotals.map(vendaTotal => {
      return {
        Total: vendaTotal.total,
        Lucro: vendaTotal.lucro,
        Margem: vendaTotal.margem,
        "Custo Total": vendaTotal.custo,
        "Média diária": vendaTotal.mediaDiaria,
        Data: format(
          parse(vendaTotal.date, "yyyy-MM", new Date()),
          "MMMM 'de' yyyy",
          { locale: ptBR },
        ),
      };
    });

    return {
      salesFirstLine,
      adaptedVendasTotals,
      salesSecondLine,
    };
  }
}
