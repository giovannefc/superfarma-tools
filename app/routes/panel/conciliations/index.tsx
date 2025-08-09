import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { ConciliationsList } from "~/components/panel/conciliations/conciliations-list";
import { CsvUploadSection } from "~/components/panel/conciliations/csv-upload-section";
import { PageHeader } from "~/components/panel/conciliations/page-header";
import { useConciliationForm } from "~/hooks/use-conciliation-form";
import { create, findAll } from "~/models/conciliacao.server";
import type { VendaRede } from "~/models/types";
import { requireUser } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const conciliations = await findAll(user.id);
  return { conciliations };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const data = formData.get("vendas");

  if (!data) {
    return Response.json({ error: "Dados não fornecidos" }, { status: 400 });
  }

  try {
    const vendas = JSON.parse(String(data)) as VendaRede[];

    // Validar se há vendas
    if (!vendas || vendas.length === 0) {
      return Response.json(
        { error: "Nenhuma venda encontrada nos dados" },
        { status: 400 },
      );
    }

    const conciliacao = await create(vendas, user.id);
    return Response.json({ success: true, conciliacao });
  } catch (error) {
    console.error("Erro ao criar conciliação:", error);

    // Retornar erro mais específico
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    return Response.json(
      {
        error: "Erro ao processar conciliação",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}

export default function ConciliationsPage() {
  const { conciliations } = useLoaderData<typeof loader>();
  const { submitConciliation, isLoading } = useConciliationForm();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Conferência de Cartões"
        description="Faça upload do arquivo CSV da Rede para conferir com o sistema"
      />

      <div className="space-y-6">
        <CsvUploadSection
          onProcessFile={submitConciliation}
          isLoading={isLoading}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Conciliações Anteriores
        </h2>
        <ConciliationsList conciliations={conciliations} />
      </div>
    </div>
  );
}
