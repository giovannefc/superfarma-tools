import { ArrowRight, PieChart, TrendingDown } from "lucide-react";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";

import { DateRange } from "~/components/panel/relatorios/date-range";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ExpensesAdapter } from "~/lib/adapters/reports-expenses.adapter";
import { forceAndGetDateRange } from "~/lib/date-utils";
import { humanizeAmount } from "~/lib/utils";
import { requireUser } from "~/services/auth.server";
import { formatDateOnly } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);

  const dateRange = forceAndGetDateRange(request);
  if (dateRange instanceof Response) {
    return dateRange;
  }

  const expensesAdapter = new ExpensesAdapter(dateRange);
  const { categoriesTotals, totalsGroupedParent } =
    await expensesAdapter.getCategoriesTotals();

  return {
    dateRange,
    categoriesTotals,
    totalsGroupedParent,
  };
}

export default function DespesasIndex() {
  const data = useLoaderData<typeof loader>();

  if (data && "dateRange" in data) {
    const {
      categoriesTotals,
      totalsGroupedParent,
      dateRange: { from, to },
    } = data;

    return (
      <div className="flex flex-col gap-8">
        <div className="border-b pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Relatório de Despesas
              </h1>
              <p className="text-muted-foreground mt-2">
                Análise detalhada das despesas por categoria
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1">
                <TrendingDown className="mr-1 h-3 w-3" />
                {categoriesTotals.totals.length} categorias
              </Badge>
            </div>
          </div>
        </div>

        <DateRange from={from} to={to} />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lista de Categorias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Despesas por Categoria
                <Badge variant="secondary">
                  {humanizeAmount(categoriesTotals.total)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoriesTotals.totals.map(categoria => (
                  <Link
                    key={categoria.id}
                    to={`/panel/relatorios/despesas/${categoria.id}?from=${formatDateOnly(from)}&to=${formatDateOnly(to)}`}
                    className="hover:bg-muted/50 group flex items-center justify-between rounded-lg border p-3 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="group-hover:text-primary font-medium transition-colors">
                        {categoria.caminho}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Categoria pai: {categoria.nomePai || "Sem categoria"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {humanizeAmount(categoria.total)}
                      </span>
                      <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Distribuição por Categoria Pai */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribuição por Categoria Pai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {totalsGroupedParent.map((categoria, index) => {
                  const percentage =
                    (categoria.total / categoriesTotals.total) * 100;
                  return (
                    <div key={categoria.nome} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {categoria.nome}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {humanizeAmount(categoria.total)}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted h-2 w-full rounded-full">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {humanizeAmount(categoriesTotals.total)}
                </div>
                <p className="text-muted-foreground text-sm">
                  Total de Despesas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {categoriesTotals.totals.length}
                </div>
                <p className="text-muted-foreground text-sm">Categorias</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {humanizeAmount(
                    categoriesTotals.total / categoriesTotals.totals.length,
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  Média por Categoria
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <h2 className="text-muted-foreground text-lg font-semibold">
          Carregando dados das despesas...
        </h2>
      </div>
    </div>
  );
}
