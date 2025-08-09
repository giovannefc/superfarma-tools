import { Eye, FileText } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import type { Orcamento } from "~/models/types";

interface OrcamentoPreviewProps {
  orcamento?: Orcamento;
}

export function OrcamentoPreview({ orcamento }: OrcamentoPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Preview do Orçamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orcamento ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Orçamento #{orcamento.codigo}
              </h3>
              <Badge variant="outline">
                {orcamento.items?.length || 0} itens
              </Badge>
            </div>

            <div className="space-y-2">
              {orcamento.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-xs">
                      Qtd: {item.qty} | Valor unit: {item.amount}
                    </p>
                  </div>
                  <div className="font-semibold">{item.total}</div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>{orcamento.total}</span>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12" />
            <p>Selecione um orçamento para visualizar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
