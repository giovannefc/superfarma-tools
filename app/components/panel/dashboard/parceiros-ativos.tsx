import { Users } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

interface ParceiroAtivo {
  parceiroId: string;
  _count: { parceiroId: number };
  parceiro?: {
    nome: string;
  };
}

interface ParceirosAtivosProps {
  parceiros: ParceiroAtivo[];
  totalEmprestimos: number;
}

export function ParceirosAtivos({
  parceiros,
  totalEmprestimos,
}: ParceirosAtivosProps) {
  if (parceiros.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Parceiros Mais Ativos
          </CardTitle>
          <CardDescription>
            Parceiros com mais empréstimos registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Nenhum parceiro encontrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...parceiros.map(p => p._count.parceiroId));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Parceiros Mais Ativos
          </CardTitle>
          <CardDescription>
            Top {parceiros.length} parceiros por número de empréstimos
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/panel/emprestimos/parceiros">Ver todos</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {parceiros.map((parceiro, index) => {
            const percentage = (parceiro._count.parceiroId / maxCount) * 100;
            const participacao = (
              (parceiro._count.parceiroId / totalEmprestimos) *
              100
            ).toFixed(1);

            return (
              <div key={parceiro.parceiroId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {parceiro.parceiro?.nome ||
                          `Parceiro ${parceiro.parceiroId}`}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {participacao}% do total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {parceiro._count.parceiroId}
                    </p>
                    <p className="text-muted-foreground text-xs">empréstimos</p>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
