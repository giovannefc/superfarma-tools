import { AlertTriangle, CheckCircle, ClipboardCheck } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { humanizeDate } from "~/lib/utils";

interface EmprestimoRecente {
  id: string;
  data: string;
  produto: string;
  fabricante: string;
  quantidade: number;
  status: "PENDENTE" | "SEPARADO" | "PAGO";
  tipo: "ENTRADA" | "SAIDA";
  parceiro: {
    nome: string;
  };
}

interface EmprestimosRecentesProps {
  emprestimos: EmprestimoRecente[];
}

const statusConfig = {
  PENDENTE: {
    icon: AlertTriangle,
    label: "Pendente",
    className: "text-yellow-600 bg-yellow-50 border-yellow-200",
  },
  SEPARADO: {
    icon: ClipboardCheck,
    label: "Separado",
    className: "text-blue-600 bg-blue-50 border-blue-200",
  },
  PAGO: {
    icon: CheckCircle,
    label: "Pago",
    className: "text-green-600 bg-green-50 border-green-200",
  },
};

const tipoConfig = {
  ENTRADA: {
    label: "Devem para nós",
    className: "text-green-700 bg-green-50",
  },
  SAIDA: {
    label: "Devemos",
    className: "text-red-700 bg-red-50",
  },
};

export function EmprestimosRecentes({ emprestimos }: EmprestimosRecentesProps) {
  if (emprestimos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Empréstimos Recentes</CardTitle>
          <CardDescription>
            Últimos empréstimos registrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Nenhum empréstimo encontrado
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Empréstimos Recentes</CardTitle>
          <CardDescription>
            Últimos {emprestimos.length} empréstimos registrados
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/panel/emprestimos">Ver todos</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emprestimos.map(emprestimo => {
            const StatusIcon = statusConfig[emprestimo.status].icon;

            return (
              <div
                key={emprestimo.id}
                className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`gap-1 ${statusConfig[emprestimo.status].className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[emprestimo.status].label}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={tipoConfig[emprestimo.tipo].className}
                      >
                        {tipoConfig[emprestimo.tipo].label}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {emprestimo.produto}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {emprestimo.fabricante} • {emprestimo.parceiro.nome}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium">
                    {emprestimo.quantidade} un.
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {humanizeDate(new Date(emprestimo.data))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
