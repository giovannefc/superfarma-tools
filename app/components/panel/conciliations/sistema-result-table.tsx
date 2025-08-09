import { CheckCircle, Monitor, XCircle } from "lucide-react";

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
import type { SistemaResult } from "~/models/types";
import { humanizeAmount, humanizeDate } from "~/utils";

interface SistemaResultTableProps {
  result: SistemaResult[];
  title?: string;
  showOnlyNotFound?: boolean;
}

export function SistemaResultTable({
  result,
  title,
  showOnlyNotFound = false,
}: SistemaResultTableProps) {
  const filteredResult = showOnlyNotFound
    ? result.filter(item => !item.confere)
    : result;

  if (filteredResult.length === 0) {
    return (
      <Card className="bg-muted/20 border-muted">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Monitor className="text-muted-foreground mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            Nenhum registro encontrado
          </p>
        </CardContent>
      </Card>
    );
  }

  const total = filteredResult.reduce(
    (acc, item) => acc + Number(item.valor),
    0,
  );
  const conferidos = filteredResult.filter(item => item.confere).length;

  return (
    <Card>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            {title}
            <Badge variant="outline" className="ml-auto">
              {filteredResult.length} registros
            </Badge>
          </CardTitle>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span>
              <strong>Total: {humanizeAmount(total)}</strong>
            </span>
            {!showOnlyNotFound && (
              <span>
                <strong>
                  Conferidos: {conferidos}/{filteredResult.length}
                </strong>
              </span>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data Emissão</TableHead>
                <TableHead>Data Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Modalidade</TableHead>
                <TableHead>Bandeira</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResult.map((item, index) => (
                <TableRow key={`${item.valor}-${index}`}>
                  <TableCell className="font-mono text-sm">
                    {humanizeDate(new Date(item.dataemissao))}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {humanizeDate(new Date(item.datavencimento))}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {humanizeAmount(Number(item.valor))}
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
                    {item.confere ? (
                      <Badge
                        variant="outline"
                        className="border-emerald-600 text-emerald-600"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Confere
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-destructive text-destructive"
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Não encontrado
                      </Badge>
                    )}
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
