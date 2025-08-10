import {
  ArrowLeft,
  Calendar,
  Receipt,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData, useParams } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ExpensesAdapter } from "~/lib/adapters/reports-expenses.adapter";
import { forceAndGetDateRange } from "~/lib/date-utils";
import { requireUser } from "~/services/auth.server";
import { humanizeAmount, humanizeDate } from "~/utils";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  if (!user?.isAdmin) {
    throw new Response("Acesso negado", { status: 403 });
  }

  const id = params.id;
  if (!id) {
    throw new Response("ID não fornecido", { status: 400 });
  }

  const dateRange = forceAndGetDateRange(request);
  if (dateRange instanceof Response) {
    return dateRange;
  }

  const expensesAdapter = new ExpensesAdapter(dateRange);
  const { category, previousMonths, previousMonthsAvg } =
    await expensesAdapter.getCategoryDetails(id);

  return {
    dateRange,
    category,
    previousMonths,
    previousMonthsAvg,
  };
}

export default function DespesaDetalhes() {
  const { id } = useParams();
  const data = useLoaderData<typeof loader>();

  if (data && "dateRange" in data) {
    const {
      category,
      previousMonths,
      previousMonthsAvg,
      dateRange: { from, to },
    } = data;

    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/panel/relatorios/despesas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {category.caminho}
            </h1>
            <p className="text-muted-foreground">
              Detalhes da categoria de despesa
            </p>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {humanizeAmount(category.totalContaPagar)}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Total do Período
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {humanizeAmount(previousMonthsAvg)}
                  </div>
                  <p className="text-muted-foreground text-sm">Média Mensal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {category.contapagar.length}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Contas no Período
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolução Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previousMonths.map((month, index) => {
                const date = new Date(month.data);
                const monthName = date.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                });
                const maxValue = Math.max(...previousMonths.map(m => m.total));
                const percentage =
                  maxValue > 0 ? (month.total / maxValue) * 100 : 0;

                return (
                  <div key={month.data} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {monthName}
                      </span>
                      <span className="text-sm font-semibold">
                        {humanizeAmount(month.total)}
                      </span>
                    </div>
                    <div className="bg-muted h-2 w-full rounded-full">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Contas */}
        <Card>
          <CardHeader>
            <CardTitle>Contas do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {category.contapagar.map(conta => (
                <div
                  key={conta.id}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-medium">{conta.descricao}</span>
                      <Badge variant="outline" className="text-xs">
                        {humanizeDate(new Date(conta.datavencimentoutil))}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Credor: {conta.credor}
                    </p>
                    {conta.observacao && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        {conta.observacao}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {humanizeAmount(Number(conta.valor))}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Emissão: {humanizeDate(new Date(conta.dataemissao))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <h2 className="text-muted-foreground text-lg font-semibold">
          Carregando detalhes da categoria...
        </h2>
      </div>
    </div>
  );
}
