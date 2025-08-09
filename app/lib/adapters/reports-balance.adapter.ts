import currency from "currency.js";

import { humanizeAmount } from "~/lib/utils";
import { getContasTotal, getTaxasCartoes } from "~/services/a7-api/contas";
import { getVendasTotal } from "~/services/a7-api/vendas";

import { Adapter } from "./adapter";

export class BalanceAdapter extends Adapter {
  private async getVendas() {
    const totalVendas = await getVendasTotal(this.dateRange);
    return totalVendas;
  }

  private async getDespesas() {
    const totalDespesas = await getContasTotal(this.dateRange);
    return totalDespesas;
  }

  private async getTaxasCartoes() {
    const totalTaxas = await getTaxasCartoes(this.dateRange);
    return totalTaxas;
  }

  async getFirstLine() {
    const { total: totalVendas, lucro } = await this.getVendas();
    const { total: _totalDespesas } = await this.getDespesas();
    const { total: totalTaxas } = await this.getTaxasCartoes();

    const totalDespesas = currency(_totalDespesas).add(totalTaxas).value;

    const balance = currency(lucro).subtract(totalDespesas).value;

    const firstLine = [
      {
        title: "Total Vendas",
        metric: humanizeAmount(totalVendas),
        taxas: null,
        margem: null,
        deltaType: "moderateIncrease" as const,
      },
      {
        title: "Lucro",
        metric: humanizeAmount(lucro),
        taxas: null,
        margem: null,
        deltaType: "moderateIncrease" as const,
      },
      {
        title: "Total Despesas",
        metric: humanizeAmount(totalDespesas),
        taxas: humanizeAmount(totalTaxas),
        margem: null,
        deltaType: "moderateIncrease" as const,
      },
      {
        title: "Balanço",
        metric: humanizeAmount(balance),
        taxas: null,
        margem: null,
        deltaType: "moderateIncrease" as const,
      },
    ];

    return firstLine;
  }
}
