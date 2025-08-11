import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { humanizeAmount, humanizeDate } from "~/lib/utils";
import type { RedeResult } from "~/models/types";

interface RedeResultTableProps {
  result: RedeResult[];
  title?: string;
  variant?: "success" | "error" | "warning" | "default";
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  error: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
  },
  warning: {
    icon: AlertCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  default: {
    icon: CheckCircle,
    color: "text-muted-foreground",
    bgColor: "bg-muted/20",
    borderColor: "border-muted",
  },
};

export function RedeResultTable({
  result,
  title,
  variant = "default",
}: RedeResultTableProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  if (result.length === 0) {
    return (
      <Card className={`${config.bgColor} ${config.borderColor}`}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Icon className={`h-8 w-8 ${config.color} mb-2`} />
          <p className="text-muted-foreground text-sm">
            Nenhum registro encontrado
          </p>
        </CardContent>
      </Card>
    );
  }

  const total = result.reduce((acc, item) => acc + Number(item.valor), 0);

  return (
    <Card className={`${config.bgColor} ${config.borderColor}`}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            {title}
            <Badge variant="outline" className="ml-auto">
              {result.length} registros
            </Badge>
          </CardTitle>
          <div className="text-muted-foreground text-sm">
            <strong>Total: {humanizeAmount(total)}</strong>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Modalidade</TableHead>
                <TableHead>Bandeira</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">
                    {humanizeDate(new Date(item.dataHora))}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {(() => {
                      const valor = Number(item.valor);
                      return humanizeAmount(valor);
                    })()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.modalidade === "crédito" ? "default" : "secondary"
                      }
                    >
                      {item.modalidade}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.bandeira}</TableCell>
                  <TableCell className="text-center">{item.parcelas}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.confere ? (
                        <Badge
                          variant="outline"
                          className="border-green-600 text-green-600"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Confere
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-red-600 text-red-600"
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Não confere
                        </Badge>
                      )}
                      {item.confere && !item.confereModalidade && (
                        <Badge
                          variant="outline"
                          className="border-orange-600 text-orange-600"
                        >
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Modalidade
                        </Badge>
                      )}
                      {item.confere &&
                        item.confereModalidade &&
                        !item.confereBandeira && (
                          <Badge
                            variant="outline"
                            className="border-orange-600 text-orange-600"
                          >
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Bandeira
                          </Badge>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
