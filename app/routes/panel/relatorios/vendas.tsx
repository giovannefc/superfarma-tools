import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { DateRange } from "~/components/panel/relatorios/date-range";
import { ResumoCards } from "~/components/panel/relatorios/resumo-cards";
import { TabelaVendas } from "~/components/panel/relatorios/tabela-vendas";
import { VendasChart } from "~/components/panel/relatorios/vendas-chart";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SalesAdapter } from "~/lib/adapters/reports-sales.adapter";
import { forceAndGetDateRange } from "~/lib/date-utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const dateRange = forceAndGetDateRange(request);

  if (dateRange instanceof Response) {
    return dateRange;
  }

  const salesAdapter = new SalesAdapter(dateRange);

  const { adaptedVendasTotals, salesFirstLine, salesSecondLine } =
    await salesAdapter.getFirstLine();

  return {
    dateRange,
    salesFirstLine,
    salesSecondLine,
    adaptedVendasTotals,
  };
}

export default function RelatoriosVendas() {
  const data = useLoaderData<typeof loader>();

  if (data && "dateRange" in data) {
    const {
      salesFirstLine,
      salesSecondLine,
      adaptedVendasTotals,
      dateRange: { from, to },
    } = data;

    return (
      <div className="flex flex-col gap-8">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-semibold">Relatório de Vendas</h1>
        </div>

        <DateRange from={from} to={to} />

        <ResumoCards cards={salesFirstLine}>
          {card => (
            <VendasChart
              title={card.title}
              vendasTotals={adaptedVendasTotals}
            />
          )}
        </ResumoCards>

        <TabelaVendas items={salesSecondLine} title="Métricas Adicionais" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Classificação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground py-8 text-center">
                Componente em desenvolvimento
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Entregas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground py-8 text-center">
                Componente em desenvolvimento
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-center">
        <h2 className="text-muted-foreground text-lg font-semibold">
          Carregando dados...
        </h2>
      </div>
    </div>
  );
}
