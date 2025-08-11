import { CreditCard, FileText } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { FileUpload } from "~/components/panel/conciliations/file-upload";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { parseCSV, parseRedeCSV, readFileAsText } from "~/lib/parsers";
import type { VendaRede } from "~/models/types";

interface CsvUploadSectionProps {
  onProcessFile: (vendas: VendaRede[]) => void;
  isLoading: boolean;
}

export function CsvUploadSection({
  onProcessFile,
  isLoading,
}: CsvUploadSectionProps) {
  const [vendasRede, setVendasRede] = useState<VendaRede[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const csvText = await readFileAsText(file);

      // Tentar primeiro o parser específico da Rede
      try {
        const vendas = parseRedeCSV(csvText);

        if (vendas.length === 0) {
          toast.error("Nenhuma venda encontrada no arquivo");
          return;
        }

        setVendasRede(vendas);
        toast.success(`${vendas.length} registros carregados com sucesso!`);
        return;
      } catch (redeError) {
        // Fallback para parser genérico
        const result = parseCSV<VendaRede>(csvText, {
          header: true,
          skipEmptyLines: true,
          delimiter: ";",
        });

        if (result.errors.length > 0) {
          toast.error(`Erros no arquivo: ${result.errors.join(", ")}`);
          return;
        }

        if (result.data.length === 0) {
          toast.error("Arquivo CSV vazio ou inválido");
          return;
        }

        setVendasRede(result.data);
        toast.success(
          `${result.data.length} registros carregados com sucesso!`,
        );
      }
    } catch (error) {
      toast.error("Erro ao processar arquivo CSV");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleProcessFile = () => {
    if (vendasRede.length === 0) {
      toast.error("Nenhum arquivo carregado");
      return;
    }

    // Validar estrutura dos dados antes de enviar
    const primeiraVenda = vendasRede[0];
    const camposObrigatorios = [
      "data da venda",
      "hora da venda",
      "valor da venda original",
      "modalidade",
      "bandeira",
    ];

    const camposFaltando = camposObrigatorios.filter(
      campo => !(primeiraVenda as any)[campo],
    );

    if (camposFaltando.length > 0) {
      toast.error(
        `Campos obrigatórios não encontrados no CSV: ${camposFaltando.join(", ")}`,
      );
      return;
    }

    onProcessFile(vendasRede);
  };

  const isLoadingState = isLoading || isProcessing;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload do Arquivo CSV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUpload
          onFileSelect={handleFileSelect}
          accept=".csv"
          maxSize={10}
        />

        {vendasRede.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {vendasRede.length} registros
                </Badge>
                <span className="text-sm text-green-700 dark:text-green-300">
                  Arquivo processado com sucesso
                </span>
              </div>
              <Button
                onClick={handleProcessFile}
                disabled={isLoadingState}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoadingState ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Conferir Cartões
                  </>
                )}
              </Button>
            </div>

            {/* Preview dos dados */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preview dos Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong>Primeira venda:</strong>
                  </div>
                  <div className="bg-muted rounded p-2 font-mono text-xs">
                    <div>
                      Data:{" "}
                      {vendasRede[0]?.["data da venda"] || "❌ Não encontrado"}
                    </div>
                    <div>
                      Hora:{" "}
                      {vendasRede[0]?.["hora da venda"] || "❌ Não encontrado"}
                    </div>
                    <div>
                      Valor:{" "}
                      {vendasRede[0]?.["valor da venda original"] ||
                        "❌ Não encontrado"}
                    </div>
                    <div>
                      Modalidade:{" "}
                      {vendasRede[0]?.modalidade || "❌ Não encontrado"}
                    </div>
                    <div>
                      Bandeira: {vendasRede[0]?.bandeira || "❌ Não encontrado"}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    <strong>Campos disponíveis:</strong>{" "}
                    {Object.keys(vendasRede[0] || {}).join(", ")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
