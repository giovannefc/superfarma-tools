import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  DollarSign,
  Minus,
  PiggyBank,
  TrendingUp,
} from "lucide-react";
import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { DateRange } from "~/components/panel/relatorios/date-range";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { BalanceAdapter } from "~/lib/adapters/reports-balance.adapter";
import { forceAndGetDateRange } from "~/lib/date-utils";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const dateRange = forceAndGetDateRange(request);

  if (dateRange instanceof Response) {
    return dateRange;
  }

  const balanceAdapter = new BalanceAdapter(dateRange);
  const balanceFirstLine = await balanceAdapter.getFirstLine();

  return {
    dateRange,
    balanceFirstLine,
  };
}

function getCardIcon(title: string) {
  switch (title) {
    case "Total Vendas":
      return <DollarSign className="h-5 w-5" />;
    case "Lucro":
      return <PiggyBank className="h-5 w-5" />;
    case "Total Despesas":
      return <CreditCard className="h-5 w-5" />;
    case "Balanço":
      return <BarChart3 className="h-5 w-5" />;
    default:
      return <Activity className="h-5 w-5" />;
  }
}

function getDeltaIcon(deltaType: string) {
  switch (deltaType) {
    case "moderateIncrease":
      return <ArrowUpRight className="h-4 w-4" />;
    case "moderateDecrease":
      return <ArrowDownRight className="h-4 w-4" />;
    default:
      return <Minus className="h-4 w-4" />;
  }
}
function getCardVariant(title: string, deltaType: string) {
  if (title === "Balanço") {
    return deltaType === "moderateIncrease"
      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800"
      : "bg-gradient-to-br from-red-50 to-rose-50 border-red-200 dark:from-red-950 dark:to-rose-950 dark:border-red-800";
  }

  if (title === "Total Vendas") {
    return "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950 dark:to-cyan-950 dark:border-blue-800";
  }

  if (title === "Lucro") {
    return "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 dark:from-emerald-950 dark:to-teal-950 dark:border-emerald-800";
  }

  if (title === "Total Despesas") {
    return "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 dark:from-orange-950 dark:to-amber-950 dark:border-orange-800";
  }

  return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 dark:from-gray-950 dark:to-slate-950 dark:border-gray-800";
}

function getIconColor(title: string) {
  switch (title) {
    case "Total Vendas":
      return "text-blue-600 dark:text-blue-400";
    case "Lucro":
      return "text-emerald-600 dark:text-emerald-400";
    case "Total Despesas":
      return "text-orange-600 dark:text-orange-400";
    case "Balanço":
      return "text-purple-600 dark:text-purple-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}

function getBadgeVariant(deltaType: string) {
  switch (deltaType) {
    case "moderateIncrease":
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700";
    case "moderateDecrease":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700";
  }
}
export default function RelatoriosIndex() {
  const data = useLoaderData<typeof loader>();

  if (data && "dateRange" in data) {
    const {
      balanceFirstLine,
      dateRange: { from, to },
    } = data;

    // Calcular progresso baseado nos valores (exemplo)
    const totalVendas =
      parseFloat(
        balanceFirstLine[0].metric.replace(/[^\d,.-]/g, "").replace(",", "."),
      ) || 0;
    const lucro =
      parseFloat(
        balanceFirstLine[1].metric.replace(/[^\d,.-]/g, "").replace(",", "."),
      ) || 0;
    const margemLucro = totalVendas > 0 ? (lucro / totalVendas) * 100 : 0;

    return (
      <div className="flex flex-col gap-8">
        <div className="border-b pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Relatório de Balanço
              </h1>
              <p className="text-muted-foreground mt-2">
                Visão geral do desempenho financeiro do período selecionado
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1">
                <Activity className="mr-1 h-3 w-3" />
                Atualizado
              </Badge>
            </div>
          </div>
        </div>

        <DateRange from={from} to={to} />

        {/* Cards principais */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {balanceFirstLine.map((item, index) => (
            <Card
              key={item.title}
              className={cn(
                "relative overflow-hidden transition-all duration-200 hover:shadow-lg",
                getCardVariant(item.title, item.deltaType),
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "rounded-lg bg-white/50 p-2 dark:bg-black/20",
                      getIconColor(item.title),
                    )}
                  >
                    {getCardIcon(item.title)}
                  </div>
                  <CardTitle className="text-muted-foreground text-sm font-medium">
                    {item.title}
                  </CardTitle>
                </div>
                <div
                  className={cn(
                    "rounded-full p-1",
                    getBadgeVariant(item.deltaType),
                  )}
                >
                  {getDeltaIcon(item.deltaType)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold tracking-tight">
                  {item.metric}
                </div>

                {/* Barra de progresso para margem de lucro */}
                {item.title === "Lucro" && (
                  <div className="space-y-2">
                    <div className="text-muted-foreground flex justify-between text-xs">
                      <span>Margem de Lucro</span>
                      <span>{margemLucro.toFixed(1)}%</span>
                    </div>
                    <Progress value={margemLucro} className="h-2" />
                  </div>
                )}

                {/* Badges para informações adicionais */}
                <div className="flex flex-wrap gap-2">
                  {item.margem && (
                    <Badge
                      variant="secondary"
                      className={getBadgeVariant(item.deltaType)}
                    >
                      Margem: {item.margem}
                    </Badge>
                  )}
                  {item.taxas && (
                    <Badge variant="outline" className="text-xs">
                      Taxas: {item.taxas}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Seção de insights */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">Análise de Performance</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Margem de Lucro
                </span>
                <span className="font-medium">{margemLucro.toFixed(1)}%</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Eficiência Operacional
                </span>
                <Badge variant="outline">Boa</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Tendência</span>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">Crescimento</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold">Resumo Executivo</h3>
            </div>
            <div className="text-muted-foreground space-y-3 text-sm">
              <p>
                O período apresenta um desempenho positivo com margem de lucro
                de{" "}
                <span className="text-foreground font-medium">
                  {margemLucro.toFixed(1)}%
                </span>
                .
              </p>
              <p>
                As vendas estão dentro do esperado e as despesas controladas,
                resultando em um balanço favorável.
              </p>
              <div className="pt-2">
                <Badge variant="outline" className="text-xs">
                  Período: {from.toLocaleDateString()} -{" "}
                  {to.toLocaleDateString()}
                </Badge>
              </div>
            </div>
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
          Carregando dados do balanço...
        </h2>
      </div>
    </div>
  );
}
