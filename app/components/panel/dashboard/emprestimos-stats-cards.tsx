import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle,
  ClipboardCheck,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface EmprestimosStatsCardsProps {
  stats: {
    totalEmprestimos: number;
    emprestimosPendentes: Array<{ status: string; _count: { status: number } }>;
    emprestimosVencidos: number;
    parceirosMaisAtivos: Array<{
      parceiroId: string;
      _count: { parceiroId: number };
    }>;
  };
}

export function EmprestimosStatsCards({ stats }: EmprestimosStatsCardsProps) {
  const pendentesCount =
    stats.emprestimosPendentes.find(item => item.status === "PENDENTE")?._count
      .status || 0;

  const separadosCount =
    stats.emprestimosPendentes.find(item => item.status === "SEPARADO")?._count
      .status || 0;

  const pagosCount =
    stats.emprestimosPendentes.find(item => item.status === "PAGO")?._count
      .status || 0;

  const totalAtivos = pendentesCount + separadosCount;
  const parceiroAtivos = stats.parceirosMaisAtivos.length;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total de Empréstimos */}
      <Card className="from-primary/5 to-card @container/card bg-gradient-to-t shadow-xs">
        <CardHeader>
          <CardDescription>Total de Empréstimos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalEmprestimos}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <ArrowLeftRight className="h-3 w-3" />
              Todos
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Empréstimos registrados <ArrowLeftRight className="size-4" />
          </div>
          <div className="text-muted-foreground">Total no sistema</div>
        </CardFooter>
      </Card>

      {/* Empréstimos Ativos */}
      <Card className="to-card @container/card bg-gradient-to-t from-yellow-500/5 shadow-xs">
        <CardHeader>
          <CardDescription>Empréstimos Ativos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalAtivos}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="gap-1 border-yellow-200 text-yellow-600"
            >
              <AlertTriangle className="h-3 w-3" />
              {totalAtivos > 0 ? "Atenção" : "OK"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {pendentesCount} pendentes, {separadosCount} separados
          </div>
          <div className="text-muted-foreground">Aguardando finalização</div>
        </CardFooter>
      </Card>

      {/* Empréstimos Finalizados */}
      <Card className="to-card @container/card bg-gradient-to-t from-green-500/5 shadow-xs">
        <CardHeader>
          <CardDescription>Empréstimos Pagos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pagosCount}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="gap-1 border-green-200 text-green-600"
            >
              <CheckCircle className="h-3 w-3" />
              Concluídos
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Empréstimos finalizados <CheckCircle className="size-4" />
          </div>
          <div className="text-muted-foreground">Status: Pago</div>
        </CardFooter>
      </Card>

      {/* Parceiros Ativos */}
      <Card className="to-card @container/card bg-gradient-to-t from-blue-500/5 shadow-xs">
        <CardHeader>
          <CardDescription>Parceiros Ativos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {parceiroAtivos}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="gap-1 border-blue-200 text-blue-600"
            >
              <Users className="h-3 w-3" />
              Rede
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Parceiros com empréstimos <Users className="size-4" />
          </div>
          <div className="text-muted-foreground">Rede de colaboração</div>
        </CardFooter>
      </Card>

      {/* Empréstimos Vencidos */}
      {stats.emprestimosVencidos > 0 && (
        <Card className="to-card @container/card bg-gradient-to-t from-red-500/5 shadow-xs @5xl/main:col-span-2">
          <CardHeader>
            <CardDescription>Empréstimos Vencidos</CardDescription>
            <CardTitle className="text-2xl font-semibold text-red-600 tabular-nums @[250px]/card:text-3xl">
              {stats.emprestimosVencidos}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className="gap-1 border-red-200 text-red-600"
              >
                <TrendingDown className="h-3 w-3" />
                Urgente
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-red-600">
              Mais de 30 dias pendentes <AlertTriangle className="size-4" />
            </div>
            <div className="text-muted-foreground">Requer atenção imediata</div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
