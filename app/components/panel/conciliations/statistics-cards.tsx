import { AlertTriangle, CreditCard, Monitor, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { humanizeAmount } from "~/lib/utils";

interface StatisticsCardsProps {
  totalRede: number;
  totalSistema: number;
  redeCount: number;
  sistemaCount: number;
  conferidos: number;
  naoEncontrados: number;
  divergenciaModalidade: number;
  divergenciaBandeira: number;
}

export function StatisticsCards({
  totalRede,
  totalSistema,
  redeCount,
  sistemaCount,
  conferidos,
  naoEncontrados,
  divergenciaModalidade,
  divergenciaBandeira,
}: StatisticsCardsProps) {
  const percentualConferidos =
    redeCount > 0 ? Math.round((conferidos / redeCount) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rede</CardTitle>
          <CreditCard className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{humanizeAmount(totalRede)}</div>
          <p className="text-muted-foreground text-xs">
            {redeCount} transações
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sistema</CardTitle>
          <Monitor className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {humanizeAmount(totalSistema)}
          </div>
          <p className="text-muted-foreground text-xs">
            {sistemaCount} transações
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conferidos</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {conferidos}
          </div>
          <p className="text-muted-foreground text-xs">
            {percentualConferidos}% do total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Não Encontrados</CardTitle>
          <AlertTriangle className="text-destructive h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-2xl font-bold">
            {naoEncontrados}
          </div>
          <p className="text-muted-foreground text-xs">
            {divergenciaModalidade + divergenciaBandeira} divergências
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
