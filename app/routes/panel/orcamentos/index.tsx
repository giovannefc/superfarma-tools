import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRevalidator } from "react-router";

import { OrcamentoImageGenerator } from "~/components/panel/orcamentos/orcamento-image-generator";
import { OrcamentoPreview } from "~/components/panel/orcamentos/orcamento-preview";
import { OrcamentoSelector } from "~/components/panel/orcamentos/orcamento-selector";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useLoadingState } from "~/components/ui/loading-bar";
import { InlineLoading } from "~/components/ui/loading-spinner";
import type { Orcamento } from "~/models/types";
import { getOrcamentos } from "~/services/a7-api";
import { requireUser } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);

  try {
    const orcamentos = await getOrcamentos();
    return { orcamentos: orcamentos || [], error: null };
  } catch (error) {
    console.error("Erro ao buscar orçamentos:", error);
    return {
      orcamentos: [],
      error: `Erro ao carregar orçamentos: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    };
  }
}

export default function Orcamentos() {
  const { orcamentos, error } = useLoaderData<typeof loader>();
  const { isLoading } = useLoadingState();
  const revalidator = useRevalidator();

  const [selectedOrcamento, setSelectedOrcamento] = useState<string>("");
  const [orcamento, setOrcamento] = useState<Orcamento | undefined>();
  const [showImageGenerator, setShowImageGenerator] = useState<boolean>(false);

  useEffect(() => {
    if (selectedOrcamento) {
      const orc = orcamentos.find(
        (orc: Orcamento) => orc.codigo === Number(selectedOrcamento),
      );
      setOrcamento(orc);
    } else {
      setOrcamento(undefined);
    }
  }, [selectedOrcamento, orcamentos]);

  const handleClear = () => {
    setSelectedOrcamento("");
    setOrcamento(undefined);
    setShowImageGenerator(false);
    // Revalidar os dados para buscar orçamentos atualizados
    revalidator.revalidate();
  };

  const handleGenerateImage = () => {
    if (orcamento) {
      setShowImageGenerator(true);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
        </div>

        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <OrcamentoSelector
          orcamentos={orcamentos}
          selectedOrcamento={selectedOrcamento}
          onSelectOrcamento={setSelectedOrcamento}
          onClear={handleClear}
          onGenerateImage={handleGenerateImage}
          disabled={isLoading}
          isRevalidating={revalidator.state === "loading"}
        />

        <OrcamentoPreview orcamento={orcamento} />
      </div>

      {/* Gerador de Imagem */}
      {showImageGenerator && orcamento && (
        <OrcamentoImageGenerator
          orcamento={orcamento}
          onClose={() => setShowImageGenerator(false)}
        />
      )}

      {/* Mensagem quando não há orçamentos */}
      {orcamentos.length === 0 && !error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">
              Nenhum orçamento encontrado
            </h3>
            <p className="text-muted-foreground text-center text-sm">
              Não há orçamentos disponíveis no momento. Verifique se há
              orçamentos criados no sistema A7.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      {orcamentos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold">{orcamentos.length}</div>
                <p className="text-muted-foreground text-sm">
                  Total de Orçamentos
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {orcamentos.reduce(
                    (acc: number, orc: Orcamento) =>
                      acc + (orc.items?.length || 0),
                    0,
                  )}
                </div>
                <p className="text-muted-foreground text-sm">Total de Itens</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {
                    orcamentos.filter((orc: Orcamento) => orc.items?.length > 0)
                      .length
                  }
                </div>
                <p className="text-muted-foreground text-sm">
                  Orçamentos com Itens
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
