import { Calendar, CreditCard } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { humanizeDate } from "~/lib/utils";
import type { ConciliacaoWithCount } from "~/models/conciliacao.server";

interface ConciliationsListProps {
  conciliations: ConciliacaoWithCount[];
}

export function ConciliationsList({ conciliations }: ConciliationsListProps) {
  if (conciliations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="text-muted-foreground text-lg font-medium">
            Nenhuma conciliação encontrada
          </p>
          <p className="text-muted-foreground text-sm">
            Faça upload de um arquivo CSV para começar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {conciliations.map(conciliacao => (
        <Card
          key={conciliacao.id}
          className="transition-shadow hover:shadow-md"
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-4 w-4" />
              Período
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {humanizeDate(new Date(conciliacao.dataInicial))} até{" "}
                {humanizeDate(new Date(conciliacao.dataFinal))}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {conciliacao._count.cartoes} transações
                </Badge>
              </div>
            </div>
            <Button asChild className="w-full" variant="outline">
              <Link to={`/panel/conciliations/${conciliacao.id}`}>
                Ver Detalhes
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
