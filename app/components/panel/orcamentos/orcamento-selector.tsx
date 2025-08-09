import { Download, Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Orcamento } from "~/models/types";

interface OrcamentoSelectorProps {
  orcamentos: Orcamento[];
  selectedOrcamento: string;
  onSelectOrcamento: (value: string) => void;
  onClear: () => void;
  onGenerateImage: () => void;
  disabled?: boolean;
  isRevalidating?: boolean;
}

export function OrcamentoSelector({
  orcamentos,
  selectedOrcamento,
  onSelectOrcamento,
  onClear,
  onGenerateImage,
  disabled = false,
  isRevalidating = false,
}: OrcamentoSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Orçamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Orçamento Alpha 7</label>
          <Select
            value={selectedOrcamento}
            onValueChange={onSelectOrcamento}
            disabled={disabled || isRevalidating}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  disabled || isRevalidating
                    ? "Carregando orçamentos..."
                    : "Selecione um orçamento"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {orcamentos.map(orc => (
                <SelectItem key={orc.codigo} value={orc.codigo.toString()}>
                  {orc.codigo} - {orc.total}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onClear}
            variant="outline"
            disabled={!selectedOrcamento || disabled || isRevalidating}
            className="flex-1"
          >
            {isRevalidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Limpar e atualizar"
            )}
          </Button>
          <Button
            onClick={onGenerateImage}
            disabled={!selectedOrcamento || disabled || isRevalidating}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Gerar Imagem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
