import { ArrowLeft, Calendar, RotateCcw } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { humanizeDate } from "~/utils";

interface ConciliationHeaderProps {
  dataInicial: Date;
  dataFinal: Date;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function ConciliationHeader({
  dataInicial,
  dataFinal,
  onRefresh,
  isRefreshing,
}: ConciliationHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/panel/conciliations">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Calendar className="h-8 w-8" />
          Conciliação
        </h1>
        <p className="text-muted-foreground text-lg">
          {humanizeDate(new Date(dataInicial))} até{" "}
          {humanizeDate(new Date(dataFinal))}
        </p>
      </div>
      <Button onClick={onRefresh} variant="outline" disabled={isRefreshing}>
        {isRefreshing ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Atualizando...
          </>
        ) : (
          <>
            <RotateCcw className="mr-2 h-4 w-4" />
            Atualizar
          </>
        )}
      </Button>
    </div>
  );
}
